/**
 * Reproducible Phase 3 0 A.D. 3D Asset Importer (CC BY-SA 3.0).
 * Downloads pre-assembled meshopt + WebP GLB actors from pinned codepawl/0ad-art-glb
 * metadata, verifies glTF headers & licenses, and writes runtime + provenance manifests.
 *
 * Usage:
 *   node scripts/import_0ad_assets.mjs --family india
 *   node scripts/import_0ad_assets.mjs --family all
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const HF_REPO = 'https://huggingface.co/datasets/codepawl/0ad-art-glb';
const HF_REF = 'main';

const FAMILIES = {
  india: {
    label: 'Indian Kingdoms (Vijayanagara Flagship)',
    units: {
      infantry: 'units-mauryas-infantry-swordsman-c',
      spearmen: 'units-mauryas-infantry-spearman-e',
      pikes: 'units-mauryas-infantry-spearman-e',
      heavy_infantry: 'units-mauryas-infantry-maceman-c',
      guard: 'units-mauryas-hero-infantry-swordsman-chandragupta',
      archers: 'units-mauryas-infantry-archer-c',
      cavalry: 'units-mauryas-cavalry-swordsman-e-m',
      horsebow: 'units-mauryas-cavalry-javelinist-e-m',
      elephants: 'units-mauryas-elephantry-c-m',
      commander: 'units-mauryas-hero-infantry-swordsman-chandragupta',
      siege_ram: 'structures-mauryas-siege-ram'
    }
  },
  east_asia: {
    label: 'East Asian Kingdoms (Ming / Joseon)',
    units: {
      infantry: 'units-han-infantry-swordsman-e',
      spearmen: 'units-han-infantry-spearman-e',
      pikes: 'units-han-infantry-halberdman-e',
      heavy_infantry: 'units-han-infantry-swordsman-c',
      guard: 'units-han-hero-infantry-han-xin',
      archers: 'units-han-infantry-archer-c',
      crossbow: 'units-han-infantry-crossbowman-c',
      cavalry: 'units-han-cavalry-swordsman-e-m',
      horsebow: 'units-han-cavalry-archer-a-m',
      commander: 'units-han-hero-infantry-han-xin',
      siege_catapult: 'units-han-siege-mangonel',
      siege_tower: 'structures-han-siege-tower'
    }
  },
  persia: {
    label: 'Persian & Middle Eastern Realms (Ottomans / Timurids / Mamluks / Persia)',
    units: {
      infantry: 'units-persians-infantry-spearman-e',
      spearmen: 'units-persians-infantry-spearman-e',
      pikes: 'units-persians-infantry-spearman-c3',
      heavy_infantry: 'units-persians-infantry-spearman-c3',
      guard: 'units-persians-hero-cavalry-spearman-cyrus-m',
      archers: 'units-persians-infantry-archer-c',
      cavalry: 'units-persians-cavalry-axeman-e-m',
      horsebow: 'units-persians-cavalry-archer-e-m',
      elephants: 'units-persians-elephantry-c-m',
      commander: 'units-persians-hero-infantry-archer-xerxes',
      siege_ram: 'structures-persians-siege-ram'
    }
  },
  europe: {
    label: 'European Realms (0 A.D. Classical Pikes/Siege + KayKit Knights)',
    units: {
      pikes: 'units-macedonians-infantry-pikeman-e',
      heavy_infantry: 'units-seleucids-infantry-swordsman-e',
      cavalry: 'units-seleucids-cavalry-spearman-e-m',
      commander: 'units-macedonians-hero-infantry-pikeman-philip',
      siege_ram: 'units-romans-siege-ram',
      siege_catapult: 'units-romans-siege-onager',
      siege_gate: 'structures-romans-siege-wall-gate',
      siege_wall: 'structures-romans-siege-wall-medium',
      siege_tower: 'structures-romans-siege-wall-tower'
    }
  }
};

function parseArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'sovereign1450-importer/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const requested = parseArg('--family', 'india');
  const selectedKeys = requested === 'all' ? Object.keys(FAMILIES) : [requested];
  for (const k of selectedKeys) {
    if (!FAMILIES[k]) throw new Error(`Unknown family: ${k}. Valid: ${Object.keys(FAMILIES).join(', ')}, all`);
  }

  console.log(`Fetching 0ad-art-glb metadata from ${HF_REPO}...`);
  const [licenseBuf, metaBuf] = await Promise.all([
    fetchBuffer(`${HF_REPO}/resolve/${HF_REF}/LICENSES.md`),
    fetchBuffer(`${HF_REPO}/resolve/${HF_REF}/metadata.jsonl`)
  ]);
  const licenseText = licenseBuf.toString('utf8');
  if (!/CC[- ]BY[- ]SA[- ]3\.0/i.test(licenseText)) {
    throw new Error('Unexpected license text in upstream LICENSES.md');
  }

  const metaMap = new Map();
  for (const line of metaBuf.toString('utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    const row = JSON.parse(line);
    if (row?.id) metaMap.set(row.id, row);
  }

  const outRoot = path.join('assets', 'battle', '0ad');
  await fs.mkdir(outRoot, { recursive: true });
  await fs.writeFile(
    path.join(outRoot, 'LICENSES.md'),
    `${licenseText.trim()}\n\nImported from: ${HF_REPO}\nAttribution: Wildfire Games (https://www.wildfiregames.com/) & codepawl/0ad-art-glb\n`,
    'utf8'
  );

  // Merge with existing manifest & provenance if re-running for additional families.
  const manifestPath = path.join(outRoot, 'manifest.json');
  const provPath = path.join('docs', 'production', '0ad_asset_provenance.json');
  let runtimeManifest = { version: 1, license: 'CC-BY-SA-3.0', attribution: 'Wildfire Games (0 A.D.) / codepawl/0ad-art-glb', families: {} };
  try {
    runtimeManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  } catch {}
  let provenanceByOut = new Map();
  try {
    const existing = JSON.parse(await fs.readFile(provPath, 'utf8'));
    for (const entry of existing.assets || []) provenanceByOut.set(entry.outputPath, entry);
  } catch {}

  for (const familyKey of selectedKeys) {
    const fam = FAMILIES[familyKey];
    const famDir = path.join(outRoot, familyKey);
    await fs.mkdir(famDir, { recursive: true });
    runtimeManifest.families[familyKey] = { label: fam.label, roles: {} };

    const seenIds = new Map();
    for (const [role, assetId] of Object.entries(fam.units)) {
      const row = metaMap.get(assetId);
      if (!row) throw new Error(`Missing ${assetId} in upstream metadata.jsonl`);
      const webRel = row.files?.web;
      if (!webRel) throw new Error(`Missing web tier path for ${assetId}`);

      const filename = `${assetId}.glb`;
      const destRel = path.posix.join('assets', 'battle', '0ad', familyKey, filename);
      if (!seenIds.has(assetId)) {
        const destFs = path.join(famDir, filename);
        let data = null;
        try {
          const existing = await fs.readFile(destFs);
          if (existing.subarray(0, 4).toString('utf8') === 'glTF') data = existing;
        } catch {}
        if (!data) {
          const url = `${HF_REPO}/resolve/${HF_REF}/${webRel}`;
          console.log(`  Downloading ${familyKey}/${role}: ${webRel}`);
          data = await fetchBuffer(url);
          if (data.subarray(0, 4).toString('utf8') !== 'glTF') {
            throw new Error(`Invalid glTF header on downloaded ${url}`);
          }
          await fs.writeFile(destFs, data);
        } else {
          console.log(`  Cached ${familyKey}/${role}: ${destRel}`);
        }
        const sha256 = crypto.createHash('sha256').update(data).digest('hex');
        seenIds.set(assetId, { data, sha256 });
        provenanceByOut.set(destRel, {
          id: `${familyKey}_${assetId}`,
          upstreamId: assetId,
          family: familyKey,
          role,
          sourceRepo: HF_REPO,
          upstreamRevision: HF_REF,
          actorOrPath: webRel,
          upstreamActorXml: row.actor || null,
          upstreamSourceUrl: row.source_url || null,
          authors: row.authors || 'Wildfire Games (https://www.wildfiregames.com/)',
          license: row.license || 'CC BY-SA 3.0',
          triangles: row.triangles || 0,
          clips: row.clips || [],
          bytes: data.length,
          sha256,
          modifications: 'Upstream meshopt + WebP glTF bundle unchanged; path mapped for Sovereign 1450 battle manifest',
          outputPath: destRel
        });
      }

      runtimeManifest.families[familyKey].roles[role] = {
        path: destRel,
        assetId,
        mounted: /-m$|-m\b|elephant/i.test(assetId),
        clips: row.clips || [],
        triangles: row.triangles || 0
      };
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(runtimeManifest, null, 2) + '\n', 'utf8');
  await fs.mkdir(path.dirname(provPath), { recursive: true });
  await fs.writeFile(
    provPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        license: 'CC-BY-SA-3.0',
        attribution: '0 A.D. art by Wildfire Games (https://www.wildfiregames.com/), packaged via codepawl/0ad-art-glb',
        assets: [...provenanceByOut.values()].sort((a, b) => a.outputPath.localeCompare(b.outputPath))
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
  console.log(`Updated ${manifestPath} and ${provPath} (${provenanceByOut.size} unique imported GLBs).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
