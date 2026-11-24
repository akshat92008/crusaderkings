import {characterTitles} from './feudal-systems.js';
// All profile links refer to the existing authoritative campaign records.
const total=a=>(a.infantry||0)+(a.archers||0)+(a.cavalry||0);
export function characterContext(g,id){const p=g.politics?.people?.[id];if(!p)return null;const realm=g.politics.realms[p.realm],own=p.realm===g.player,prisoner=g.feudal?.prisoners?.[id]?.status==='held';
 const holdings=Object.entries(g.politics.holdings||{}).filter(([key,h])=>h.lord===id&&g.provinces[key]?.owner===h.realm).map(([id,h])=>({id,...h}));
 const armies=Object.values(g.armies||{}).filter(a=>g.military?.armies?.[a.id]?.commander===id).map(a=>({id:a.id,province:a.province,troops:total(a)}));
 const council=Object.entries(realm?.council||{}).filter(([,person])=>person===id).map(([role])=>role);
 const offices=Object.entries(g.royalCourt?.realms?.[p.realm]?.offices||{}).filter(([,o])=>o.person===id).map(([role])=>role);
 const family=[...(p.parents||[]).map(id=>({id,relation:'Parent'})),...(p.spouse?[{id:p.spouse,relation:'Spouse'}]:[]),...(p.children||[]).map(id=>({id,relation:'Child'}))].filter(x=>g.politics.people[x.id]);
 return {person:p,own,prisoner,sovereign:realm?.ruler===id,titles:characterTitles(g,id),holdings,armies,council,offices,family,canServe:own&&p.alive&&p.age>=18&&!prisoner};}
export function campaignLinks(g){const p=g.politics?.realms?.[g.player],r=p?.ruler,holdings=Object.entries(g.politics?.holdings||{}).filter(([id,h])=>h.realm===g.player&&g.provinces[id]?.owner===g.player&&h.lord!==r),armies=Object.values(g.armies||{}).filter(a=>a.owner===g.player&&total(a)>0),uncommanded=armies.filter(a=>!g.military?.armies?.[a.id]?.commander&&!g.naval?.voyages?.[a.id]);return {ruler:r||null,vassals:new Set(holdings.map(([,h])=>h.lord)).size,disloyal:holdings.filter(([,h])=>h.loyalty<40).length,armies:armies.length,uncommanded:uncommanded.length,troops:armies.reduce((n,a)=>n+total(a),0)};}
export function characterLink(p,esc,label){return p?'<button type="button" class="character-link" data-character="'+esc(p.id)+'">'+esc(label||p.name)+'</button>':'<span>None</span>';}
export function provinceLink(id,world,esc){const p=world.provinces.find(p=>p.id===id);return '<button type="button" class="character-link" data-province-link="'+esc(id)+'">'+esc(p?.name||id)+'</button>';}
export function sectionLink(tab,label,esc,section=''){return '<button class="rowbtn" data-priority-tab="'+esc(tab)+'" data-section-link="'+esc(section)+'">'+esc(label)+'</button>';}
export function contextualButton(action,type,id,label,esc,extra='',input=''){return '<button class="rowbtn" data-action="'+esc(action)+'" data-type="'+esc(type)+'" data-id="'+esc(id)+'" data-extra="'+esc(extra)+'" data-input="'+esc(input)+'">'+esc(label)+'</button>';}

export function realmWarContext(g,other=null){return Object.values(g.conflict?.wars||{}).filter(w=>w.status==='active'&&[w.attacker,w.defender].includes(g.player)&&(!other||[w.attacker,w.defender].includes(other))).map(w=>({...w,opponent:w.attacker===g.player?w.defender:w.attacker,ourScore:w.attacker===g.player?w.score:-w.score}));}
