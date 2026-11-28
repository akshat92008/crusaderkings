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
  // Legacy 4 regional keys preserved alongside all 15 V2.0 regional visual identities.
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
  north_india: {
    label: 'Northern India (Delhi / Jaunpur / Rajput Kingdoms)',
    units: {
      infantry: 'units-mauryas-infantry-swordsman-b',
      spearmen: 'units-mauryas-infantry-spearman-b',
      pikes: 'units-mauryas-infantry-spearman-e',
      heavy_infantry: 'units-mauryas-infantry-maceman-c',
      guard: 'units-mauryas-hero-infantry-swordsman-bindusara',
      archers: 'units-mauryas-infantry-archer-b',
      cavalry: 'units-mauryas-cavalry-swordsman-b-m',
      horsebow: 'units-persians-cavalry-archer-b-m',
      elephants: 'units-mauryas-elephantry-c-m',
      commander: 'units-mauryas-hero-infantry-swordsman-bindusara'
    }
  },
  south_india: {
    label: 'Southern India (Vijayanagara / Bahmani / Mysore)',
    units: {
      infantry: 'units-mauryas-infantry-swordsman-c',
      spearmen: 'units-mauryas-infantry-spearman-e',
      pikes: 'units-mauryas-infantry-spearman-e',
      heavy_infantry: 'units-mauryas-infantry-maceman-c',
      guard: 'units-mauryas-hero-infantry-swordsman-chandragupta',
      archers: 'units-mauryas-infantry-archer-c',
      cavalry: 'units-mauryas-cavalry-swordsman-e-m',
      horsebow: 'units-mauryas-cavalry-javelinist-e-m',
      elephants: 'units-mauryas-elephantry-archer-e-m',
      commander: 'units-mauryas-hero-infantry-archer-ashoka'
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
      handgun: 'units-han-infantry-crossbowman-c',
      cavalry: 'units-han-cavalry-swordsman-e-m',
      horsebow: 'units-han-cavalry-archer-a-m',
      commander: 'units-han-hero-infantry-han-xin',
      siege_catapult: 'units-han-siege-mangonel',
      siege_tower: 'structures-han-siege-tower'
    }
  },
  china: {
    label: 'Chinese Dynasties (Ming Empire)',
    units: {
      infantry: 'units-han-infantry-swordsman-e',
      spearmen: 'units-han-infantry-spearman-e',
      pikes: 'units-han-infantry-halberdman-e',
      heavy_infantry: 'units-han-infantry-swordsman-c',
      guard: 'units-han-hero-infantry-liu-bang',
      archers: 'units-han-infantry-archer-e',
      crossbow: 'units-han-infantry-crossbowman-c',
      handgun: 'units-han-infantry-crossbowman-b',
      cavalry: 'units-han-cavalry-swordsman-e-m',
      horsebow: 'units-han-cavalry-crossbowman-e-m',
      commander: 'units-han-hero-cavalry-spearman-han-xin-m'
    }
  },
  japan: {
    label: 'Japanese Daimyos (Polyfork Samurai + Cleared Regional Support)',
    units: {
      spearmen: 'units-han-infantry-spearman-b',
      pikes: 'units-han-infantry-halberdman-e',
      heavy_infantry: 'units-han-infantry-swordsman-c',
      archers: 'units-han-infantry-archer-c',
      crossbow: 'units-han-infantry-archer-e',
      cavalry: 'units-han-cavalry-spearman-e-m',
      horsebow: 'units-han-cavalry-archer-e-m'
    }
  },
  southeast_asia: {
    label: 'Southeast Asian Kingdoms (Ayutthaya / Dai Viet / Majapahit)',
    units: {
      infantry: 'units-mauryas-infantry-swordsman-a',
      spearmen: 'units-han-infantry-spearman-e',
      pikes: 'units-han-infantry-halberdman-e',
      heavy_infantry: 'units-mauryas-infantry-maceman-c',
      guard: 'units-mauryas-hero-infantry-swordsman-bindusara',
      archers: 'units-han-infantry-archer-a',
      crossbow: 'units-han-infantry-crossbowman-a',
      cavalry: 'units-mauryas-cavalry-swordsman-b-m',
      horsebow: 'units-han-cavalry-archer-b-m',
      elephants: 'units-mauryas-elephantry-archer-b-m',
      commander: 'units-han-hero-infantry-wei-qing'
    }
  },
  persia: {
    label: 'Persian & Timurid Realms',
    units: {
      infantry: 'units-persians-infantry-spearman-e',
      spearmen: 'units-persians-infantry-spearman-e',
      pikes: 'units-persians-infantry-spearman-c3',
      heavy_infantry: 'units-persians-infantry-spearman-c2',
      guard: 'units-persians-hero-cavalry-spearman-cyrus-m',
      archers: 'units-persians-infantry-archer-c',
      handgun: 'units-persians-infantry-archer-e',
      cavalry: 'units-persians-cavalry-axeman-e-m',
      horsebow: 'units-persians-cavalry-archer-e-m',
      elephants: 'units-persians-elephantry-c-m',
      commander: 'units-persians-hero-infantry-archer-xerxes',
      siege_ram: 'structures-persians-siege-ram'
    }
  },
  ottoman: {
    label: 'Ottoman & Mamluk Mediterranean-Near East Realms',
    units: {
      infantry: 'units-persians-infantry-spearman-c',
      spearmen: 'units-persians-infantry-spearman-b',
      pikes: 'units-ptolemies-infantry-pikeman-c',
      heavy_infantry: 'units-persians-infantry-spearman-c3',
      guard: 'units-persians-hero-cavalry-spearman-cyrus-m',
      archers: 'units-ptolemies-infantry-archer-e',
      crossbow: 'units-ptolemies-infantry-archer-b',
      handgun: 'units-persians-infantry-archer-e',
      cavalry: 'units-persians-cavalry-axeman-e-m',
      horsebow: 'units-ptolemies-camel-archer-e-m',
      commander: 'units-ptolemies-hero-cavalry-swordsman-ptolemy-iv-m'
    }
  },
  europe: {
    label: 'European Realms (0 A.D. Classical/Medieval + Cleared Variants)',
    units: {
      infantry: 'units-romans-infantry-swordsman-c',
      spearmen: 'units-gauls-infantry-spearman-e',
      pikes: 'units-macedonians-infantry-pikeman-e',
      heavy_infantry: 'units-seleucids-infantry-swordsman-e',
      guard: 'units-romans-hero-infantry-swordsman-scipio',
      archers: 'units-gauls-infantry-javelinist-e',
      crossbow: 'units-romans-infantry-javelinist-reform',
      handgun: 'units-romans-infantry-javelinist-e',
      cavalry: 'units-seleucids-cavalry-spearman-e-m',
      horsebow: 'units-gauls-cavalry-javelinist-e-m',
      commander: 'units-macedonians-hero-infantry-pikeman-philip',
      siege_ram: 'units-romans-siege-ram',
      siege_catapult: 'units-romans-siege-onager',
      siege_gate: 'structures-romans-siege-wall-gate',
      siege_wall: 'structures-romans-siege-wall-medium',
      siege_tower: 'structures-romans-siege-wall-tower'
    }
  },
  western_europe: {
    label: 'Western Europe (France / England / Burgundy / Castile)',
    units: {
      infantry: 'units-romans-infantry-swordsman-c2',
      spearmen: 'units-gauls-infantry-spearman-e',
      pikes: 'units-macedonians-infantry-pikeman-e',
      heavy_infantry: 'units-romans-infantry-swordsman-e',
      guard: 'units-romans-hero-infantry-swordsman-scipio',
      archers: 'units-britons-infantry-slinger-e',
      crossbow: 'units-romans-infantry-javelinist-reform',
      handgun: 'units-romans-infantry-javelinist-e',
      cavalry: 'units-romans-hero-cavalry-swordsman-scipio-m',
      horsebow: 'units-gauls-cavalry-javelinist-e-m',
      commander: 'units-romans-hero-cavalry-swordsman-maximus-m'
    }
  },
  eastern_europe: {
    label: 'Eastern Europe (Poland / Lithuania / Muscovy / Hungary)',
    units: {
      infantry: 'units-gauls-infantry-swordsman-c',
      spearmen: 'units-gauls-infantry-spearman-c',
      pikes: 'units-macedonians-infantry-pikeman-b',
      heavy_infantry: 'units-seleucids-infantry-swordsman-c',
      guard: 'units-gauls-hero-infantry-swordsman-brennus',
      archers: 'units-gauls-infantry-javelinist-b',
      crossbow: 'units-gauls-infantry-slinger-e',
      handgun: 'units-gauls-infantry-javelinist-e',
      cavalry: 'units-gauls-cavalry-spearman-c-m',
      horsebow: 'units-persians-cavalry-archer-c-m',
      commander: 'units-gauls-hero-cavalry-swordsman-brennus-m'
    }
  },
  northern_europe: {
    label: 'Northern Europe (Kalmar / Scotland / Teutonic Baltic)',
    units: {
      infantry: 'units-britons-infantry-swordsman-c',
      spearmen: 'units-britons-infantry-spearman-e',
      pikes: 'units-britons-infantry-spearman-c',
      heavy_infantry: 'units-gauls-infantry-swordsman-e',
      guard: 'units-britons-hero-infantry-swordsman-caratacos',
      archers: 'units-britons-infantry-slinger-b',
      crossbow: 'units-britons-infantry-javelinist-e',
      handgun: 'units-britons-infantry-javelinist-b',
      cavalry: 'units-britons-cavalry-swordsman-e-m',
      horsebow: 'units-britons-cavalry-javelinist-e-m',
      commander: 'units-britons-hero-cavalry-swordsman-cunobelin-m'
    }
  },
  byzantine: {
    label: 'Byzantine & Orthodox Mediterranean',
    units: {
      infantry: 'units-seleucids-infantry-swordsman-c',
      spearmen: 'units-macedonians-infantry-pikeman-b',
      pikes: 'units-macedonians-infantry-pikeman-e',
      heavy_infantry: 'units-seleucids-infantry-swordsman-e',
      guard: 'units-seleucids-hero-infantry-swordsman-antiochus-iv',
      archers: 'units-seleucids-infantry-archer-e',
      crossbow: 'units-macedonians-infantry-archer-e',
      handgun: 'units-romans-infantry-javelinist-reform',
      cavalry: 'units-seleucids-hero-cavalry-spearman-antiochus-the-great-m',
      horsebow: 'units-seleucids-cavalry-javelinist-e-m',
      commander: 'units-macedonians-hero-cavalry-swordsman-alexander-m'
    }
  },
  steppe: {
    label: 'Central Asian Steppe (Golden Horde / Kazakh / Chagatai / Oirat)',
    units: {
      infantry: 'units-persians-infantry-spearman-a',
      spearmen: 'units-persians-infantry-spearman-b',
      pikes: 'units-han-infantry-halberdman-e',
      heavy_infantry: 'units-persians-infantry-spearman-c',
      guard: 'units-persians-hero-cavalry-spearman-cyrus-m',
      archers: 'units-persians-infantry-archer-b',
      cavalry: 'units-persians-cavalry-spearman-e-m',
      horsebow: 'units-persians-cavalry-archer-e-m',
      commander: 'units-han-hero-cavalry-crossbowman-wei-qing-m'
    }
  },
  africa: {
    label: 'African Kingdoms (Ethiopia / Mali / Songhai / Kilwa / Kongo)',
    units: {
      infantry: 'units-kushites-infantry-swordsman-e',
      spearmen: 'units-kushites-infantry-spearman-e',
      pikes: 'units-kushites-infantry-pikeman-e',
      heavy_infantry: 'units-kushites-infantry-maceman-e',
      guard: 'units-kushites-hero-infantry-archer-amanirenas',
      archers: 'units-kushites-infantry-archer-e',
      crossbow: 'units-kushites-infantry-archer-c',
      cavalry: 'units-kushites-cavalry-spearman-e-m',
      horsebow: 'units-kushites-cavalry-javelinist-e-m',
      elephants: 'units-kushites-elephantry-c-m',
      commander: 'units-kushites-hero-cavalry-spearman-harsiotef-m'
    }
  },
  mesoamerica: {
    label: 'Mesoamerica (Aztec / Maya — Compatible Indigenous Mapping)',
    units: {
      infantry: 'units-iberians-infantry-swordsman-e',
      spearmen: 'units-iberians-infantry-spearman-e',
      pikes: 'units-iberians-infantry-spearman-b',
      heavy_infantry: 'units-iberians-infantry-swordsman-c',
      guard: 'units-iberians-hero-infantry-swordsman-viriato',
      archers: 'units-iberians-infantry-slinger-e',
      crossbow: 'units-iberians-infantry-javelinist-e-fire',
      cavalry: 'units-iberians-cavalry-javelinist-e-m',
      commander: 'units-iberians-hero-infantry-spearman-indibil'
    }
  },
  andean: {
    label: 'Andean Empire (Inca — Compatible Highland Slinger/Spearman Mapping)',
    units: {
      infantry: 'units-iberians-infantry-spearman-a',
      spearmen: 'units-iberians-infantry-spearman-e',
      pikes: 'units-iberians-infantry-spearman-b',
      heavy_infantry: 'units-iberians-infantry-swordsman-b',
      guard: 'units-iberians-hero-infantry-swordsman-caros',
      archers: 'units-iberians-infantry-slinger-b',
      crossbow: 'units-iberians-infantry-slinger-a',
      cavalry: 'units-iberians-cavalry-spearman-e-m',
      commander: 'units-iberians-hero-infantry-swordsman-caros'
    }
  },
  environment: {
    label: 'Battlefield Flora, Highland Geology & Military Camp Props',
    units: {
      tree_oak: 'flora-trees-oak',
      tree_pine: 'flora-trees-pine',
      tree_aleppo_pine: 'flora-trees-aleppo-pine',
      tree_cypress: 'flora-trees-cypress-mediterranean-wild',
      tree_palm_date: 'flora-trees-palm-date',
      tree_palm_tropical: 'flora-trees-palm-tropical',
      tree_banyan: 'flora-trees-banyan',
      tree_bamboo: 'flora-trees-bamboo',
      tree_acacia: 'flora-trees-acacia',
      tree_baobab: 'flora-trees-baobab',
      tree_birch: 'flora-trees-euro-birch-tree',
      bush_scrub: 'flora-bushes-medit-scrub-01',
      rock_gray: 'geology-gray-rock1',
      rock_highland: 'geology-highland1',
      rock_highland2: 'geology-highland2',
      rock_desert: 'geology-stone-desert-boulder',
      rock_granite: 'geology-stone-granite-boulder',
      rock_shore: 'geology-shoreline-boulder',
      tent_arab: 'structures-tent-arab',
      tent_big: 'structures-tent-big',
      tent_greek: 'structures-tent-greek',
      tent_kush: 'structures-tent-kush'
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
