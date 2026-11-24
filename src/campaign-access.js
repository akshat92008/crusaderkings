import {careerView,vassalCareer} from './player-career.js';
import {characterContext,characterLink,provinceLink,sectionLink} from './campaign-context.js';
import {renderPinButton} from './campaign-outliner.js';
import {characterInfluence} from './character-agency.js';
import {controller} from './campaign-war.js';

// The same navigation rules drive the tabs, finder, quick links and alerts.
export const CAREER_TABS=['realm','search','characters','chronicle'];
export function campaignTabAllowed(g,tab){return !vassalCareer(g)||CAREER_TABS.includes(tab);}
export function campaignTab(g,tab){return campaignTabAllowed(g,tab)?tab:'realm';}
export function careerPriorities(g){
 const v=careerView(g);if(!v)return [];
 const a=[],add=(label,detail,level='attention')=>a.push({tab:'realm',label,detail,level});
 if(!v.person?.alive)add('Dynasty succession','No living successor currently recorded.','urgent');
 else if(!v.free)add('Character unavailable','Advance time until your character is free and an adult.','urgent');
 if(!v.rows.length)add('Landless career','Seek an estate charter from the crown.');
 if(v.rows.some(r=>!r.controlled))add('Occupied estates','Occupied estates cannot be managed.','urgent');
 if(v.petition?.status==='pending')add('Petition pending','The liege will respond during the campaign.');
 return a;
}
export function renderCareerCharacter(g,world,id,esc){
 const x=characterContext(g,id);if(!x)return '<p>Character unavailable.</p>';
 const p=x.person,career=vassalCareer(g);
 return '<button class="rowbtn" data-character-back>‹ Back to previous screen</button>'+renderPinButton(g,'character',id,esc)+'<div class="character-hero"><h2>'+esc(p.name)+'</h2><p>'+esc(p.house)+' · '+p.age+' years · '+(p.alive?(x.prisoner?'Imprisoned':'Living'):'Deceased')+'</p><p>'+esc(g.factions[p.realm]?.name||p.realm)+'</p></div><div class="character-skills">'+Object.entries(p.skills||{}).map(([skill,value])=>'<div><small>'+esc(skill)+'</small><b>'+value+'/5</b></div>').join('')+'</div><div class="rule"><h3>Personal resources</h3><p>Personal gold: '+Math.floor(p.wealth||0)+' · Influence: '+characterInfluence(g,id)+'/100</p></div><div class="rule"><h3>Family</h3>'+x.family.map(y=>'<p>'+esc(y.relation)+' · '+characterLink(g.politics.people[y.id],esc)+'</p>').join('')+'</div><div class="rule"><h3>Titles and estates</h3>'+x.titles.filter(t=>t.tier!=='province').map(t=>'<p>'+esc(t.name)+'</p>').join('')+x.holdings.map(h=>'<p>'+provinceLink(h.id,world,esc)+' · '+Math.floor(h.wealth||0)+' estate gold</p>').join('')+'</div>'+(id===career?.person?sectionLink('realm','Manage your career',esc):'');
}
export function renderCareerProvince(g,world,id,esc){
 const p=world.provinces.find(q=>q.id===id),pr=g.provinces[id],h=g.politics.holdings[id];
 if(!p||!pr)return '<p class="paragraph">Select a province to inspect.</p>';
 const lord=g.politics.people[h?.lord],own=h?.lord===vassalCareer(g)?.person;
 return '<div class="rule"><h3>'+esc(p.name)+'</h3>'+renderPinButton(g,'province',id,esc)+'<p>Legal owner: '+esc(g.factions[pr.owner]?.name||pr.owner)+'</p><p>Controller: '+esc(g.factions[controller(g,id)]?.name||controller(g,id))+'</p><p>Development '+pr.development+' · Unrest '+Math.round(pr.unrest)+'%</p><p>Local lord: '+characterLink(lord,esc)+'</p>'+(own?'<p>Your estate · '+Math.floor(h.wealth||0)+' estate gold</p>'+sectionLink('realm','Manage your estates',esc):'<p class="smallnote">This estate is not yours to manage.</p>')+'</div>';
}
export function renderCareerLinks(g,world,esc){
 const v=careerView(g);if(!v)return '';
 return '<div class="rule"><h3>Career connections</h3><p>Your character: '+characterLink(v.person,esc)+'</p><p>Your liege: '+characterLink(v.liege,esc)+'</p>'+v.rows.map(r=>'<p>'+provinceLink(r.id,world,esc)+'</p>').join('')+'<div class="hub-links">'+sectionLink('characters','Character directory',esc)+sectionLink('search','Find people and provinces',esc)+sectionLink('chronicle','Campaign chronicle',esc)+'</div></div>';
}
