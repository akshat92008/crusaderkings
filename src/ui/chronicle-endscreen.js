/* Greatest Story Illustrated Dynasty Chronicle End Screen, PNG Share Card Exporter, & First-Hour Guided Sovereign Onboarding */
import {dynastyChronicleSummary, playerAchievements} from '../chronicle-systems.js';
import {getRealmCoA, drawCoAOnCanvas, renderCoASvg} from './coat-of-arms.js';

const ONBOARDING_STORE = 'sovereign1450.onboarding.v1';
export const ONBOARDING_STEPS = [
 {id:'crown', label:'Inspect Crown', hint:'Review your realm, laws & succession', action:'tab:realm'},
 {id:'capital', label:'Visit Living Capital', hint:'Build structures & manage citizens', action:'open-capital'},
 {id:'diplomacy', label:'Open Diplomacy / Trade', hint:'Inspect trade routes or forge pacts', action:'tab:trade'},
 {id:'battle', label:'Command 3D Battle', hint:'Test formations in Battle Showcase', action:'open-battle'},
 {id:'month', label:'Advance a Month', hint:'Step the global 1450 simulation forward', action:'next-month'}
];

function loadOnboardingState(){
 try{
  const parsed=JSON.parse(localStorage.getItem(ONBOARDING_STORE)||'null');
  if(parsed && typeof parsed==='object')return {dismissed:!!parsed.dismissed,done:{...(parsed.done||{})}};
 }catch{}
 return {dismissed:false,done:{}};
}
function saveOnboardingState(st){
 try{localStorage.setItem(ONBOARDING_STORE,JSON.stringify(st));}catch{}
}

export function createOnboardingController(stripEl, callbacks={}){
 let state=loadOnboardingState();
 const render=()=>{
  if(!stripEl)return;
  const completedCount=ONBOARDING_STEPS.filter(s=>state.done[s.id]).length;
  if(state.dismissed||completedCount>=ONBOARDING_STEPS.length){stripEl.hidden=true;return;}
  stripEl.hidden=false;
  stripEl.innerHTML='<div class="onboarding-head"><strong>Sovereign First-Hour Guide ('+completedCount+'/'+ONBOARDING_STEPS.length+')</strong><button type="button" class="smallbtn" data-onboard-dismiss aria-label="Skip guided onboarding">Skip guide ×</button></div>'+
   '<div class="onboarding-steps">'+ONBOARDING_STEPS.map(s=>'<button type="button" class="onboarding-step'+(state.done[s.id]?' done':'')+'" data-onboard-action="'+s.action+'" data-onboard-id="'+s.id+'" title="'+s.hint+'"><span>'+(state.done[s.id]?'✓ ':'○ ')+s.label+'</span></button>').join('')+'</div>';
 };
 stripEl?.addEventListener('click',e=>{
  if(e.target.closest('[data-onboard-dismiss]')){state.dismissed=true;saveOnboardingState(state);render();return;}
  const btn=e.target.closest('[data-onboard-action]');
  if(!btn)return;
  const act=btn.dataset.onboardAction;
  if(act==='tab:realm')callbacks.onOpenTab?.('realm');
  else if(act==='tab:trade')callbacks.onOpenTab?.('trade');
  else if(act==='open-capital')callbacks.onOpenCapital?.();
  else if(act==='open-battle')callbacks.onOpenBattle?.();
  else if(act==='next-month')callbacks.onNextMonth?.();
 });
 return {
  render,
  mark(id){
   if(!id||state.done[id])return;
   state.done[id]=true;
   saveOnboardingState(state);
   render();
  },
  reset(){
   state={dismissed:false,done:{}};
   saveOnboardingState(state);
   render();
  },
  dismiss(){
   state.dismissed=true;
   saveOnboardingState(state);
   render();
  }
 };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines=4){
 const words=String(text||'').split(/\s+/);
 let line='', lines=0;
 for(let i=0;i<words.length;i++){
  const test=line?(line+' '+words[i]):words[i];
  if(ctx.measureText(test).width>maxWidth && line){
   ctx.fillText(line,x,y);
   line=words[i];
   y+=lineHeight;
   lines++;
   if(lines>=maxLines-1){
    const rest=words.slice(i).join(' ');
    ctx.fillText(rest.length>72?rest.slice(0,69)+'…':rest,x,y);
    return y+lineHeight;
   }
  }else line=test;
 }
 if(line){ctx.fillText(line,x,y);y+=lineHeight;}
 return y;
}

export function renderChronicleShareCanvas(canvas, summary, achs, coa = null){
 if(!canvas)return '';
 canvas.width=960;
 canvas.height=540;
 const ctx=canvas.getContext('2d');
 if(!ctx)return '';

 // Illuminated parchment & royal gold frame
 const bg=ctx.createLinearGradient(0,0,960,540);
 bg.addColorStop(0,'#171410');
 bg.addColorStop(0.5,'#231d15');
 bg.addColorStop(1,'#14110d');
 ctx.fillStyle=bg;
 ctx.fillRect(0,0,960,540);

 // Ornate double gold border
 ctx.strokeStyle='#c9a45c';
 ctx.lineWidth=4;
 ctx.strokeRect(18,18,924,504);
 ctx.strokeStyle='rgba(201,164,92,0.45)';
 ctx.lineWidth=1.5;
 ctx.strokeRect(28,28,904,484);

 // Custom House Coat of Arms in top-right crest slot
 if(coa) drawCoAOnCanvas(ctx, coa, 836, 44, 72);

 // Header crest & title
 ctx.fillStyle='#d8b46a';
 ctx.font='700 14px Georgia, serif';
 ctx.fillText('SOVEREIGN 1450 · ILLUSTRATED DYNASTY CHRONICLE', 48, 66);

 ctx.fillStyle='#f6ecd8';
 ctx.font='700 38px Georgia, serif';
 ctx.fillText(summary.realmName || 'The Crown', 48, 112);

 const houseText=summary.houseName || summary.house || 'Royal House';
 const provCount=summary.provinces ?? summary.provs ?? 0;
 const rulerLabel=typeof summary.currentRuler==='string'
  ? summary.currentRuler
  : summary.currentRuler
   ? `${summary.currentRuler.name}${summary.currentRuler.epithet?' '+summary.currentRuler.epithet:''}`
   : 'Current Monarch';

 ctx.fillStyle='#cfb889';
 ctx.font='600 18px Georgia, serif';
 ctx.fillText(`${houseText} · 1450–${summary.year || 1450} · ${summary.yearsRuled} Years Ruled`, 48, 144);

 // Divider
 ctx.strokeStyle='rgba(201,164,92,0.5)';
 ctx.lineWidth=1;
 ctx.beginPath();ctx.moveTo(48,162);ctx.lineTo(912,162);ctx.stroke();

 // Stat tiles
 const tiles=[
  ['PROVINCES', String(provCount)],
  ['SOVEREIGNS', String(Math.max(1, (summary.epitaphs?.length||0)+1))],
  ['CAPITAL TIER', 'Lv. ' + String(summary.capitalLevel || 1)],
  ['ACHIEVEMENTS', `${summary.unlockedCount || 0}/${(achs||[]).length || 7}`]
 ];
 tiles.forEach(([lbl,val],idx)=>{
  const tx=48+idx*218, ty=182;
  ctx.fillStyle='rgba(201,164,92,0.10)';
  ctx.fillRect(tx,ty,202,74);
  ctx.strokeStyle='rgba(201,164,92,0.35)';
  ctx.strokeRect(tx,ty,202,74);
  ctx.fillStyle='#b89d68';
  ctx.font='600 12px sans-serif';
  ctx.fillText(lbl,tx+14,ty+24);
  ctx.fillStyle='#f8eed8';
  ctx.font='700 26px Georgia, serif';
  ctx.fillText(val,tx+14,ty+58);
 });

 // Greatest Battle & Alternate History
 ctx.fillStyle='#d8b46a';
 ctx.font='700 14px Georgia, serif';
 ctx.fillText('ALTERNATE HISTORY & CHRONICLE RECORD', 48, 290);
 ctx.fillStyle='#ede2cc';
 ctx.font='400 17px Georgia, serif';
 let nextY=wrapText(ctx, summary.alternateHistory || '', 48, 318, 860, 24, 3);

 if(summary.greatestBattle){
  ctx.fillStyle='#e2b969';
  ctx.font='700 15px Georgia, serif';
  ctx.fillText(`GREATEST BATTLE: ${summary.greatestBattle.province} (${summary.greatestBattle.year}) vs ${summary.greatestBattle.enemy||'Rivals'} — ${(summary.greatestBattle.engaged||0).toLocaleString()} troops · ${summary.greatestBattle.victory?'Victory':'Defeat'}`, 48, Math.max(nextY+16, 396));
 }else{
  ctx.fillStyle='#c4b493';
  ctx.font='italic 15px Georgia, serif';
  ctx.fillText(`Sovereign on the Throne: ${rulerLabel} · Capital Tier ${summary.capitalLevel || 1}`, 48, Math.max(nextY+16, 396));
 }

 // Reign Timeline strip
 const rulers=(summary.epitaphs||[]).slice(-4);
 ctx.fillStyle='#b99c64';
 ctx.font='600 13px sans-serif';
 ctx.fillText(rulers.length ? 'LINEAGE OF SOVEREIGNS: ' + rulers.map(r=>`${r.name||r.rulerName} ${r.epithet||''} (d. ${r.deathYear})`).join('  •  ') : 'FOUNDING REIGN IN PROGRESS · INSCRIBE YOUR DYNASTY IN HISTORY', 48, 456);

 // Footer seal
 ctx.fillStyle='#8c7852';
 ctx.font='600 12px sans-serif';
 ctx.fillText(summary.shareCaption || 'Sovereign 1450 Dynasty Chronicle', 48, 496);

 try{return canvas.toDataURL('image/png');}catch{return '';}
}

export function openChronicleEndScreen(modalEl, game, esc, onNotify, onReplayBattle){
 if(!modalEl||!game)return;
 const summary=dynastyChronicleSummary(game);
 const achs=playerAchievements(game);
 const coa=getRealmCoA(game,game.player);
 const houseText=summary.houseName || summary.house || 'Royal House';
 const provCount=summary.provinces ?? summary.provs ?? 0;
 const rulerLabel=typeof summary.currentRuler==='string'
  ? summary.currentRuler
  : summary.currentRuler
   ? `${summary.currentRuler.name}${summary.currentRuler.epithet?' '+summary.currentRuler.epithet:''}`
   : 'Founding Sovereign';
 const timelineHtml=summary.epitaphs.length
  ? summary.epitaphs.map(ep=>`<article class="chronicle-reign-item"><b>${esc(ep.name||ep.rulerName||'Sovereign')} ${esc(ep.epithet||'')}</b><small>Died ${ep.deathYear} · Age ${ep.age??ep.ageAtDeath??'—'} · ${esc(ep.deathReason||'passed peacefully')}</small><p>${esc(ep.definingMoment||ep.greatestAchievement||ep.summary||'')}</p></article>`).join('')
  : `<article class="chronicle-reign-item"><b>${esc(rulerLabel)}</b><small>Founding Reign · 1450–${summary.year}</small><p>The founding sovereign still holds the crown. Future reigns and royal obituaries will unfold across this timeline.</p></article>`;
 const battleHtml=summary.greatestBattle
  ? `<div class="chronicle-highlight-box"><h4>Greatest Battle of the Dynasty</h4><p><b>${esc(summary.greatestBattle.province)}</b> (${summary.greatestBattle.year}) against ${esc(summary.greatestBattle.enemy||'Rivals')} — ${(summary.greatestBattle.engaged||0).toLocaleString()} warriors clashed (${(summary.greatestBattle.casualties||0).toLocaleString()} casualties). Outcome: <b>${summary.greatestBattle.victory?'Victory':'Defeat'}</b>.</p><button type="button" class="rowbtn goldbtn" id="replay-greatest-battle-btn">⚔ Replay Greatest Battle in 3D</button></div>`
  : `<div class="chronicle-highlight-box"><h4>Greatest Battle of the Dynasty</h4><p>No major pitched battle recorded yet. Lead an army in the field to etch a legendary victory into the annals.</p></div>`;

 modalEl.innerHTML=`<div class="chronicle-endscreen-card">
  <header class="chronicle-endscreen-head">
   <div style="display:flex;gap:14px;align-items:center">
    ${renderCoASvg(coa,{size:62,esc})}
    <div>
     <span class="event-badge">${summary.campaignComplete?'GRAND CAMPAIGN FINALE · 1450–'+summary.year:'THE GREATEST STORY · ILLUSTRATED DYNASTY CHRONICLE'}</span>
     <h2 id="chronicle-endscreen-title">${esc(summary.realmName)} — ${esc(houseText)}</h2>
     <p class="smallnote">${esc(summary.shareCaption)}</p>
    </div>
   </div>
   <button type="button" class="smallbtn" id="close-chronicle-endscreen" aria-label="Close Dynasty Chronicle">Close ×</button>
  </header>
  <div class="chronicle-endscreen-stats">
   <div><small>YEARS RULED</small><b>${summary.yearsRuled}</b></div>
   <div><small>PROVINCES HELD</small><b>${provCount}</b></div>
   <div><small>CAPITAL TIER</small><b>Lv. ${summary.capitalLevel}</b></div>
   <div><small>ACHIEVEMENTS</small><b>${summary.unlockedCount}/${achs.length}</b></div>
  </div>
  <p class="chronicle-alt-history">${esc(summary.alternateHistory)}</p>
  ${battleHtml}
  <section class="chronicle-timeline-sec">
   <h3>Illustrated Reign Timeline</h3>
   <div class="chronicle-reign-list">${timelineHtml}</div>
  </section>
  <section class="chronicle-export-sec">
   <div class="chronicle-export-actions">
    <button type="button" class="goldbtn" id="export-chronicle-png">✦ Export Shareable Dynasty Chronicle Card (PNG)</button>
    <a id="download-chronicle-png" class="smallbtn" download="sovereign-1450-chronicle.png" hidden>Download PNG</a>
   </div>
   <div id="chronicle-canvas-wrap" class="chronicle-canvas-wrap" hidden>
    <canvas id="chronicle-share-canvas" aria-label="Shareable Dynasty Chronicle Card preview"></canvas>
   </div>
  </section>
 </div>`;

 modalEl.hidden=false;
 modalEl.querySelector('#close-chronicle-endscreen')?.addEventListener('click',()=>{modalEl.hidden=true;});
 modalEl.querySelector('#replay-greatest-battle-btn')?.addEventListener('click',()=>{
  if(!summary.greatestBattle)return;
  modalEl.hidden=true;
  onReplayBattle?.(summary.greatestBattle);
 });
 modalEl.querySelector('#export-chronicle-png')?.addEventListener('click',()=>{
  const wrap=modalEl.querySelector('#chronicle-canvas-wrap');
  const canvas=modalEl.querySelector('#chronicle-share-canvas');
  const dl=modalEl.querySelector('#download-chronicle-png');
  if(wrap)wrap.hidden=false;
  const dataUrl=renderChronicleShareCanvas(canvas,summary,achs,coa);
  if(dl && dataUrl){
   dl.href=dataUrl;
   dl.download=`sovereign-1450-${(summary.realmName||'dynasty').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${summary.year}.png`;
   dl.hidden=false;
  }
  onNotify?.('Dynasty Chronicle Card rendered — click Download PNG to save.');
 });
}
