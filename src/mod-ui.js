/**
 * Sovereign: 1450 — Mod Studio UI
 * Interactive JSON Mod Pack Import, Validation, Template Export, Toggle & Campaign Injection.
 */
import { exportModTemplate, listAppliedMods } from './mod-loader.js';

export function renderModStudio(g, world, esc) {
 const applied = listAppliedMods(g);
 const customEvents = g?.mods?.customEvents || [];
 const customDecisions = g?.mods?.customDecisions || [];
 const customKingdoms = Object.values(g?.mods?.customKingdoms || {});
 const customTraits = Object.values(g?.mods?.customTraits || {});
 const customReligions = Object.values(g?.mods?.customReligions || {});

 let html = '<div class="label">SOVEREIGN: 1450 · MOD STUDIO</div>'
  + '<div class="rule"><h3>Custom Scenario &amp; Content Editor</h3>'
  + '<p class="paragraph">Author custom kingdoms, characters, start years (400–2000), religions, traits, declarative JSON events, and royal mandates. Installed packs persist in IndexedDB across browser reloads.</p>'
  + '<div class="statlist">'
  + `<div><small>ACTIVE PACKS</small><b>${applied.length}</b></div>`
  + `<div><small>KINGDOMS</small><b>${customKingdoms.length}</b></div>`
  + `<div><small>EVENTS</small><b>${customEvents.length}</b></div>`
  + `<div><small>DECISIONS</small><b>${customDecisions.length}</b></div>`
  + `<div><small>TRAITS &amp; FAITHS</small><b>${customTraits.length + customReligions.length}</b></div>`
  + '</div>'
  + '<button class="rowbtn" data-action="mod" data-type="export-template">Download Sample Mod Pack JSON</button>'
  + '<button class="rowbtn" data-action="mod" data-type="upload-json">Import .json Mod File</button>'
  + '<input type="file" id="mod-file-input" accept=".json,application/json" hidden>'
  + '</div>';

 html += '<div class="sectiontitle">PASTE OR EDIT JSON MOD PACK</div>'
  + '<div class="rule">'
  + '<textarea id="mod-json-editor" class="select" rows="8" style="width:100%;font-family:monospace;font-size:11px;min-height:130px" placeholder=\'Paste valid JSON mod pack here...\'>'
  + esc(JSON.stringify(exportModTemplate(), null, 2))
  + '</textarea>'
  + '<button class="rowbtn" data-action="mod" data-type="apply-textarea">Validate &amp; Apply JSON Pack to Campaign</button>'
  + '</div>';

 html += '<div class="sectiontitle">INSTALLED MOD PACKS</div>';
 if (!applied.length) {
  html += '<p class="paragraph">No custom mod packs currently applied to this campaign.</p>';
 } else {
  for (const m of applied) {
   html += '<div class="rule"><b>' + esc(m.name) + ' <small>(' + esc(m.id) + ' v' + esc(m.version || '1.0') + ')</small></b>'
    + (m.description ? '<p class="smallnote">' + esc(m.description) + '</p>' : '')
    + '<button class="rowbtn" data-action="mod" data-type="remove" data-id="' + esc(m.id) + '">Remove from Campaign</button>'
    + '</div>';
  }
 }
 return html;
}
