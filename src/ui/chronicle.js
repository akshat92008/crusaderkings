import {eventImage} from '../game-art.js';
import {SUPPORTED_LOCALES, LOCALE_NAMES, applyTranslations} from '../i18n.js';
import {browserCampaignAudio} from '../field-audio.js';

const STORE = 'reign1450.interface.v1';
const KEYBIND_STORE = 'reign1450.keybindings.v1';
export const DEFAULT_KEYBINDINGS = Object.freeze({
  search: '/',
  lockTooltip: 't',
  nextMonth: 'n',
  togglePause: ' ',
  openHometown: 'c',
  openChronicle: 'j',
  battlePause: 'p'
});
const KEYBIND_LABELS = Object.freeze({
  search: 'Campaign Search',
  lockTooltip: 'Pin & Expand Tooltip',
  nextMonth: 'Advance Month',
  togglePause: 'Pause / Play Time',
  openHometown: 'Open Royal Capital',
  openChronicle: 'Open Chronicle',
  battlePause: 'Pause / Resume 3D Battle'
});
export function getKeybindings() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(KEYBIND_STORE)); } catch {}
  return { ...DEFAULT_KEYBINDINGS, ...(saved && typeof saved === 'object' ? saved : {}) };
}
export function setKeybinding(action, key) {
  if (!Object.hasOwn(DEFAULT_KEYBINDINGS, action) || !key) return getKeybindings();
  const next = getKeybindings();
  next[action] = key === 'Spacebar' ? ' ' : key.length === 1 ? key.toLowerCase() : key;
  try { localStorage.setItem(KEYBIND_STORE, JSON.stringify(next)); } catch {}
  return next;
}
export function resetKeybindings() {
  try { localStorage.removeItem(KEYBIND_STORE); } catch {}
  return { ...DEFAULT_KEYBINDINGS };
}
function formatKeyLabel(k) {
  return k === ' ' ? 'SPACE' : String(k || '').toUpperCase();
}
const categories = {
  critical: 'Succession, invasions and crises',
  important: 'Court and political decisions',
  works: 'Construction and research',
  chronicle: 'Routine affairs'
};
const defaults = {critical: 'pause', important: 'notify', works: 'notify', chronicle: 'record'};
const modes = {pause: 'Pause and show', notify: 'Notify', record: 'Chronicle only'};
const choices = {
  density: {standard: 'Standard', expert: 'Expert'},
  scale: {90: '90%', 100: '100%', 115: '115%', 125: '125%'},
  motion: {system: 'System preference', reduce: 'Reduced'},
  delay: {0: 'Immediate', 300: 'Short', 700: 'Long'},
  graphics: {low: 'Low (Battery / 8 GB)', medium: 'Medium (Balanced)', high: 'High (Full 3D)'}
};
function load() {
  let data;
  try { data = JSON.parse(localStorage.getItem(STORE)); } catch {}
  let gfx = 'medium', locale = 'en';
  try { gfx = localStorage.getItem('crown-of-nations.gfx-quality') || 'medium'; } catch {}
  try { locale = localStorage.getItem('crown-of-nations.locale') || 'en'; } catch {}
  const p = {density:'standard', scale:'100', motion:'system', delay:'300', graphics:gfx, locale, delivery:{}, sound:{}};
  for (const k in choices) if (Object.hasOwn(choices[k], data?.[k])) p[k] = data[k];
  if (typeof data?.locale === 'string' && SUPPORTED_LOCALES.includes(data.locale)) p.locale = data.locale;
  for (const k in defaults) {
    p.delivery[k] = Object.hasOwn(modes, data?.delivery?.[k]) ? data.delivery[k] : defaults[k];
    p.sound[k] = typeof data?.sound?.[k] === 'boolean' ? data.sound[k] : k === 'critical';
  }
  return p;
}
export const preferences = load();
function apply() {
  const root = document.documentElement;
  root.dataset.density = preferences.density;
  root.dataset.motion = preferences.motion;
  root.style.setProperty('--campaign-ui-scale', String(Number(preferences.scale) / 100));
  try { localStorage.setItem('crown-of-nations.gfx-quality', preferences.graphics || 'medium'); } catch {}
  try { localStorage.setItem('crown-of-nations.locale', preferences.locale || 'en'); } catch {}
}
const labels = {density:'Information density', scale:'Interface size', motion:'Motion', delay:'Tooltip delay', graphics:'3D battle graphics'};
function options(values, value) {
  return Object.entries(values).map(([k,v]) => '<option value="'+k+'"'+(String(value)===k?' selected':'')+'>'+v+'</option>').join('');
}
export function installSettings(hooks = {}) {
  apply();
  let dialog;
  let capturingAction = null;
  const renderKeybindRows = () => {
    const binds = getKeybindings();
    return Object.entries(KEYBIND_LABELS).map(([act, lbl]) =>
      '<div class="keybind-row"><span>'+lbl+'</span><button type="button" class="rowbtn keybind-btn" data-rebind="'+act+'">'+formatKeyLabel(binds[act])+'</button></div>'
    ).join('');
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('#open-settings,[data-open-campaign-settings]')) return;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'campaign-settings'; dialog.setAttribute('aria-labelledby','campaign-settings-title');
      const vols = browserCampaignAudio.getBusVolumes?.() || {master:1,music:1,sfx:1,ambience:1};
      const localeOpts = SUPPORTED_LOCALES.map(loc => '<option value="'+loc+'"'+(preferences.locale===loc?' selected':'')+'>'+(LOCALE_NAMES[loc]||loc.toUpperCase())+'</option>').join('');
      const cbOn = document.body.classList.contains('colorblind-mode');
      dialog.innerHTML = '<header><h2 id="campaign-settings-title">Campaign settings</h2><form method="dialog"><button autofocus aria-label="Close settings">Close</button></form></header>'+
        '<div class="settings-fields">'+Object.entries(choices).map(([k,v]) => '<label>'+labels[k]+'<select data-setting="'+k+'">'+options(v,preferences[k])+'</select></label>').join('')+'<label>Language<select data-locale>'+localeOpts+'</select></label></div>'+
        '<fieldset><legend>Accessibility &amp; Guidance</legend><div class="settings-delivery"><label><input type="checkbox" data-accessibility-colorblind'+(cbOn?' checked':'')+'> Color-blind safe palette (Okabe-Ito high contrast)</label><button type="button" data-reset-onboarding>Show First-Hour Guide</button></div></fieldset>'+
        '<fieldset><legend>Audio mixer</legend><div class="settings-audio-grid">'+[['master','Master'],['music','Music Score'],['sfx','Battle &amp; UI SFX'],['ambience','Camp Ambience']].map(([b,lbl])=>'<label><span>'+lbl+'</span><input type="range" min="0" max="100" value="'+Math.round((vols[b]??1)*100)+'" data-audio-bus="'+b+'"></label>').join('')+'</div></fieldset>'+
        '<fieldset><legend>Notifications</legend>'+Object.entries(categories).map(([k,label]) => '<div class="settings-delivery"><label>'+label+'<select data-delivery="'+k+'">'+options(modes,preferences.delivery[k])+'</select></label><label><input type="checkbox" data-sound="'+k+'"'+(preferences.sound[k]?' checked':'')+' aria-label="Sound for '+label+'"> Sound</label></div>').join('')+'</fieldset>'+
        '<details><summary>Custom Keybindings</summary><div class="keybind-grid" data-keybind-grid>'+renderKeybindRows()+'</div><div style="margin-top:8px"><button type="button" class="rowbtn" data-reset-keybinds>Reset Default Keys</button> <small>Click any key button and press a new key.</small></div></details>';
      dialog.addEventListener('click', e => {
        if (e.target.closest('[data-reset-onboarding]')) {
          hooks.onResetOnboarding?.();
          dialog.close();
          return;
        }
        const rebindBtn = e.target.closest('[data-rebind]');
        if (rebindBtn) {
          capturingAction = rebindBtn.dataset.rebind;
          for (const b of dialog.querySelectorAll('[data-rebind]')) b.textContent = b === rebindBtn ? 'PRESS KEY...' : formatKeyLabel(getKeybindings()[b.dataset.rebind]);
          return;
        }
        if (e.target.closest('[data-reset-keybinds]')) {
          capturingAction = null;
          resetKeybindings();
          const grid = dialog.querySelector('[data-keybind-grid]');
          if (grid) grid.innerHTML = renderKeybindRows();
          hooks.onKeybindingsChange?.(getKeybindings());
        }
      });
      dialog.addEventListener('change', e => {
        const input = e.target;
        if (input.hasAttribute('data-accessibility-colorblind')) {
          hooks.onColorblindChange?.(input.checked);
          return;
        }
        if (input.dataset.setting) {
          preferences[input.dataset.setting] = input.value;
          if (input.dataset.setting === 'graphics') hooks.onGraphicsChange?.(input.value);
        }
        if (input.hasAttribute('data-locale')) {
          preferences.locale = input.value;
          applyTranslations(document, input.value);
          hooks.onLocaleChange?.(input.value);
        }
        if (input.dataset.delivery) preferences.delivery[input.dataset.delivery] = input.value;
        if (input.dataset.sound) preferences.sound[input.dataset.sound] = input.checked;
        apply();
        try { localStorage.setItem(STORE, JSON.stringify(preferences)); } catch {}
      });
      dialog.addEventListener('input', e => {
        const bus = e.target.dataset?.audioBus;
        if (bus) hooks.onAudioBusChange?.(bus, Number(e.target.value) / 100);
      });
      dialog.addEventListener('keydown', e => {
        if (capturingAction) {
          e.preventDefault();
          e.stopPropagation();
          if (e.key !== 'Escape') setKeybinding(capturingAction, e.key);
          capturingAction = null;
          const grid = dialog.querySelector('[data-keybind-grid]');
          if (grid) grid.innerHTML = renderKeybindRows();
          hooks.onKeybindingsChange?.(getKeybindings());
          return;
        }
        e.stopPropagation();
      });
      document.body.append(dialog);
    }
    const cbBox = dialog.querySelector('[data-accessibility-colorblind]');
    if (cbBox) cbBox.checked = document.body.classList.contains('colorblind-mode');
    const gfxSel = dialog.querySelector('[data-setting="graphics"]');
    if (gfxSel) {
      try { preferences.graphics = localStorage.getItem('crown-of-nations.gfx-quality') || preferences.graphics; } catch {}
      gfxSel.value = preferences.graphics;
    }
    if (!dialog.open) dialog.showModal();
  });
}

export function dispatchCategory(entry) {
  if (entry.tier && Object.hasOwn(categories,entry.tier)) return entry.tier;
  const text = entry.text || [entry.badge,entry.title].join(' ');
  if (/\b(died|abdicated|invasion|invaded|revolt|rebelled|rebellion|civil war|succession crisis|succeeded to|crowned|famine|epidemic)\b/i.test(text)) return 'critical';
  if (/\b(researched|research complete[d]?|discovery|level \d+ completed|construction (finished|completed)|upgrade[d]? (is )?complete[d]?)\b/i.test(text)) return 'works';
  if (entry.key || /\b(alliance|treaty|regency|decree|independence|victory|defeat)\b/i.test(text)) return 'important';
  return 'chronicle';
}
const lastLog = new WeakMap();
export function observeRecords(game) {
  const log = (game.log || []).filter(l => typeof l?.text === 'string');
  if (!lastLog.has(game)) {
    if (!Array.isArray(game.royalJournal)) game.royalJournal = log.slice(0,360);
    else {
      const known = new Set(game.royalJournal.map(record => record.date+'|'+record.text));
      const unsaved = log.filter(record=>!known.has(record.date+'|'+record.text));
      game.royalJournal = [...unsaved,...game.royalJournal].slice(0,360);
    }
    lastLog.set(game, new Set(log));
    return [];
  }
  const previous = lastLog.get(game);
  const fresh = log.filter(entry => !previous.has(entry));
  if (fresh.length) game.royalJournal = [...fresh, ...game.royalJournal].slice(0,360);
  lastLog.set(game,new Set(log));
  return fresh;
}
export function deliver(prompts, records, {pause, showEvent, notify, sound}) {
  const entries = [...prompts.map(entry => ({entry,prompt:true})),...records.map(entry => ({entry,prompt:false}))];
  const active = entries.map(item => ({...item,category:dispatchCategory(item.entry)}))
    .filter(item => preferences.delivery[item.category] !== 'record')
    .sort((a,b) => Object.keys(categories).indexOf(a.category)-Object.keys(categories).indexOf(b.category));
  if (!active.length) return;
  const paused = active.filter(item => preferences.delivery[item.category] === 'pause');
  if (paused.length) pause();
  if (active.some(item => preferences.sound[item.category])) sound();
  const modal = paused.find(item => item.prompt);
  if (modal) { showEvent(modal.entry); return; }
  const first = (paused[0] || active[0]).entry;
  notify((first.title || first.text)+(active.length>1?' · '+(active.length-1)+' more in Chronicle':''));
}
let section = 'timeline';
let filter = 'all';
export function selectJournal(sectionName) { section = sectionName === 'alerts' ? 'alerts' : 'timeline'; }
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function normalizeDate(value) {
  const s=String(value||''), parts=s.match(/^(\d+) · month (\d+)$/i);
  if (parts && monthNames[Number(parts[2])-1]) return monthNames[Number(parts[2])-1]+' '+parts[1];
  const words=s.match(/^(\w+) (\d+)$/);
  if (words) {
    const month=monthNames.find(m => m.slice(0,3).toLowerCase()===words[1].slice(0,3).toLowerCase());
    if (month) return month+' '+words[2];
  }
  return s || 'Undated';
}
export function renderJournal(game, priorities, prompts, esc) {
  const records=game.royalJournal||game.log||[];
  const nav='<div class="journal-tabs" role="group" aria-label="Chronicle view">'+[['timeline','Timeline'],['alerts','Alerts']].map(([k,v])=>'<button type="button" data-journal-view="'+k+'" aria-pressed="'+(k===section)+'">'+v+'</button>').join('')+'</div>';
  let content='';
  if (section==='alerts') {
    const groups = new Map();
    for (const p of priorities) {
      if (!groups.has(p.tab)) groups.set(p.tab,[]);
      groups.get(p.tab).push(p);
    }
    if (prompts.length) content+='<h3>Awaiting your decision</h3>'+prompts.map(p=>'<button class="journal-dispatch" data-journal-event="'+esc(p.key)+'"><small>'+esc(p.badge)+'</small><b>'+esc(p.title)+'</b></button>').join('');
    for (const [tab,group] of groups) content+='<section class="journal-alert"><button type="button" data-priority-tab="'+esc(tab)+'">'+esc(group[0].label)+(group.length>1?' +'+(group.length-1):'')+' ›</button>'+group.map(p=>'<p>'+esc(p.detail)+'</p>').join('')+'</section>';
    if (!content) content='<p>No decisions or alerts are pending.</p>';
  } else {
    content='<label class="journal-filter">Show <select id="journal-filter">'+options({all:'All records',...categories},filter)+'</select></label>';
    const months=new Map();
    for (const entry of records) {
      if (typeof entry?.text !== 'string' || (filter!=='all' && dispatchCategory(entry)!==filter)) continue;
      const date=normalizeDate(entry.date);
      if (!months.has(date)) months.set(date,new Map());
      const month=months.get(date); month.set(entry.text,(month.get(entry.text)||0)+1);
    }
    let illustrated=0;
    for (const [date,entries] of months) {
      content+='<section class="journal-month"><h3>'+esc(date)+'</h3><ul>';
      for (const [text,count] of entries) {
        const major=dispatchCategory({text})==='critical' && illustrated<3;
        if (major) illustrated++;
        content+='<li>'+(major?eventImage(text,game.player):'')+esc(text)+(count>1?' <small>×'+count+'</small>':'')+'</li>';
      }
      content+='</ul></section>';
    }
    if (!months.size) content+='<p>No matching records yet.</p>';
  }
  return '<article class="royal-journal"><h2>Royal chronicle</h2>'+nav+content+'</article>';
}
export function bindJournal(container, refresh, open) {
  container.addEventListener('click',e=>{
    const tab=e.target.closest('[data-journal-view]'),event=e.target.closest('[data-journal-event]');
    if(tab){selectJournal(tab.dataset.journalView);refresh();container.querySelector('[data-journal-view="'+section+'"]')?.focus();}
    if(event)open(event.dataset.journalEvent);
  });
  container.addEventListener('change',e=>{
    if(e.target.id==='journal-filter'){filter=e.target.value;refresh();container.querySelector('#journal-filter')?.focus();}
  });
}
