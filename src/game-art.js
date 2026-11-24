// Visually reviewed 4×4 icon sheets. Browser-safe sprite coordinates, no game-state mutation.
export const ICON_SHEETS={
  "personality": "Strategy_game_trait_icon_sheet_807567b6.jpg",
  "traits": "Character_trait_icon_sheet_fe2300f5.jpg",
  "skills": "Medieval_strategy_game_skill_icons_c1080878.jpg",
  "council": "Medieval_political_office_icon_s…_7042e0b0.jpg",
  "government": "Create_historical_strategy_game_…_7e8a58fa.jpg",
  "resources": "Medieval_strategy_game_icon_sheet_8967b69f.jpg"
};
export const ICON_NAMES={
  "personality": [
    "brave",
    "craven",
    "ambitious",
    "content",
    "honest",
    "deceitful",
    "generous",
    "greedy",
    "compassionate",
    "sadistic",
    "just",
    "arbitrary",
    "patient",
    "impatient",
    "diligent",
    "lazy"
  ],
  "traits": [
    "intelligent",
    "genius",
    "slow",
    "strong",
    "weak",
    "healthy",
    "sickly",
    "beautiful",
    "charismatic",
    "shy",
    "sociable",
    "paranoid",
    "zealous",
    "cynical",
    "temperate",
    "gluttonous"
  ],
  "skills": [
    "diplomacy",
    "martial",
    "stewardship",
    "intrigue",
    "learning",
    "prowess",
    "strategy",
    "administration",
    "scholarship",
    "medicine",
    "theology",
    "commerce",
    "leadership",
    "engineering",
    "seduction",
    "espionage"
  ],
  "council": [
    "monarch",
    "chancellor",
    "marshal",
    "steward",
    "spymaster",
    "religious adviser",
    "court physician",
    "regent",
    "commander",
    "governor",
    "treasurer",
    "royal tutor",
    "royal architect",
    "ambassador",
    "judge",
    "court musician"
  ],
  "government": [
    "feudal monarchy",
    "imperial government",
    "merchant republic",
    "tribal confederation",
    "nomadic khanate",
    "sultanate",
    "theocratic government",
    "bureaucratic monarchy",
    "infantry",
    "archers",
    "light cavalry",
    "heavy cavalry",
    "war elephants",
    "levy soldiers",
    "elite professional troops",
    "army commander"
  ],
  "resources": [
    "gold",
    "prestige",
    "piety",
    "legitimacy",
    "renown",
    "influence",
    "population",
    "manpower",
    "food supplies",
    "trade",
    "development",
    "stability",
    "unrest",
    "military morale",
    "authority",
    "diplomatic relations"
  ]
};
export function iconSpec(group,name){const key=String(name||'').toLowerCase().trim().replace(/_/g,' ');const i=ICON_NAMES[group]?.indexOf(key==='scholar'&&group==='council'?'religious adviser':key)??-1;if(i<0)return null;return {path:'assets/icons/'+encodeURIComponent(ICON_SHEETS[group]),x:(i%4)*100/3,y:Math.floor(i/4)*100/3};}
export function artIcon(group,name){const a=iconSpec(group,name);return a?'<span class="game-art-icon" aria-hidden="true" style="background-image:url(\''+a.path+'\');background-position:'+a.x+'% '+a.y+'%"></span>':'';}
export function traitIcon(name){return artIcon('personality',name)||artIcon('traits',name);}
export function setupMenuVideo(doc=document){const screen=doc.getElementById('start-screen'),video=doc.getElementById('menu-video');if(!screen||!video)return;const preference=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');const sync=()=>{if(screen.hidden||doc.hidden||preference?.matches){video.pause();return;}video.play()?.catch(()=>{});};new MutationObserver(sync).observe(screen,{attributes:true,attributeFilter:['hidden']});doc.addEventListener('visibilitychange',sync);preference?.addEventListener?.('change',sync);sync();}

// Reviewed, cropped WebP assets. Unknown cultures keep the original fallback.
const artRoot='assets/game-art/';
const realmSheets={"europe":"england france castile portugal aragon burgundy imperial poland muscovy novgorod scotland brittany kalmar genoa venice cyprus","africa_asia":"ottomans mamluks timurids qara horde morocco ethiopia mali songhai kongo kilwa zayyanid oirats chagatai","eastern":"vijayanagara bahmani delhi bengal gujarat ming joseon ashikaga ayutthaya dai-viet majapahit malacca tibet lanxang sunda","americas":"mexica maya pueblo haudenosaunee inca muisca tupi mapuche maori fiji aboriginal"};
const groups={"western":"england france castile portugal aragon burgundy imperial scotland brittany kalmar genoa venice","eastern":"poland muscovy novgorod cyprus","steppe":"horde oirats chagatai","ottoman":"ottomans mamluks morocco zayyanid","persian":"timurids qara","southindia":"vijayanagara bahmani","northindia":"delhi bengal gujarat","ming":"ming tibet","japan":"ashikaga joseon","southeast":"ayutthaya dai-viet majapahit malacca lanxang sunda","eastafrica":"ethiopia kilwa","westafrica":"mali songhai kongo","mesoamerica":"mexica maya","andean":"inca muisca"};
const realmIndex=Object.fromEntries(Object.entries(realmSheets).flatMap(([group,list])=>list.split(' ').map((id,i)=>[id,[group,i]])));
const regionIndex=Object.fromEntries(Object.entries(groups).flatMap(([group,list])=>list.split(' ').map(id=>[id,group])));
const tile=(type,group,i)=>artRoot+type+'/'+group+'-'+String(i).padStart(2,'0')+'.webp';
function hashArt(s){let h=2166136261;for(const c of String(s||''))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function realmArt(id){const a=realmIndex[id];return a?tile('realms',...a):null;}
export function portraitArt(p){if(!p)return null;const region=regionIndex[p.realm];if(!region)return null;const sex=p.sex==='female'?1:p.sex==='male'?0:null;if(sex===null||!Number.isFinite(p.age))return null;if(p.age<18){const children={western:[0,1],eastern:[2,3],northindia:[4,null],southindia:[null,5],ottoman:[6,null],persian:[null,7],ming:[8,null],japan:[10,9],steppe:[null,11],westafrica:[12,null],eastafrica:[null,13],southeast:[14,null],mesoamerica:[null,15]};const i=children[region]?.[sex];if(i==null)return null;return tile('portraits','children',i);}const row=sex*2+(p.age>=45?1:0);const chosen=region==='southindia'&&hashArt(p.id)%2?'india_extra':region;return tile('portraits',chosen,row*4+hashArt(p.id)%4);}
export function dynastyArt(p){if(!p)return null;const r=regionIndex[p.realm];if(!r)return null;const g=['western','eastern'].includes(r)?'europe':['northindia','southindia'].includes(r)?'india':['ottoman','persian','steppe'].includes(r)?'persia':'global';return tile('dynasties',g,hashArt(p.house||p.id)%16);}
export function assetImage(path,cls='game-art-image'){return path?'<img class="'+cls+'" src="'+path+'" alt="" loading="lazy" decoding="async">':'';}
export function portraitImage(p){return assetImage(portraitArt(p),'portrait-photo');}
const eventRules=[
[/funeral|mourning|grief|bereave|death of|loss of|memorial/,'mourning'],
[/wedding|marriage|betrothal|birth|newborn|heir.*educat|family/,'family'],
[/coronat|accession|succession|new reign|crown election/,'succession'],
[/prison|ransom|trial|justice|arrest|captiv/,'justice'],
[/civil war|rival claim|pretender/,'civilwar'],
[/rebell|revolt|ultimatum|faction demand/,'rebellion'],
[/mobiliz|recruit|levies|muster|campaign preparation|supply train/,'mobilization'],
[/battle|victory|defeat|retreat|wounded/,'battle'],
[/conspir|scheme|intrigue|spy|secret|betray|blackmail|intelligence/,'intrigue'],
[/pilgrim|travel|journey|caravan route|expedition/,'travel'],
[/hunt|falconry/,'hunt'],[/tournament|joust|contest/,'tournament'],
[/feast|festival|celebrat|banquet/,'festival'],
[/drought|famine|flood|plague|disease|disaster|relief/,'crisis'],
[/friend|rivalry|ambition|relationship|lifestyle/,'relationships'],
[/scholar|education|learning|manuscript|university|examination/,'learning'],
[/religion|faith|temple|sanctuary|monastery|religious/,'religion'],
[/trade|merchant|economy|commerce|market|harbor/,'trade'],
[/diploma|treaty|embassy|alliance|truce/,'diplomacy'],
[/regional|frontier|border struggle/,'regional'],
];
export function eventArt(event,realm){const text=typeof event==='string'?event:[event?.category,event?.title,event?.name,event?.id].filter(Boolean).join(' ');const kind=eventRules.find(([re])=>re.test(text.toLowerCase()))?.[1]||'council';const region=regionIndex[realm];const asian=['ming','japan','southeast'].includes(region),indian=['southindia','northindia'].includes(region);const byRegion={council:indian?2:asian?1:region==='ottoman'?3:0,regional:indian?1:region==='japan'?2:asian?3:0,mobilization:indian?1:asian?3:region==='ottoman'?2:0,trade:indian?1:region==='steppe'||region==='persian'?2:region==='westafrica'?3:0,religion:indian?1:asian?3:['ottoman','persian','steppe'].includes(region)?2:0,learning:indian?1:asian?3:region==='persian'?2:0,festival:indian?1:asian?2:region==='westafrica'?3:0};const i=Object.hasOwn(byRegion,kind)?byRegion[kind]:hashArt(text)%4;return tile('events',kind,i);}
export function eventImage(event,realm){return assetImage(eventArt(event,realm),'event-illustration');}
