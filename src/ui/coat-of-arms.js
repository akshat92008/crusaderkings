// Sovereign 1450 — Interactive Heraldic Coat of Arms Studio
// Pure offline SVG + HTML5 Canvas rendering for Dynasty, Crown HUD, and Chronicle PNG exports.

export const COA_TINCTURES = Object.freeze([
  { id: 'gules', name: 'Gules (Crimson)', hex: '#9b2226' },
  { id: 'azure', name: 'Azure (Royal Blue)', hex: '#1d4e89' },
  { id: 'or', name: 'Or (Gold)', hex: '#d4a33b' },
  { id: 'argent', name: 'Argent (Silver)', hex: '#efe7d2' },
  { id: 'vert', name: 'Vert (Emerald)', hex: '#2d6a4f' },
  { id: 'purpure', name: 'Purpure (Imperial)', hex: '#5e2c6d' },
  { id: 'sable', name: 'Sable (Obsidian)', hex: '#1c1917' },
  { id: 'tenne', name: 'Tenné (Bronze)', hex: '#b45309' }
]);

export const COA_PATTERNS = Object.freeze([
  { id: 'solid', name: 'Solid Field' },
  { id: 'per-pale', name: 'Per Pale (Vertical Split)' },
  { id: 'per-fess', name: 'Per Fess (Horizontal Split)' },
  { id: 'quarterly', name: 'Quarterly (4 Quarters)' },
  { id: 'chevron', name: 'Chevron' },
  { id: 'saltire', name: 'Saltire (Diagonal Cross)' },
  { id: 'bend', name: 'Bend (Diagonal Sash)' },
  { id: 'chief', name: 'Chief (Crown Band)' }
]);

export const COA_CHARGES = Object.freeze([
  { id: 'crown', name: 'Sovereign Crown' },
  { id: 'lion', name: 'Heraldic Lion' },
  { id: 'eagle', name: 'Imperial Eagle' },
  { id: 'fleur', name: 'Fleur-de-Lis' },
  { id: 'cross', name: 'Templar Cross' },
  { id: 'crescent', name: 'Crescent' },
  { id: 'sun', name: 'Sun in Splendor' },
  { id: 'swords', name: 'Crossed Swords' },
  { id: 'tower', name: 'Citadel Tower' },
  { id: 'lotus', name: 'Royal Lotus' },
  { id: 'dragon', name: 'Winged Dragon' },
  { id: 'star', name: 'Polar Star' }
]);

function hashString(str) {
  let h = 2166136261;
  for (const ch of String(str || 'reign')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function tinctureHex(id) {
  return COA_TINCTURES.find(t => t.id === id)?.hex || id || '#9b2226';
}

export function defaultCoAForRealm(game, realmId) {
  const id = realmId || game?.player || 'england';
  const h = hashString(id);
  const presets = {
    england: { pattern: 'quarterly', primary: 'gules', secondary: 'azure', charge: 'lion', chargeTincture: 'or', motto: 'Dieu et Mon Droit' },
    france: { pattern: 'solid', primary: 'azure', secondary: 'or', charge: 'fleur', chargeTincture: 'or', motto: 'Montjoie Saint Denis' },
    ottomans: { pattern: 'solid', primary: 'gules', secondary: 'vert', charge: 'crescent', chargeTincture: 'or', motto: 'Devlet-i Ebed-Müddet' },
    vijayanagara: { pattern: 'per-fess', primary: 'tenne', secondary: 'gules', charge: 'sun', chargeTincture: 'or', motto: 'Dharma & Victory' },
    ming: { pattern: 'solid', primary: 'gules', secondary: 'or', charge: 'dragon', chargeTincture: 'or', motto: 'Mandate of Heaven' },
    castile: { pattern: 'quarterly', primary: 'gules', secondary: 'or', charge: 'tower', chargeTincture: 'argent', motto: 'Tanto Monta' },
    byzantium: { pattern: 'solid', primary: 'purpure', secondary: 'or', charge: 'eagle', chargeTincture: 'or', motto: 'King of Kings' }
  };
  if (presets[id]) return { ...presets[id], realm: id };
  const p = COA_TINCTURES[h % COA_TINCTURES.length].id;
  const s = COA_TINCTURES[(h + 3) % COA_TINCTURES.length].id;
  const c = p === 'or' || p === 'argent' ? 'sable' : 'or';
  return {
    realm: id,
    pattern: COA_PATTERNS[h % COA_PATTERNS.length].id,
    primary: p,
    secondary: s === p ? COA_TINCTURES[(h + 1) % COA_TINCTURES.length].id : s,
    charge: COA_CHARGES[(h >>> 3) % COA_CHARGES.length].id,
    chargeTincture: c,
    motto: 'Per Aspera Ad Coronam'
  };
}

export function normalizeCoA(coa, game, realmId) {
  const base = defaultCoAForRealm(game, realmId);
  const raw = coa && typeof coa === 'object' ? coa : {};
  return {
    realm: realmId || raw.realm || base.realm,
    pattern: COA_PATTERNS.some(p => p.id === raw.pattern) ? raw.pattern : base.pattern,
    primary: COA_TINCTURES.some(t => t.id === raw.primary) ? raw.primary : base.primary,
    secondary: COA_TINCTURES.some(t => t.id === raw.secondary) ? raw.secondary : base.secondary,
    charge: COA_CHARGES.some(c => c.id === raw.charge) ? raw.charge : base.charge,
    chargeTincture: COA_TINCTURES.some(t => t.id === raw.chargeTincture) ? raw.chargeTincture : base.chargeTincture,
    motto: String(raw.motto || base.motto).slice(0, 48)
  };
}

export function getRealmCoA(game, realmId = game?.player) {
  const saved = game?.heritage?.customCoA?.[realmId];
  return normalizeCoA(saved, game, realmId);
}

export function saveRealmCoA(game, realmId, coa) {
  if (!game) return { ok: false, msg: 'No active campaign.' };
  const id = realmId || game.player;
  game.heritage ??= {};
  game.heritage.customCoA ??= {};
  const normalized = normalizeCoA(coa, game, id);
  game.heritage.customCoA[id] = normalized;
  return { ok: true, coa: normalized, msg: `Royal blazon updated (${normalized.pattern}, ${normalized.charge}).` };
}

function patternSvg(pattern, primaryHex, secondaryHex) {
  const base = `<rect x="0" y="0" width="100" height="112" fill="${primaryHex}"/>`;
  if (pattern === 'per-pale') return base + `<rect x="50" y="0" width="50" height="112" fill="${secondaryHex}"/>`;
  if (pattern === 'per-fess') return base + `<rect x="0" y="52" width="100" height="60" fill="${secondaryHex}"/>`;
  if (pattern === 'quarterly') return base + `<rect x="50" y="0" width="50" height="52" fill="${secondaryHex}"/><rect x="0" y="52" width="50" height="60" fill="${secondaryHex}"/>`;
  if (pattern === 'chevron') return base + `<polygon points="0,78 50,34 100,78 100,98 50,54 0,98" fill="${secondaryHex}"/>`;
  if (pattern === 'saltire') return base + `<path d="M-8,4 L108,108 M108,4 L-8,108" stroke="${secondaryHex}" stroke-width="18"/>`;
  if (pattern === 'bend') return base + `<path d="M-10,0 L110,112" stroke="${secondaryHex}" stroke-width="22"/>`;
  if (pattern === 'chief') return base + `<rect x="0" y="0" width="100" height="30" fill="${secondaryHex}"/>`;
  return base;
}

function chargeSvg(charge, fill) {
  switch (charge) {
    case 'crown':
      return `<path d="M26,68 L22,40 L38,52 L50,32 L62,52 L78,40 L74,68 Z M26,72 H74 V79 H26 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
    case 'eagle':
      return `<path d="M50,24 L56,34 L82,38 L66,54 L76,78 L58,68 L50,84 L42,68 L24,78 L34,54 L18,38 L44,34 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
    case 'lion':
      return `<path d="M35,76 L32,58 C26,50 30,32 45,28 C58,24 72,34 68,48 L76,56 L66,64 L68,78 L58,78 L55,66 L44,66 L42,78 Z M26,42 C20,38 22,28 30,30" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
    case 'fleur':
      return `<path d="M50,22 C58,36 58,48 52,58 C62,48 76,46 76,58 C76,66 64,66 56,63 L56,74 H66 V80 H34 V74 H44 V63 C36,66 24,66 24,58 C24,46 38,48 48,58 C42,48 42,36 50,22 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.4"/>`;
    case 'cross':
      return `<path d="M40,22 H60 L56,44 H78 V64 L56,60 V86 H44 V60 L22,64 V44 H44 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
    case 'crescent':
      return `<path d="M62,28 A26,26 0 1,0 62,78 A20,20 0 1,1 62,28 Z M66,46 L70,54 L78,55 L72,60 L74,68 L66,64 L59,68 L61,60 L55,55 L63,54 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.4"/>`;
    case 'sun':
      return `<circle cx="50" cy="54" r="14" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/><path d="M50,22 L54,36 H46 Z M50,86 L54,72 H46 Z M18,54 L32,58 V50 Z M82,54 L68,58 V50 Z M27,31 L39,40 L34,45 Z M73,77 L61,68 L66,63 Z M73,31 L61,40 L66,45 Z M27,77 L39,68 L34,63 Z" fill="${fill}"/>`;
    case 'swords':
      return `<path d="M26,76 L72,26 L77,31 L31,81 Z M74,76 L28,26 L23,31 L69,81 Z M24,64 L36,76 M76,64 L64,76" fill="${fill}" stroke="#1c1917" stroke-width="2"/>`;
    case 'tower':
      return `<path d="M32,80 L36,38 H32 V26 H41 V32 H46 V26 H54 V32 H59 V26 H68 V38 H64 L68,80 Z M45,80 V62 A5,5 0 0,1 55,62 V80 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
    case 'lotus':
      return `<path d="M50,24 C60,40 60,56 50,74 C40,56 40,40 50,24 Z M32,42 C42,46 46,60 44,74 C32,68 26,56 32,42 Z M68,42 C74,56 68,68 56,74 C54,60 58,46 68,42 Z M26,74 H74 V80 H26 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.4"/>`;
    case 'dragon':
      return `<path d="M26,64 C24,42 40,26 60,30 L74,24 L68,38 C78,44 76,60 64,66 L72,78 L54,74 C44,82 28,78 26,64 Z M42,44 L56,48 L46,58 Z" fill="${fill}" stroke="#1c1917" stroke-width="1.4"/>`;
    case 'star':
    default:
      return `<polygon points="50,22 58,42 80,44 63,58 68,80 50,68 32,80 37,58 20,44 42,42" fill="${fill}" stroke="#1c1917" stroke-width="1.5"/>`;
  }
}

export function renderCoASvg(coa, { size = 72, className = 'coa-shield-svg', showMotto = false, esc = s => String(s ?? '') } = {}) {
  const c = normalizeCoA(coa);
  const clipId = 'coa-clip-' + hashString(JSON.stringify(c)).toString(36);
  const pHex = tinctureHex(c.primary);
  const sHex = tinctureHex(c.secondary);
  const cHex = tinctureHex(c.chargeTincture);
  const shieldPath = 'M8,6 H92 V56 C92,84 50,104 50,104 C50,104 8,84 8,56 Z';
  const svg = `<svg class="${esc(className)}" width="${size}" height="${Math.round(size * 1.12)}" viewBox="0 0 100 112" role="img" aria-label="Coat of Arms: ${esc(c.pattern)} with ${esc(c.charge)}">` +
    `<defs><clipPath id="${clipId}"><path d="${shieldPath}"/></clipPath></defs>` +
    `<g clip-path="url(#${clipId})">${patternSvg(c.pattern, pHex, sHex)}${chargeSvg(c.charge, cHex)}</g>` +
    `<path d="${shieldPath}" fill="none" stroke="#c89b3c" stroke-width="4.5"/>` +
    `<path d="${shieldPath}" fill="none" stroke="#2c1d11" stroke-width="1.2"/>` +
    `</svg>`;
  if (!showMotto) return svg;
  return `<div class="coa-emblem-wrap">${svg}<small class="coa-motto">${esc(c.motto)}</small></div>`;
}

export function drawCoAOnCanvas(ctx, coa, x, y, size = 76) {
  const c = normalizeCoA(coa);
  const pHex = tinctureHex(c.primary);
  const sHex = tinctureHex(c.secondary);
  const cHex = tinctureHex(c.chargeTincture);
  const h = size * 1.12;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(size * 0.08, size * 0.05);
  ctx.lineTo(size * 0.92, size * 0.05);
  ctx.lineTo(size * 0.92, h * 0.50);
  ctx.quadraticCurveTo(size * 0.92, h * 0.78, size * 0.50, h * 0.94);
  ctx.quadraticCurveTo(size * 0.08, h * 0.78, size * 0.08, h * 0.50);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = pHex;
  ctx.fillRect(0, 0, size, h);
  ctx.fillStyle = sHex;
  if (c.pattern === 'per-pale') ctx.fillRect(size * 0.5, 0, size * 0.5, h);
  else if (c.pattern === 'per-fess') ctx.fillRect(0, h * 0.48, size, h * 0.52);
  else if (c.pattern === 'quarterly') {
    ctx.fillRect(size * 0.5, 0, size * 0.5, h * 0.48);
    ctx.fillRect(0, h * 0.48, size * 0.5, h * 0.52);
  } else if (c.pattern === 'chief') ctx.fillRect(0, 0, size, h * 0.28);
  else if (c.pattern === 'bend' || c.pattern === 'saltire') {
    ctx.strokeStyle = sHex;
    ctx.lineWidth = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, h);
    if (c.pattern === 'saltire') {
      ctx.moveTo(size, 0);
      ctx.lineTo(0, h);
    }
    ctx.stroke();
  }
  // Draw emblem glyph in shield center
  ctx.fillStyle = cHex;
  ctx.beginPath();
  ctx.arc(size * 0.5, h * 0.47, size * 0.19, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c1917';
  ctx.font = `bold ${Math.round(size * 0.22)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const sym = { crown: '♛', eagle: '🦅', lion: '🦁', fleur: '⚜', cross: '✚', crescent: '☪', sun: '☀', swords: '⚔', tower: '♜', lotus: '❀', dragon: '🐉', star: '★' }[c.charge] || '★';
  ctx.fillText(sym, size * 0.5, h * 0.48);
  ctx.restore();
  ctx.strokeStyle = '#d4a33b';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

export function renderCoAStudio(game, esc, realmId = game?.player) {
  const c = getRealmCoA(game, realmId);
  const opt = (items, selected) => items.map(it =>
    `<option value="${esc(it.id)}"${it.id === selected ? ' selected' : ''}>${esc(it.name)}</option>`
  ).join('');
  return `<section class="rule coa-studio" id="coa-studio" data-coa-realm="${esc(realmId)}">
    <div class="coa-studio-grid">
      <div id="coa-studio-preview" class="coa-studio-preview">${renderCoASvg(c, { size: 92, showMotto: true, esc })}</div>
      <div class="coa-studio-controls">
        <div class="smallnote"><b>Royal Coat of Arms Studio</b> — Forge a custom heraldic blazon for your dynasty and Chronicle export card.</div>
        <div class="coa-field-row">
          <label>Division <select class="select" data-coa-field="pattern">${opt(COA_PATTERNS, c.pattern)}</select></label>
          <label>Charge <select class="select" data-coa-field="charge">${opt(COA_CHARGES, c.charge)}</select></label>
        </div>
        <div class="coa-field-row">
          <label>Primary <select class="select" data-coa-field="primary">${opt(COA_TINCTURES, c.primary)}</select></label>
          <label>Secondary <select class="select" data-coa-field="secondary">${opt(COA_TINCTURES, c.secondary)}</select></label>
          <label>Charge Color <select class="select" data-coa-field="chargeTincture">${opt(COA_TINCTURES, c.chargeTincture)}</select></label>
        </div>
        <div class="coa-field-row">
          <label style="flex:1">House Motto <input class="input" type="text" maxlength="48" data-coa-field="motto" value="${esc(c.motto)}" placeholder="Royal house motto"></label>
        </div>
        <div class="coa-actions-row">
          <button type="button" class="rowbtn goldbtn" data-action="coa-save">Save Royal Arms</button>
          <button type="button" class="rowbtn" data-action="coa-random">Randomize Blazon</button>
        </div>
      </div>
    </div>
  </section>`;
}
