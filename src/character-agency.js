import {humanControlsRealm,humanControlsCharacter} from './player-career.js';
// Character-owned political capital, independent ambitions and real wealth transfers.
import {changeOpinion,personalOpinion} from './chronicle-systems.js';
import {startPersonalScheme} from './intrigue-systems.js';
import {personalMarriage} from './dynastic-politics.js';
import {requestVassalPetition} from './vassal-courts.js';
import {characterHealth} from './living-systems.js';
import {ACTIVE_FACTION_STATUSES,createFaction,joinFaction} from './political-conflict.js';
import {claimantCandidates,addClaim} from './feudal-systems.js';
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const live=(g,id)=>g.politics?.people?.[id],free=(g,p)=>p?.alive&&p.age>=18&&g.feudal?.prisoners?.[p.id]?.status!=='held';
const pair=(a,b)=>[a,b].sort().join('|'),ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
export const PERSONALITY_AXES=Object.freeze(['boldness','compassion','greed','honor','zeal','sociability','diligence']);
export const SOCIAL_ROLES=Object.freeze(['landed','commander','merchant','clergy','courtier']);
export const TRAIT_CATEGORIES=Object.freeze(['personality','born','health','acquired','faith','culture']);
export const TRAIT_CATALOG=Object.freeze({
 // 1. Personality (27)
 brave:{id:'brave',name:'Brave',category:'personality',opposite:'cautious',summary:'Leads from the front; gains stress when retreating.',mods:{martial:2,combat:12,opinion:4}},
 cautious:{id:'cautious',name:'Cautious',category:'personality',opposite:'brave',summary:'Avoids reckless risks; prefers fortified patience.',mods:{intrigue:1,stewardship:1,combat:-4}},
 coward:{id:'coward',name:'Coward',category:'personality',opposite:'brave',summary:'Fears the melee; suffers morale shock unless hardened by survival.',mods:{martial:-2,combat:-14,opinion:-6}},
 ambitious:{id:'ambitious',name:'Ambitious',category:'personality',opposite:'content',summary:'Restlessly seeks higher crowns, titles, and leverage.',mods:{diplomacy:1,martial:1,intrigue:1,opinion:-8}},
 content:{id:'content',name:'Content',category:'personality',opposite:'ambitious',summary:'Loyal and steady; resists sedition and faction schemes.',mods:{stewardship:1,opinion:10,stressMult:0.8}},
 cruel:{id:'cruel',name:'Cruel',category:'personality',opposite:'kind',summary:'Rules by fear and harsh punishments; thrives on dread.',mods:{intrigue:2,martial:1,opinion:-14}},
 kind:{id:'kind',name:'Kind',category:'personality',opposite:'cruel',summary:'Merciful and beloved; gains heavy stress from executions or cruelty.',mods:{diplomacy:2,opinion:12}},
 paranoid:{id:'paranoid',name:'Paranoid',category:'personality',opposite:'trusting',summary:'Hard to assassinate, quick to suspect plots everywhere.',mods:{intrigue:2,opinion:-8,stressMult:1.25}},
 trusting:{id:'trusting',name:'Trusting',category:'personality',opposite:'paranoid',summary:'Wins goodwill easily, but vulnerable to court betrayal.',mods:{diplomacy:2,intrigue:-2,opinion:8}},
 lustful:{id:'lustful',name:'Lustful',category:'personality',opposite:'chaste',summary:'Higher fertility and court romance, higher scandal risk.',mods:{intrigue:1,opinion:-2}},
 chaste:{id:'chaste',name:'Chaste',category:'personality',opposite:'lustful',summary:'Respected by clergy; disciplined against court temptations.',mods:{learning:1,opinion:4}},
 gluttonous:{id:'gluttonous',name:'Gluttonous',category:'personality',opposite:'temperate',summary:'Indulges lavish banquets; relieves stress through feasts.',mods:{stewardship:-1,opinion:-4}},
 temperate:{id:'temperate',name:'Temperate',category:'personality',opposite:'gluttonous',summary:'Frugal and clear-headed in administration and health.',mods:{stewardship:2,learning:1,opinion:5}},
 proud:{id:'proud',name:'Proud',category:'personality',opposite:'humble',summary:'Commands royal aura; deeply offended by slights.',mods:{diplomacy:1,martial:1,opinion:-4}},
 humble:{id:'humble',name:'Humble',category:'personality',opposite:'proud',summary:'Wins devotion from clergy and commoners alike.',mods:{learning:1,opinion:8,stressMult:0.85}},
 just:{id:'just',name:'Just',category:'personality',opposite:'arbitrary',summary:'Upholds law and charters; suffers stress from tyranny or bribery.',mods:{stewardship:2,diplomacy:1,opinion:10}},
 arbitrary:{id:'arbitrary',name:'Arbitrary',category:'personality',opposite:'just',summary:'Bends law to personal whim without losing sleep.',mods:{intrigue:2,opinion:-10}},
 generous:{id:'generous',name:'Generous',category:'personality',opposite:'greedy',summary:'Beloved patron; gains stress when imposing harsh taxes.',mods:{diplomacy:2,stewardship:-1,opinion:12}},
 greedy:{id:'greedy',name:'Greedy',category:'personality',opposite:'generous',summary:'Extracts maximum gold from estates and customs.',mods:{stewardship:2,opinion:-8}},
 honest:{id:'honest',name:'Honest',category:'personality',opposite:'deceitful',summary:'Trusted in treaties; stressed by schemes and blackmail.',mods:{diplomacy:2,intrigue:-2,opinion:8}},
 deceitful:{id:'deceitful',name:'Deceitful',category:'personality',opposite:'honest',summary:'Natural conspirator with strong scheme power.',mods:{intrigue:3,diplomacy:-1,opinion:-8}},
 patient:{id:'patient',name:'Patient',category:'personality',opposite:'wrathful',summary:'Measured strategist who endures long sieges and crises.',mods:{learning:1,stewardship:1,stressMult:0.8}},
 wrathful:{id:'wrathful',name:'Wrathful',category:'personality',opposite:'patient',summary:'Fierce in battle, quick to retaliate against insults.',mods:{martial:2,combat:8,opinion:-8}},
 diligent:{id:'diligent',name:'Diligent',category:'personality',opposite:'indolent',summary:'Tireless administrator who develops provinces rapidly.',mods:{stewardship:2,learning:1,stressMult:1.15}},
 indolent:{id:'indolent',name:'Indolent',category:'personality',opposite:'diligent',summary:'Avoids strain and stress, at the cost of royal efficiency.',mods:{stewardship:-1,stressMult:0.7}},
 gregarious:{id:'gregarious',name:'Gregarious',category:'personality',opposite:'reserved',summary:'Charms vassals and foreign envoys effortlessly.',mods:{diplomacy:2,opinion:10}},
 reserved:{id:'reserved',name:'Reserved',category:'personality',opposite:'gregarious',summary:'Guarded and private; shields secrets from court gossips.',mods:{intrigue:1,learning:1,opinion:-3}},
 // 2. Born / Congenital (9)
 genius:{id:'genius',name:'Genius',category:'born',opposite:'slow',summary:'Rare generational intellect excelling across every craft of rule.',mods:{diplomacy:3,martial:3,stewardship:3,intrigue:3,learning:3,opinion:6}},
 quick:{id:'quick',name:'Quick',category:'born',opposite:'slow',summary:'Sharp mind that masters administration and rhetoric rapidly.',mods:{diplomacy:2,stewardship:2,learning:2}},
 slow:{id:'slow',name:'Slow',category:'born',opposite:'genius',summary:'Struggles with complex statecraft and intrigues.',mods:{diplomacy:-2,stewardship:-2,learning:-2}},
 strong:{id:'strong',name:'Strong',category:'born',opposite:'weak',summary:'Mighty constitution in battle and illness.',mods:{martial:2,combat:12,opinion:4}},
 weak:{id:'weak',name:'Weak',category:'born',opposite:'strong',summary:'Frail frame; vulnerable to wounds and camp fevers.',mods:{martial:-2,combat:-10}},
 beautiful:{id:'beautiful',name:'Beautiful',category:'born',opposite:'ugly',summary:'Commanding presence that sways courts and suitors.',mods:{diplomacy:3,opinion:10}},
 ugly:{id:'ugly',name:'Ugly',category:'born',opposite:'beautiful',summary:'Faces unfair court prejudice, yet often sharpens resolve.',mods:{diplomacy:-1,opinion:-8}},
 giant:{id:'giant',name:'Giant',category:'born',opposite:'dwarf',summary:'Towering stature inspiring dread on the battlefield.',mods:{martial:3,combat:15,opinion:-2}},
 dwarf:{id:'dwarf',name:'Dwarf',category:'born',opposite:'giant',summary:'Short stature often underestimated by rival lords.',mods:{intrigue:1,learning:1,opinion:-4}},
 // 3. Health (8)
 ill:{id:'ill',name:'Ill',category:'health',summary:'Weakened by fever or sickness; reduced court vigor.',mods:{martial:-1,stewardship:-1,combat:-8}},
 drunkard:{id:'drunkard',name:'Drunkard',category:'health',summary:'Coping mechanism from stress; dulls judgment and stewardship.',mods:{stewardship:-2,diplomacy:-1,stressMult:0.85}},
 insomniac:{id:'insomniac',name:'Insomniac',category:'health',summary:'Haunted nights slow recovery and sharpen paranoia.',mods:{learning:1,stewardship:-1,stressMult:1.2}},
 robust:{id:'robust',name:'Robust',category:'health',summary:'Hearty vitality that shrugs off campaigns and winter.',mods:{martial:1,combat:6}},
 infirm:{id:'infirm',name:'Infirm',category:'health',summary:'Age and frailty limit personal command; invites regency.',mods:{martial:-3,diplomacy:-1,stewardship:-2}},
 'one-eyed':{id:'one-eyed',name:'One-Eyed',category:'health',summary:'Lost an eye in war; feared and respected by veterans.',mods:{martial:1,intrigue:1,combat:4}},
 wounded:{id:'wounded',name:'Wounded',category:'health',summary:'Carries a serious battle wound impairing martial command for months.',mods:{martial:-2,combat:-14}},
 'plague-scarred':{id:'plague-scarred',name:'Plague-Scarred',category:'health',summary:'Survived pestilence with hardened immunity and grim resolve.',mods:{learning:1,opinion:-2}},
 // 4. Acquired (11)
 scarred:{id:'scarred',name:'Scarred',category:'acquired',summary:'Bears honorable marks of past battles.',mods:{martial:1,opinion:4,combat:5}},
 'battle-hardened':{id:'battle-hardened',name:'Battle-Hardened',category:'acquired',summary:'Forged in real combat; immune to panic on the field.',mods:{martial:2,combat:14,stressMult:0.85}},
 inspired:{id:'inspired',name:'Inspired',category:'acquired',summary:'Seized by visionary clarity in statecraft and culture.',mods:{learning:2,diplomacy:2,stewardship:1}},
 broken:{id:'broken',name:'Broken',category:'acquired',summary:'Shattered by extreme stress; struggles to project royal authority.',mods:{diplomacy:-2,martial:-2,stewardship:-2,opinion:-10}},
 reclusive:{id:'reclusive',name:'Reclusive',category:'acquired',summary:'Withdrew from court crowds to cope with pressure.',mods:{diplomacy:-2,learning:1,stressMult:0.8}},
 flagellant:{id:'flagellant',name:'Flagellant',category:'acquired',summary:'Endures harsh penance to purge stress and sin.',mods:{learning:1,opinion:2,stressMult:0.8}},
 strategist:{id:'strategist',name:'Strategist',category:'acquired',summary:'Master of flank timing, supply lines, and decisive terrain.',mods:{martial:3,combat:15}},
 duelist:{id:'duelist',name:'Duelist',category:'acquired',summary:'Deadly in personal combat and tourney lists.',mods:{martial:2,combat:12}},
 architect:{id:'architect',name:'Architect',category:'acquired',summary:'Transforms provincial capitals and fortifications.',mods:{stewardship:3}},
 poet:{id:'poet',name:'Poet',category:'acquired',summary:'Composes verses remembered across royal courts.',mods:{diplomacy:2,learning:1,opinion:6}},
 'master-schemer':{id:'master-schemer',name:'Master Schemer',category:'acquired',summary:'Weaves webs of hooks, informants, and blackmail.',mods:{intrigue:3}},
 // 5. Faith (6)
 zealous:{id:'zealous',name:'Zealous',category:'faith',opposite:'cynical',summary:'Fiercely defends orthodoxy; demands holy wars and conversion.',mods:{martial:1,learning:1,opinion:4}},
 cynical:{id:'cynical',name:'Cynical',category:'faith',opposite:'zealous',summary:'Questions clerical authority; favors pragmatic intrigue.',mods:{intrigue:2,learning:1,opinion:-4}},
 devoted:{id:'devoted',name:'Devoted',category:'faith',summary:'Known for pious charity and shrine patronage.',mods:{learning:2,opinion:8}},
 heretical:{id:'heretical',name:'Heretical',category:'faith',summary:'Embraces heterodox teachings rejected by the orthodoxy.',mods:{learning:1,opinion:-16}},
 excommunicated:{id:'excommunicated',name:'Excommunicated',category:'faith',summary:'Cast out by religious authorities; rival realms gain holy CB.',mods:{diplomacy:-3,opinion:-25}},
 'pillar-of-faith':{id:'pillar-of-faith',name:'Pillar of Faith',category:'faith',summary:'Revered champion of temples, pilgrimages, and sacred sites.',mods:{diplomacy:2,learning:2,opinion:12}},
 // 6. Culture (6)
 cultured:{id:'cultured',name:'Cultured',category:'culture',summary:'Patron of manuscripts, music, and courtly refinement.',mods:{diplomacy:2,learning:1,opinion:6}},
 polyglot:{id:'polyglot',name:'Polyglot',category:'culture',summary:'Speaks multiple court languages; excels at foreign diplomacy.',mods:{diplomacy:3,opinion:8}},
 cosmopolitan:{id:'cosmopolitan',name:'Cosmopolitan',category:'culture',summary:'Welcomes diverse traditions and accelerates cultural fusion.',mods:{diplomacy:2,stewardship:1,opinion:6}},
 traditionalist:{id:'traditionalist',name:'Traditionalist',category:'culture',summary:'Guards ancestral customs; boosts native vassal loyalty.',mods:{stewardship:1,opinion:4}},
 francophile:{id:'francophile',name:'Culture-Admirer',category:'culture',summary:'Fascinated by foreign court etiquette and arts.',mods:{diplomacy:1,learning:1,opinion:4}},
 'scholar-king':{id:'scholar-king',name:'Scholar-King',category:'culture',summary:'Unites royal rule with deep classical learning.',mods:{learning:3,stewardship:1,opinion:8}}
});
export function traitDefinition(id){return TRAIT_CATALOG[id]||{id,name:String(id||'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),category:'acquired',summary:'Personal character trait.',mods:{}};}
export function traitCategory(id){return traitDefinition(id).category;}
export function traitsByCategory(category){return Object.values(TRAIT_CATALOG).filter(t=>t.category===category);}
export function traitModifiers(p){
 const out={diplomacy:0,martial:0,stewardship:0,intrigue:0,learning:0,opinion:0,combat:0,stressMult:1};
 for(const id of p?.traits||[]){
  const m=TRAIT_CATALOG[id]?.mods;
  if(!m)continue;
  for(const k of ['diplomacy','martial','stewardship','intrigue','learning','opinion','combat'])if(m[k])out[k]+=m[k];
  if(m.stressMult)out.stressMult*=m.stressMult;
 }
 return out;
}
export function deriveSocialRole(g,p,landedSet=null,commanderSet=null){
 if(!p)return 'courtier';
 const char=typeof p==='string'?g.politics?.people?.[p]:p;
 if(!char)return 'courtier';
 const r=char.realm,s=g.politics?.realms?.[r];
 const isLanded=landedSet?landedSet.has(char.id):(s?.ruler===char.id||Object.values(g.politics?.holdings||{}).some(h=>h.realm===r&&h.lord===char.id));
 if(isLanded)return 'landed';
 const isCmd=commanderSet?commanderSet.has(char.id):(s?.council?.marshal===char.id||Object.values(g.military?.armies||{}).some(a=>a.commander===char.id));
 if(isCmd)return 'commander';
 if(g.institutions?.realms?.[r]?.houses?.[char.id]||(['republic','city'].includes(g.civic?.realms?.[r]?.government)&&s?.council?.steward===char.id))return 'merchant';
 if(g.living?.realms?.[r]?.faithAdvisor===char.id||s?.council?.scholar===char.id||g.identity?.clergy?.[char.id])return 'clergy';
 return 'courtier';
}
export function defaultPersonality(p){
 const t=new Set(p.traits||[]),n=hash(p.id||'char'),jit=shift=>((n>>>shift)%41)-20;
 return {
  boldness:cap((t.has('brave')?55:0)-(t.has('cautious')?55:0)+jit(0),-100,100),
  compassion:cap((t.has('generous')?45:0)+(t.has('just')?25:0)-(t.has('wrathful')?55:0)+jit(4),-100,100),
  greed:cap((t.has('greedy')?60:0)-(t.has('generous')?50:0)+jit(8),-100,100),
  honor:cap((t.has('just')?40:0)+(t.has('honest')?40:0)-(t.has('deceitful')?55:0)-(t.has('arbitrary')?40:0)+jit(12),-100,100),
  zeal:cap((t.has('zealous')?60:0)-(t.has('cynical')?55:0)+jit(16),-100,100),
  sociability:cap((t.has('gregarious')?55:0)-(t.has('reserved')?55:0)+jit(20),-100,100),
  diligence:cap((t.has('diligent')?55:0)-(t.has('indolent')?55:0)+jit(24),-100,100)
 };
}
export function ensureCharacterSchema(g,p,landedSet=null,commanderSet=null){
 let game=g, char=p;
 if(g&&!p&&typeof g==='object'&&g.id){char=g;game=null;}
 if(!char||typeof char!=='object')return char;
 p=char;
 const r=p.realm,s=game?.politics?.realms?.[r];
 const landed=landedSet?landedSet.has(p.id):(s?.ruler===p.id||Object.values(game?.politics?.holdings||{}).some(h=>h.realm===r&&h.lord===p.id));
 if(!Number.isFinite(p.wealth))p.wealth=100;
 if(!Number.isFinite(p.prestige))p.prestige=(s?.ruler===p.id?60:landed?25:10)+(hash(p.id+'pr')%15);
 if(!Number.isFinite(p.piety))p.piety=(p.skills?.learning||1)*8+(p.traits?.includes('zealous')?25:10);
 if(!p.personality||typeof p.personality!=='object'){p.personality=defaultPersonality(p);}
 else{const def=defaultPersonality(p);for(const ax of PERSONALITY_AXES)if(!Number.isFinite(p.personality[ax]))p.personality[ax]=def[ax];}
 p.friends??=[];p.rivals??=[];p.lovers??=[];p.mentors??=[];p.wards??=[];
 p.grievances??=[];p.memories??=[];
 const ax=game?.agency?.people?.[p.id];
 if(ax){if(!Number.isFinite(p.influence))p.influence=ax.influence;else ax.influence=cap(num(ax.influence),0,100);}
 else if(!Number.isFinite(p.influence))p.influence=landed?20:10;
 p.role=deriveSocialRole(g,p,landedSet,commanderSet);
 return p;
}
export function recordGrievance(g,personId,againstId,reason,severity=25,opts={}){
 const p=live(g,personId),q=live(g,againstId);if(!p||!q||p.id===q.id)return false;
 ensureCharacterSchema(g,p);
 const permanent=Boolean(opts.permanent||severity>=55||['executed kin','assassinated kin','revoked title'].includes(reason));
 const existing=p.grievances.find(x=>x.against===againstId&&x.reason===reason);
 if(existing){existing.severity=cap(existing.severity+severity,0,100);existing.turn=g.turn;if(permanent)existing.permanent=true;}
 else{p.grievances.unshift({against:againstId,reason,severity:cap(severity,0,100),turn:g.turn,permanent});p.grievances=p.grievances.slice(0,20);}
 bond(g,p,q,-Math.round(severity/2),severity);
 return true;
}
export function addRomance(g,aId,bId){
 const a=live(g,aId),b=live(g,bId);if(!a||!b||a.id===b.id||a.age<18||b.age<18)return false;
 ensureCharacterSchema(g,a);ensureCharacterSchema(g,b);
 if(!a.lovers.includes(b.id))a.lovers.push(b.id);
 if(!b.lovers.includes(a.id))b.lovers.push(a.id);
 relation(g,a,b,15);
 note(g,a,a.name+' and '+b.name+' became romantically involved.','romance',b.id);
 note(g,b,b.name+' and '+a.name+' became romantically involved.','romance',a.id);
 return true;
}
export function roleSets(g){
 const landedSet=new Set(),commanderSet=new Set();
 for(const s of Object.values(g.politics?.realms||{})){if(s?.ruler)landedSet.add(s.ruler);if(s?.council?.marshal)commanderSet.add(s.council.marshal);}
 for(const h of Object.values(g.politics?.holdings||{}))if(h?.lord)landedSet.add(h.lord);
 for(const a of Object.values(g.military?.armies||{}))if(a?.commander)commanderSet.add(a.commander);
 return {landedSet,commanderSet};
}
export function syncCharacterRelationships(g){
 const people=g.politics?.people||{},{landedSet,commanderSet}=roleSets(g);
 for(const p of Object.values(people)){
  if(!p?.alive)continue;
  ensureCharacterSchema(g,p,landedSet,commanderSet);
  p.friends=[];p.rivals=[];p.mentors=[];p.wards=[];
  p.lovers=(p.lovers||[]).filter(id=>live(g,id)?.alive);
  p.grievances=(p.grievances||[]).filter(x=>live(g,x.against)?.alive&&(x.permanent||g.turn-x.turn<=120));
 }
 for(const rel of Object.values(g.chronicles?.relationships||{})){
  const a=live(g,rel.a),b=live(g,rel.b);if(!a?.alive||!b?.alive)continue;
  if(rel.kind==='friend'||rel.opinion>=50){if(!a.friends.includes(b.id))a.friends.push(b.id);if(!b.friends.includes(a.id))b.friends.push(a.id);}
  if(rel.kind==='rival'||rel.opinion<=-50){if(!a.rivals.includes(b.id))a.rivals.push(b.id);if(!b.rivals.includes(a.id))b.rivals.push(a.id);}
 }
 for(const p of Object.values(people)){
  if(!p?.alive)continue;
  const gid=p.civic?.guardian,guardian=gid&&live(g,gid);
  if(guardian?.alive&&p.age<18){
   if(!p.mentors.includes(guardian.id))p.mentors.push(guardian.id);
   if(!guardian.wards.includes(p.id))guardian.wards.push(p.id);
  }
 }
}
export function initAgency(g){const existed=!!g.agency;const s=g.agency??={version:2,people:{},lastTick:-1,history:[]};s.version=2;s.people??={};s.history??=[];s.dilemmas??={};s.next??=1;if(!existed||!s._schemaInit){s._schemaInit=true;const {landedSet,commanderSet}=roleSets(g);for(const p of Object.values(g.politics?.people||{}))if(p?.alive)ensureCharacterSchema(g,p,landedSet,commanderSet);}return s;}
function record(g,id){const s=initAgency(g);const x=s.people[id]??={influence:10,agenda:null,lastAction:-120,lastIncome:-120};x.goals??={};x.bonds??={};x.memories??=[];x.lastAction??=-120;x.lastIncome??=-120;x.influence=cap(num(x.influence),0,100);const p=live(g,id);if(p)p.influence=x.influence;return x;}
export function characterInfluence(g,id){return cap(num(g.agency?.people?.[id]?.influence??g.politics?.people?.[id]?.influence??10),0,100);}
export function characterAgenda(g,id){return g.agency?.people?.[id]?.agenda||null;}
function note(g,p,text,kind='action',target=null){const s=initAgency(g),x=record(g,p.id);const isPlayer=p.realm===g.player;const entry={realm:p.realm,person:p.id,turn:g.turn,text,kind,target};s.history.unshift(entry);s.history=s.history.slice(0,200);if(x.memories[0]?.text!==text){x.memories.unshift(entry);x.memories=x.memories.slice(0,isPlayer?14:6);}p.memories??=[];if(p.memories.at(-1)!==text){p.memories.push(text);p.memories=p.memories.slice(isPlayer?-16:-6);}}
function motive(p){const t=p.traits||[],ax=p.personality||{};if(t.includes('ambitious')||(ax.boldness||0)>=45)return 'seek influence';if(t.includes('greedy')||(ax.greed||0)>=45)return 'accumulate wealth';if(t.includes('gregarious')||t.includes('generous')||(ax.sociability||0)>=45)return 'build friendships';if(t.includes('wrathful')||t.includes('deceitful')||(ax.compassion||0)<=-45)return 'undermine rival';if(t.includes('diligent')||(ax.diligence||0)>=45)return 'develop ability';return 'secure household';}
function transfer(g,p,q,amount,source){if(source.wealth<amount)return false;source.wealth-=amount;q.wealth=num(q.wealth)+amount;return true;}
export function characterInteraction(g,r,id,action){return characterInteractionAs(g,r,g.politics?.realms?.[r]?.ruler,id,action);}
export function characterInteractionAs(g,r,actor,id,action){const s=g.politics?.realms?.[r],p=live(g,actor),q=live(g,id),f=g.factions[r];if(!free(g,p)||!free(g,q)||q.realm!==r||p.id===id||(p.realm!==r&&p.id!==s?.ruler))return no('Choose a different free adult in your court.');if(action==='personal-patronage'&&p.id!==s?.ruler)return no('Only the sovereign can spend treasury funds on patronage.');
 const x=record(g,p.id),target=record(g,id),rel=g.chronicles?.relationships?.[pair(p.id,id)];if(g.turn-(rel?.last??-120)<12)return no('Personal interactions require a yearly interval.');
 if(action==='personal-gift'){if(num(p.wealth)<40)return no('Requires 40 personal gold, not treasury funds.');if(!transfer(g,p,q,40,p))return no('Insufficient personal wealth.');relation(g,p,q,16);target.influence=cap(target.influence+2,0,100);q.influence=target.influence;}
 else if(action==='personal-patronage'){if(f.treasury<120)return no('Requires 120 treasury gold.');f.treasury-=120;q.wealth=num(q.wealth)+120;relation(g,p,q,24);target.influence=cap(target.influence+8,0,100);q.influence=target.influence;x.influence=cap(x.influence+2,0,100);p.influence=x.influence;}
 else if(action==='personal-rebuke'){if(x.influence<5)return no('Requires 5 personal influence.');x.influence-=5;p.influence=x.influence;target.influence=cap(target.influence-8,0,100);q.influence=target.influence;relation(g,p,q,-20);recordGrievance(g,q.id,p.id,'public rebuke',15);}
 else return no('Unknown personal interaction.');
 g.chronicles.relationships[pair(p.id,id)].last=g.turn;note(g,p,p.name+' → '+q.name+': '+action.slice(9));return ok('Personal interaction completed.');}

const has=(p,t)=>(p.traits||[]).includes(t);
const stress=(p,n)=>{
 if(!p)return;
 const cur=Number.isFinite(p.stress)?p.stress:num(p.civic?.stress)*3;
 const next=cap(Math.round(cur+n*3),0,300);
 p.stress=next;
 if(p.civic)p.civic.stress=cap(Math.round(next/3),0,100);
};
export function characterAgeStage(age){
 const a=Number(age)||0;
 if(a<18)return {stage:'youth',label:'Youth',cssClass:'age-youth'};
 if(a<40)return {stage:'prime',label:'Prime',cssClass:'age-prime'};
 if(a<60)return {stage:'mature',label:'Mature',cssClass:'age-mature'};
 return {stage:'elder',label:'Elder',cssClass:'age-elder'};
}
const MINOR_BREAK_CHOICES=[
 {id:'drink',label:'Drown the Strain in Wine (-45 Stress, Gain Drunkard)',cost:0},
 {id:'isolate',label:'Retreat to Private Chambers (-45 Stress, Gain Reclusive)',cost:0},
 {id:'confide',label:'Confide in Trusted Companions (-55 Stress, 60g)',cost:60},
 {id:'penance',label:'Undertake Harsh Spiritual Penance (-45 Stress, +12 Piety, Gain Flagellant)',cost:0}
];
const CRISIS_STAGE1_CHOICES=[
 {id:'crisis_seek_redemption',label:'Seek Counsel & Inner Reckoning (Enter Redemption Arc, 80g)',cost:80},
 {id:'crisis_lash_out',label:'Lash Out at the Court (Enter Tyranny Spiral, +10 Dread / -6 Stability)',cost:0},
 {id:'crisis_abdicate_duties',label:'Retreat into Melancholy (-45 Stress, -8 Legitimacy, Gain Reclusive)',cost:0}
];
const CRISIS_STAGE2_REDEMPTION_CHOICES=[
 {id:'redemption_embrace',label:'Rise Tempered by Trial (-90 Stress, Gain Inspired, +8 Legitimacy)',cost:0},
 {id:'redemption_humble',label:'Dedicate Your Reign to Service (-80 Stress, Gain Humble & Just, +6 Stability)',cost:0}
];
const CRISIS_STAGE2_SPIRAL_CHOICES=[
 {id:'spiral_purge',label:'Purge Suspected Traitors (-70 Stress, Gain Paranoid & Cruel, -8 Stability)',cost:0},
 {id:'spiral_reckless',label:'Drown Fear in Excess (-65 Stress, Gain Broken & Drunkard, -6 Prestige)',cost:0}
];
export function addStress(g,personId,amount,reason=''){
 const p=live(g,personId);if(!p?.alive)return {ok:false,stress:0,breakTriggered:null};
 const mods=traitModifiers(p);
 const scaled=amount>0?Math.round(amount*mods.stressMult):Math.round(amount);
 const prev=Number.isFinite(p.stress)?p.stress:num(p.civic?.stress)*3;
 const next=cap(prev+scaled,0,300);
 p.stress=next;
 p.civic??={stress:0};
 p.civic.stress=cap(Math.round(next/3),0,100);
 if(reason&&scaled>=12){
  note(g,p,`${p.name} suffered +${scaled} stress (${reason}).`,'stress');
 }
 let breakTriggered=null;
 const isPlayerRuler=p.id===g.politics?.realms?.[g.player]?.ruler;
 if(prev<200&&next>=200){
  breakTriggered='major';
  p.traits??=[];
  if(!p.traits.includes('broken'))p.traits.push('broken');
  if(g.factions?.[p.realm]&&p.id===g.politics?.realms?.[p.realm]?.ruler){
   g.factions[p.realm].stability=cap((g.factions[p.realm].stability||50)-6,0,100);
  }
  note(g,p,`${p.name} suffered a Major Mental Break (${reason||'unbearable pressure'}) and became Broken.`,'stress_break');
  if(isPlayerRuler){
   const root=initAgency(g);
   root.pendingStressBreak={
    personId:p.id,severity:'major',tier:'major',stage:1,stress:next,reason:reason||'Unbearable pressure of the crown',turn:g.turn,
    title:'Major Mental Break — The Crown Cracks',
    desc:`${p.name} has reached extreme stress (${next}/300) after ${reason||'acting against their deepest convictions'}. Erratic decrees threaten court stability unless a coping outlet is chosen.`,
    description:`${p.name} has reached extreme stress (${next}/300) after ${reason||'acting against their deepest convictions'}. Erratic decrees threaten court stability unless a coping outlet is chosen.`,
    choices:CRISIS_STAGE1_CHOICES
   };
   g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`MENTAL BREAK: ${p.name} suffered a Major Break (${next}/300 stress)!`});
   if(g.log)g.log=g.log.slice(0,45);
  }else{
   p.stress=cap(next-55,0,300);p.civic.stress=cap(Math.round(p.stress/3),0,100);
  }
 }else if(prev<150&&next>=150){
  breakTriggered='crisis';
  note(g,p,`${p.name} entered a Sovereign Stress Crisis (${next}/300) — teetering between redemption and ruin.`,'stress_break');
  if(isPlayerRuler){
   const root=initAgency(g);
   root.pendingStressBreak={
    personId:p.id,severity:'crisis',tier:'crisis',stage:1,stress:next,reason:reason||'Relentless weight of kingship',turn:g.turn,
    title:'Character Crisis — Edge of the Abyss (Stage 1/2)',
    desc:`${p.name} stands at a breaking point (${next}/300 stress). Will you seek redemption through reflection, or spiral into ruthless suspicion?`,
    description:`${p.name} stands at a breaking point (${next}/300 stress). Will you seek redemption through reflection, or spiral into ruthless suspicion?`,
    choices:CRISIS_STAGE1_CHOICES
   };
   g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`STRESS CRISIS: ${p.name} reached ${next}/300 stress — a decisive turning point begins.`});
   if(g.log)g.log=g.log.slice(0,45);
  }else{
   p.stress=cap(next-45,0,300);p.civic.stress=cap(Math.round(p.stress/3),0,100);
  }
 }else if(prev<100&&next>=100){
  breakTriggered='minor';
  const copingPool=['drunkard','reclusive','flagellant','insomniac'];
  const picked=copingPool[hash(p.id+':'+g.turn)%copingPool.length];
  if(isPlayerRuler){
   const root=initAgency(g);
   root.pendingStressBreak={
    personId:p.id,severity:'minor',tier:'minor',stage:1,stress:next,reason:reason||'Accumulated strain of rule',turn:g.turn,
    title:'Mental Break — The Weight of the Crown',
    desc:`${p.name} is overwhelmed by stress (${next}/300) after ${reason||'hard choices at court'}. How will you cope with the strain?`,
    description:`${p.name} is overwhelmed by stress (${next}/300) after ${reason||'hard choices at court'}. How will you cope with the strain?`,
    choices:MINOR_BREAK_CHOICES
   };
   g.log?.unshift({date:g.year+' · month '+(g.month+1),text:`STRESS BREAK: ${p.name} reached ${next}/300 stress — choose a coping path.`});
   if(g.log)g.log=g.log.slice(0,45);
  }else{
   p.traits??=[];
   if(!p.traits.includes(picked))p.traits.push(picked);
   p.stress=cap(next-35,0,300);p.civic.stress=cap(Math.round(p.stress/3),0,100);
   note(g,p,`${p.name} coped with a minor stress break by becoming ${traitDefinition(picked).name}.`,'stress_break');
  }
 }
 return {ok:true,stress:p.stress,civicStress:p.civic.stress,breakTriggered};
}
export function currentStressBreak(g){
 const b=g.agency?.pendingStressBreak;
 if(!b)return null;
 const p=live(g,b.personId);
 if(!p?.alive){delete g.agency.pendingStressBreak;return null;}
 if(!Array.isArray(b.choices)||!b.choices.length){
  b.choices=b.severity==='crisis'||b.severity==='major'?CRISIS_STAGE1_CHOICES:MINOR_BREAK_CHOICES;
 }
 b.tier??=b.severity||'minor';
 b.desc??=b.description||'';
 return b;
}
export function resolveStressBreak(g,choiceId){
 const b=currentStressBreak(g);
 if(!b)return no('No active mental break to resolve.');
 const p=live(g,b.personId);
 if(!p?.alive)return no('Character is no longer living.');
 p.traits??=[];
 const f=g.factions?.[p.realm];
 if(choiceId==='crisis_seek_redemption'){
  if(f&&f.treasury>=80)f.treasury-=80;
  g.agency.pendingStressBreak={
   personId:p.id,severity:'crisis',tier:'crisis',stage:2,arc:'redemption',stress:p.stress,turn:g.turn,
   title:'Redemption Arc — Dawn After the Storm (Stage 2/2)',
   desc:`Through quiet counsel and honest reckoning, ${p.name} confronts the fears gnawing at the crown. Seal this transformation into your character's legacy.`,
   description:`Through quiet counsel and honest reckoning, ${p.name} confronts the fears gnawing at the crown.`,
   choices:CRISIS_STAGE2_REDEMPTION_CHOICES
  };
  return ok(`${p.name} entered the Redemption Arc (Stage 2/2).`);
 }
 if(choiceId==='crisis_lash_out'){
  if(f)f.stability=cap((f.stability||50)-6,0,100);
  g.agency.pendingStressBreak={
   personId:p.id,severity:'crisis',tier:'crisis',stage:2,arc:'spiral',stress:p.stress,turn:g.turn,
   title:'Spiral Crisis — Shadows in the Throne Room (Stage 2/2)',
   desc:`Suspicion consumes ${p.name}. Every whispered word in the hall sounds like treason. How far will the spiral run?`,
   description:`Suspicion consumes ${p.name}. Every whispered word in the hall sounds like treason.`,
   choices:CRISIS_STAGE2_SPIRAL_CHOICES
  };
  return ok(`${p.name} descended into the Spiral Crisis (Stage 2/2).`);
 }
 if(choiceId==='redemption_embrace'){
  p.traits=p.traits.filter(t=>t!=='broken');
  if(!p.traits.includes('inspired'))p.traits.push('inspired');
  p.stress=cap((p.stress||150)-90,0,300);
  if(f)f.legitimacy=cap((f.legitimacy||50)+8,0,100);
  note(g,p,`${p.name} emerged from a sovereign crisis Inspired and renewed.`,'stress_break');
 }else if(choiceId==='redemption_humble'){
  p.traits=p.traits.filter(t=>t!=='broken'&&t!=='proud');
  if(!p.traits.includes('humble'))p.traits.push('humble');
  if(!p.traits.includes('just'))p.traits.push('just');
  p.stress=cap((p.stress||150)-80,0,300);
  if(f)f.stability=cap((f.stability||50)+6,0,100);
  note(g,p,`${p.name} emerged from crisis Humble and Just, calming the realm.`,'stress_break');
 }else if(choiceId==='spiral_purge'){
  if(!p.traits.includes('paranoid'))p.traits.push('paranoid');
  if(!p.traits.includes('cruel'))p.traits.push('cruel');
  p.stress=cap((p.stress||150)-70,0,300);
  if(f)f.stability=cap((f.stability||50)-8,0,100);
  note(g,p,`${p.name} spiraled into dark suspicion, purging courtiers (Paranoid, Cruel).`,'stress_break');
 }else if(choiceId==='spiral_reckless'){
  if(!p.traits.includes('broken'))p.traits.push('broken');
  if(!p.traits.includes('drunkard'))p.traits.push('drunkard');
  p.stress=cap((p.stress||150)-65,0,300);
  if(f)f.prestige=Math.max(0,(f.prestige||0)-6);
  note(g,p,`${p.name} succumbed to despair and reckless excess (Broken, Drunkard).`,'stress_break');
 }else if(choiceId==='crisis_abdicate_duties'){
  if(!p.traits.includes('reclusive'))p.traits.push('reclusive');
  p.stress=cap((p.stress||150)-45,0,300);
  if(f)f.legitimacy=cap((f.legitimacy||50)-8,0,100);
  note(g,p,`${p.name} withdrew from public audiences during a royal crisis (Reclusive).`,'stress_break');
 }else{
  const drop=b.severity==='major'?65:45;
  if(choiceId==='drink'){
   if(!p.traits.includes('drunkard'))p.traits.push('drunkard');
   p.stress=cap((p.stress||100)-drop,0,300);
   note(g,p,`${p.name} turned to wine to dull the stress of rule (Drunkard).`,'stress_break');
  }else if(choiceId==='isolate'){
   if(!p.traits.includes('reclusive'))p.traits.push('reclusive');
   p.stress=cap((p.stress||100)-drop,0,300);
   note(g,p,`${p.name} withdrew into reclusive chambers to recover (Reclusive).`,'stress_break');
  }else if(choiceId==='confide'){
   if(f&&f.treasury>=60)f.treasury-=60;
   p.stress=cap((p.stress||100)-(drop+10),0,300);
   note(g,p,`${p.name} confided in loyal companions and eased the burden of rule.`,'stress_break');
  }else if(choiceId==='penance'){
   if(!p.traits.includes('flagellant'))p.traits.push('flagellant');
   p.stress=cap((p.stress||100)-drop,0,300);
   p.piety=num(p.piety)+12;
   note(g,p,`${p.name} sought harsh spiritual penance to master stress.`,'stress_break');
  }else{
   p.stress=cap((p.stress||100)-15,0,300);
   if(b.severity==='minor'&&!p.traits.includes('insomniac'))p.traits.push('insomniac');
   note(g,p,`${p.name} endured the strain in sleepless silence.`,'stress_break');
  }
 }
 if(p.civic)p.civic.stress=cap(Math.round(p.stress/3),0,100);
 delete g.agency.pendingStressBreak;
 return ok(`${p.name} weathered the mental break (Stress now ${p.stress}/300).`);
}
const ACTION_STRESS_RULES={
 execute:{kind:45,just:30,generous:20,cruel:-18},
 bribe:{just:30,honest:35,deceitful:-10},
 extort:{generous:35,just:28,greedy:-12},
 high_tax:{generous:32,kind:22,greedy:-10},
 retreat:{brave:35,proud:25,cautious:-10},
 forced_conversion:{cynical:25,kind:30,zealous:-15},
 tolerance:{zealous:32,cynical:-10},
 betray:{honest:40,just:35,deceitful:-12},
 declare_war:{content:30,cautious:22,brave:-10,ambitious:-12},
 forgive:{wrathful:28,cruel:25,kind:-12}
};
export function actAgainstNatureStress(g,personId,actionTag,customReason=''){
 const p=live(g,personId);if(!p?.alive)return {ok:false,delta:0};
 const table=ACTION_STRESS_RULES[actionTag];if(!table)return {ok:false,delta:0};
 let delta=0;const triggered=[];
 for(const t of p.traits||[]){
  if(table[t]){delta+=table[t];triggered.push(traitDefinition(t).name);}
 }
 if(!delta)return {ok:true,delta:0,stress:p.stress||0};
 const reason=customReason||`${actionTag.replace(/_/g,' ')} clashed with ${triggered.join(', ')}`;
 const res=addStress(g,personId,delta,reason);
 return {...res,delta,triggered};
}
const controlled=(g,p)=>humanControlsCharacter(g,p.id)||p.id===g.politics.realms[p.realm]?.ruler&&humanControlsRealm(g,p.realm);
const bonds=(g,p,q)=>{const b=record(g,p.id).bonds;return b[q.id]??={trust:0,grievance:0,last:-120};};
function bond(g,p,q,trust,grievance=0){const x=bonds(g,p,q);x.trust=cap(x.trust+trust,-100,100);x.grievance=cap(x.grievance+grievance,0,100);x.last=g.turn;}
function relation(g,p,q,amount){changeOpinion(g,p.id,q.id,amount);bond(g,p,q,amount,amount<0?-amount:0);bond(g,q,p,amount,amount<0?-amount:0);const r=g.chronicles?.relationships?.[pair(p.id,q.id)];if(r)r.last=g.turn;}
function goal(g,p,kind,target=null){const x=record(g,p.id);let q=x.goal;if(!q||q.kind!==kind||q.target!==target||q.status!=='active'){q=x.goal={kind,target,started:g.turn,progress:0,status:'active'};}return q;}
function complete(g,p,kind,target,amount=1,threshold=3){const x=record(g,p.id),q=goal(g,p,kind,target);q.progress+=amount;if(q.progress>=threshold){q.status='completed';q.ended=g.turn;x.goals[kind]=(x.goals[kind]||0)+1;if(x.goals[kind]<=3){x.influence=cap(x.influence+3,0,100);p.influence=x.influence;}p.prestige=num(p.prestige)+4;note(g,p,p.name+' achieved a personal ambition: '+kind+'.','goal',target);}}
const localEstate=(g,rows,p)=>rows.get(p.id)||[];
function loyalty(rows,p,delta){for(const [,h] of rows.get(p.id)||[])h.loyalty=cap(h.loyalty+delta,0,100);}
function canInteract(g,p,q){return q&&p.id!==q.id&&free(g,q)&&g.turn-(g.chronicles?.relationships?.[pair(p.id,q.id)]?.last??-120)>=6;}
function pickPeer(g,p,peers,hostile=false){return peers.filter(q=>canInteract(g,p,q)).sort((a,b)=>{const va=personalOpinion(g,p.id,a.id),vb=personalOpinion(g,p.id,b.id);return (hostile?va-vb:vb-va)||a.id.localeCompare(b.id);})[0];}
export function characterLifeView(g,id){const p=live(g,id),x=g.agency?.people?.[id];if(!p)return null;ensureCharacterSchema(g,p);const rel=Object.values(g.chronicles?.relationships||{}).filter(r=>r.a===id||r.b===id).map(r=>({...r,other:r.a===id?r.b:r.a})).filter(r=>live(g,r.other)?.alive).sort((a,b)=>Math.abs(b.opinion)-Math.abs(a.opinion)||a.other.localeCompare(b.other));return {agenda:x?.agenda||null,goal:x?.goal||null,completed:x?.goals||{},memories:x?.memories||[],relations:rel.slice(0,20).map(r=>({...r,trust:x?.bonds?.[r.other]?.trust||0,grievance:x?.bonds?.[r.other]?.grievance||0})),stress:num(p.civic?.stress),health:characterHealth(g,id),guardian:p.civic?.guardian||null,education:num(p.civic?.education),educationFocus:p.civic?.educationFocus||null,chosenGoal:personalGoalStatus(g,p),prestige:num(p.prestige),piety:num(p.piety),influence:characterInfluence(g,id),wealth:num(p.wealth),role:p.role||deriveSocialRole(g,p),personality:p.personality,friends:p.friends||[],rivals:p.rivals||[],lovers:p.lovers||[],mentors:p.mentors||[],wards:p.wards||[],grievances:p.grievances||[]};}
export function personalDilemmas(g,id){return Object.values(g.agency?.dilemmas||{}).filter(x=>x.status==='pending'&&x.recipient===id&&x.deadline>=g.turn&&live(g,x.actor)?.alive&&live(g,x.target)?.alive);}
function dilemma(g,p,q,kind){const root=initAgency(g),recipient=live(g,g.politics.realms[p.realm]?.ruler);if(!recipient?.alive||!free(g,recipient)||!controlled(g,recipient)||personalDilemmas(g,recipient.id).length>=3||Object.values(root.dilemmas).some(x=>x.status==='pending'&&x.actor===p.id))return false;const id='life'+root.next++;root.dilemmas[id]={id,recipient:recipient.id,realm:p.realm,actor:p.id,target:q.id,kind,started:g.turn,deadline:g.turn+9,status:'pending'};note(g,p,p.name+' asked '+recipient.name+' to settle a '+kind+'.','petition',q.id);g.log?.unshift({date:g.year+' · month '+(g.month+1),text:p.name+' requests a personal decision; inspect your character.'});if(g.log)g.log=g.log.slice(0,45);return true;}
export function resolvePersonalDilemma(g,id,choice){const x=initAgency(g).dilemmas[id],p=x&&live(g,x.actor),q=x&&live(g,x.target),r=x&&live(g,x.recipient);if(!x||x.status!=='pending'||x.deadline<g.turn||!free(g,r)||!controlled(g,r)||!free(g,p)||!free(g,q)||p.realm!==x.realm||q.realm!==x.realm||r.realm!==x.realm||r.id!==g.politics.realms[x.realm]?.ruler)return no('Personal decision is no longer available.');if(!['mediate','support','decline'].includes(choice))return no('Unknown decision.');if(choice==='mediate'){if(num(r.wealth)<40)return no('Requires 40 personal gold.');r.wealth-=40;p.wealth=num(p.wealth)+20;q.wealth=num(q.wealth)+20;relation(g,p,q,25);relation(g,r,p,10);relation(g,r,q,10);stress(p,-12);stress(q,-12);}else if(choice==='support'){if(num(r.wealth)<60)return no('Requires 60 personal gold.');r.wealth-=60;p.wealth=num(p.wealth)+60;relation(g,r,p,20);relation(g,r,q,-16);relation(g,p,q,-10);stress(q,10);}else{relation(g,r,p,-12);stress(p,8);}x.status=choice;x.ended=g.turn;note(g,p,r.name+' resolved the '+x.kind+': '+choice+'.','resolution',q.id);return ok('Personal decision resolved.');}
export function recordLifeEvent(g,p,kind,target,text){if(!p?.id)return;note(g,p,text,kind,target?.id||target||null);}
export function rememberBereavement(g,p,extraIds=[]){
 if(!p?.id||p._bereavedTurn===g.turn)return;
 p._bereavedTurn=g.turn;
 const parents=new Set(p.parents||[]);
 const siblings=parents.size?Object.values(g.politics?.people||{}).filter(x=>x?.alive&&x.id!==p.id&&(x.parents||[]).some(pid=>parents.has(pid))).map(x=>x.id):[];
 const family=new Set([p.spouse,...(p.spouses||[]),...(p.parents||[]),...(p.children||[]),...siblings,...(extraIds||[])].filter(Boolean));
 family.delete(p.id);
 for(const id of family){const q=live(g,id);if(!q?.alive)continue;stress(q,has(q,'reserved')?14:20);note(g,q,q.name+' mourned the death of '+p.name+'.','bereavement',p.id);}
}

const OPPOSITE_TRAITS={brave:'cautious',cautious:'brave',coward:'brave',ambitious:'content',content:'ambitious',just:'arbitrary',arbitrary:'just',zealous:'cynical',cynical:'zealous',diligent:'indolent',indolent:'diligent',generous:'greedy',greedy:'generous',gregarious:'reserved',reserved:'gregarious',honest:'deceitful',deceitful:'honest',patient:'wrathful',wrathful:'patient',cruel:'kind',kind:'cruel',paranoid:'trusting',trusting:'paranoid',lustful:'chaste',chaste:'lustful',gluttonous:'temperate',temperate:'gluttonous',proud:'humble',humble:'proud'};
export function evolveCharacterTraits(g,p,milestone=null){
 if(!p?.alive)return [];
 p.traits??=[];
 const added=[];
 const grant=(trait,force=false)=>{
  if(p.traits.includes(trait))return false;
  const opp=OPPOSITE_TRAITS[trait];
  if(opp&&p.traits.includes(opp))p.traits=p.traits.filter(t=>t!==opp);
  else if(!force&&p.traits.length>=6)return false;
  p.traits.push(trait);
  added.push(trait);
  p.memories??=[];p.memories.push(p.name+' developed the '+traitDefinition(trait).name+' trait in '+g.year+'.');
  return true;
 };
 if(milestone==='survived_battle'){
  if(p.traits.includes('coward')||p.traits.includes('cautious')){
   p.traits=p.traits.filter(t=>t!=='coward'&&t!=='cautious');
   grant('battle-hardened',true);
  }else if(!grant('battle-hardened'))grant('scarred',true);
 }
 else if(milestone==='betrayed'){
  p.traits=p.traits.filter(t=>t!=='trusting');
  grant('paranoid',true);
 }
 else if(milestone==='scholar_mentored'){if(!grant('diligent'))grant('cultured');}
 else if(milestone==='pilgrimage'){if(!grant('pillar-of-faith'))grant('devoted');}
 else if(milestone==='wounded'){grant('scarred',true);}
 else if(milestone==='victory'){if(!grant('brave'))if(!grant('battle-hardened'))grant('strategist');}
 else if(milestone==='schism')grant('zealous');
 else if(milestone==='petition')grant('just');
 else if(milestone==='vendetta'){if(!grant('wrathful'))grant('ambitious');}
 else if(milestone==='stewardship')grant('diligent');
 else{
  if((p.grievances||[]).some(gr=>gr.severity>=55))grant(hash(p.id+g.turn)%2===0?'wrathful':'ambitious');
  else if((p.civic?.stress||0)>=80||(p.stress||0)>=200)grant('cynical');
 }
 return added;
}

export function factionCandidates(g,realm){
 const s=g.politics?.realms?.[realm],headId=s?.ruler;
 const people=Object.values(g.politics?.people||{}).filter(p=>free(g,p)&&p.realm===realm&&p.id!==headId);
 const out=[];
 for(const p of people){
  const est=Object.entries(g.politics?.holdings||{}).filter(([,h])=>h.realm===realm&&h.lord===p.id);
  const severe=(p.grievances||[]).filter(gr=>gr.severity>=45&&gr.against===headId);
  const op=headId?personalOpinion(g,p.id,headId):0;
  if(!severe.length&&(op>-35||!est.length))continue;
  const minLoy=est.length?Math.min(...est.map(([,h])=>h.loyalty??50)):50;
  if(severe.length||minLoy<45){
   const score=(severe[0]?.severity||0)+(100-minLoy)*0.6+Math.max(0,-op)*0.5;
   out.push({person:p.id,name:p.name||p.id,holdings:est.map(([id])=>id),severeGrievance:severe[0]||null,minLoyalty:minLoy,opinion:op,score:Math.round(score),preferredKind:claimantCandidates(g,realm).length?'claimant':'liberty'});
  }
 }
 return out.sort((a,b)=>b.score-a.score||a.person.localeCompare(b.person));
}
function reactToImprisonment(g,p){
 const pris=g.feudal?.prisoners?.[p.id];
 if(!pris||pris.status!=='held'||controlled(g,p))return;
 if(hash(p.id)%6!==g.turn%6)return;
 stress(p,8);
 const captorRuler=live(g,g.politics?.realms?.[pris.captor]?.ruler);
 if(captorRuler?.alive){
  recordGrievance(g,p.id,captorRuler.id,'imprisonment',20);
  relation(g,p,captorRuler,-12);
 }
}
function advancePersonal(g,p,peers,rows,council,head){
 const x=record(g,p.id),estate=localEstate(g,rows,p),age=p.age,st=num(p.civic?.stress),health=num(g.living?.health?.[p.id]?.severity);
 if(st>=60&&num(p.wealth)>=30){p.wealth-=30;stress(p,-22);note(g,p,p.name+' withdrew from court to recover from stress.','recovery');return true;}
 if(health>=65)return false;
 const r=p.realm,headOpinion=head?.id===p.id?0:personalOpinion(g,p.id,head?.id);
 // Persistent grudges and severe grievances escalate from saving wealth and court solidarity to faction conspiracy.
 const severeGrievance=(p.grievances||[]).find(gr=>gr.severity>=45&&live(g,gr.against)?.alive&&live(g,gr.against)?.realm===r);
 if(severeGrievance){
  const targetEnemy=live(g,severeGrievance.against);
  evolveCharacterTraits(g,p,'vendetta');
  // Forge solidarity with other dissatisfied nobles across the court/realm.
  const allies=peers.filter(q=>q.id!==severeGrievance.against&&canInteract(g,p,q)&&((q.grievances||[]).some(gr=>gr.against===severeGrievance.against)||personalOpinion(g,q.id,severeGrievance.against)<=-15||localEstate(g,rows,q).some(([,h])=>h.loyalty<55)));
  const ally=allies[0];
  if(ally){
   relation(g,p,ally,18);
   if(!p.spouse&&!ally.spouse&&p.sex!==ally.sex&&p.age>=20&&ally.age>=20&&p.house!==ally.house&&hash(p.id+ally.id)%2===0){
    personalMarriage(g,p.id,ally.id);
   }
  }
  // If the crown itself is the target of a severe grievance, push or join a claimant/liberty faction!
  if(head&&severeGrievance.against===head.id&&estate.length){
   loyalty(rows,p,-14);
   const realmStab=num(g.factions?.[r]?.stability??60);
   if(realmStab<75||g.turn-(severeGrievance.turn??g.turn)>=3||severeGrievance.severity>=55){
    const existing=Object.values(g.conflict?.factions||{}).find(fx=>fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)&&['claimant','liberty','noble'].includes(fx.kind));
    if(existing){
     for(const [pid] of estate)joinFaction(g,existing.id,pid);
     existing.pressure=cap((existing.pressure||15)+15,0,100);
     existing.discontent=existing.pressure;
     note(g,p,p.name+' joined the '+existing.kind+' faction over '+severeGrievance.reason+'.','faction',head.id);
     return true;
    }
    let claimants=claimantCandidates(g,r);
    if(!claimants.length&&severeGrievance.severity>=55&&targetEnemy){
     const pretender=peers.find(q=>q.id!==head.id&&q.age>=18&&q.house===head.house&&!controlled(g,q))||p;
     if(pretender&&pretender.id!==head.id){
      addClaim(g,pretender.id,r,{titleId:'k:'+r,strength:'weak',from:head.id,heritable:false});
      claimants=claimantCandidates(g,r);
     }
    }
    const claimantId=claimants[0]?.person||null;
    const kind=claimantId?'claimant':'liberty';
    const members=[...estate.map(([pid])=>pid),...(ally?localEstate(g,rows,ally).map(([pid])=>pid):[])];
    const fx=createFaction(g,null,r,kind,members,{leader:p.id,claimant:claimantId,pressure:35});
    if(fx){
     note(g,p,p.name+' launched a '+kind+' faction against '+head.name+' ('+severeGrievance.reason+').','faction',head.id);
     return true;
    }
   }
  }
  // Save personal wealth rather than spending frivolously while nursing a vendetta; undermine when flush.
  if(num(p.wealth)>=90&&startPersonalScheme(g,p.id,severeGrievance.against,'undermine').ok){
   note(g,p,p.name+' plotted against '+targetEnemy.name+' over '+severeGrievance.reason+'.','grievance',severeGrievance.against);
   return true;
  }
  return false;
 }
 const deepGrievance=(p.grievances||[]).find(gr=>gr.severity>=30&&live(g,gr.against)?.alive&&live(g,gr.against)?.realm===r);
 if(deepGrievance&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,deepGrievance.against,'undermine').ok){
  note(g,p,p.name+' plotted against '+live(g,deepGrievance.against).name+' over '+deepGrievance.reason+'.','grievance',deepGrievance.against);
  return true;
 }
 if(head&&head.id!==p.id&&estate.length&&headOpinion<=-35&&(has(p,'ambitious')||(p.personality?.boldness||0)>=30)){
   const h=estate.find(([,v])=>v.autonomy<2);
   if(h&&requestVassalPetition(g,r,p.id,h[0],'autonomy').ok){complete(g,p,'secure autonomy',head.id,1,2);note(g,p,p.name+' pressed the crown for autonomy.','political',head.id);return true;}
   if(num(p.wealth)>=40){p.wealth-=40;loyalty(rows,p,-8);bond(g,p,head,-10,10);complete(g,p,'organize opposition',head.id,1,3);note(g,p,p.name+' organized estate opposition to '+head.name+'.','political',head.id);return true;}
 }
 // Ambitious adult claimants exploit child regencies or weak legitimacy by rallying disaffected lords.
 const hasClaim=claimantCandidates(g,r).some(cl=>cl.person===p.id);
 if(head&&head.id!==p.id&&hasClaim&&(head.age<18||num(g.factions?.[r]?.legitimacy)<55)&&(has(p,'ambitious')||(p.personality?.boldness||0)>=50)&&(personalOpinion(g,p.id,head.id)<15)){
  const allyLord=peers.find(q=>q.id!==head.id&&q.id!==p.id&&canInteract(g,p,q)&&localEstate(g,rows,q).some(([,v])=>v.loyalty<55));
  if(allyLord){
   relation(g,p,allyLord,15);
   const allyEst=localEstate(g,rows,allyLord).map(([pid])=>pid);
   const existingClaimFx=Object.values(g.conflict?.factions||{}).find(fx=>fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)&&fx.kind==='claimant');
   if(existingClaimFx){
    for(const pid of allyEst)joinFaction(g,existingClaimFx.id,pid);
    existingClaimFx.claimant=existingClaimFx.claimant||p.id;
    existingClaimFx.pressure=cap((existingClaimFx.pressure||15)+14,0,100);
    existingClaimFx.discontent=existingClaimFx.pressure;
   }else if(allyEst.length){
    createFaction(g,null,r,'claimant',allyEst,{leader:allyLord.id,claimant:p.id,pressure:40});
   }
   note(g,p,p.name+' rallied disaffected nobles around a claim to the throne of '+r+'.','claimant',head.id);
   return true;
  }
 }
 // Multi-turn autonomous conspiracy state machine for envious/ambitious rivals & claimants (runs before generic agendas).
 if(head&&head.id!==p.id&&(has(p,'ambitious')||has(p,'deceitful')||(p.personality?.boldness||0)>=45)&&(personalOpinion(g,p.id,head.id)<=-10||claimantCandidates(g,r).some(cl=>cl.person===p.id)||p.house===head.house)){
  const stage=x.conspiracy?.stage||'scouting';
  const hasClaimNow=claimantCandidates(g,r).some(cl=>cl.person===p.id);
  x.conspiracy??={stage:'scouting',started:g.turn,target:head.id,allies:[]};
  if(stage==='scouting'&&num(p.wealth)>=30){
   const disgruntled=peers.find(q=>q.id!==head.id&&q.id!==p.id&&canInteract(g,p,q)&&(personalOpinion(g,q.id,head.id)<15||localEstate(g,rows,q).some(([,v])=>v.loyalty<65)))||peers.find(q=>q.id!==head.id&&q.id!==p.id&&canInteract(g,p,q));
   if(disgruntled){p.wealth-=20;disgruntled.wealth=num(disgruntled.wealth)+20;relation(g,p,disgruntled,16);if(!x.conspiracy.allies.includes(disgruntled.id))x.conspiracy.allies.push(disgruntled.id);x.conspiracy.stage='recruiting';note(g,p,p.name+' sounded out '+disgruntled.name+' for a court conspiracy.','conspiracy',disgruntled.id);return true;}
  }else if(stage==='recruiting'){
   const factionMembers=[...estate.map(([pid])=>pid),...x.conspiracy.allies.flatMap(aid=>localEstate(g,rows,live(g,aid)).map(([pid])=>pid))];
   const kind=hasClaimNow?'claimant':'liberty';
   const fx=Object.values(g.conflict?.factions||{}).find(f=>f.realm===r&&ACTIVE_FACTION_STATUSES.includes(f.status)&&f.kind===kind)||createFaction(g,null,r,kind,factionMembers,{leader:p.id,claimant:hasClaimNow?p.id:null,pressure:32});
   if(fx){for(const pid of factionMembers)joinFaction(g,fx.id,pid);fx.pressure=cap((fx.pressure||20)+15,0,100);fx.discontent=fx.pressure;}
   x.conspiracy.stage='foreign_pact';
   note(g,p,p.name+' organized conspirators into a '+kind+' cabal.','faction',head.id);
   return true;
  }else if(stage==='foreign_pact'){
   const hostileForeign=Object.entries(g.factions[r]?.relations||{}).filter(([fid,rel])=>fid!==r&&fid!=='independent'&&rel<0&&g.factions[fid]).sort((a,b)=>a[1]-b[1])[0]?.[0];
   if(hostileForeign){
    x.conspiracy.foreignBacker=hostileForeign;
    p.prestige=num(p.prestige)+6;
    for(const fx of Object.values(g.conflict?.factions||{}))if(fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)){fx.pressure=cap((fx.pressure||20)+16,0,100);fx.discontent=fx.pressure;}
    x.conspiracy.stage='striking';
    note(g,p,p.name+' secured secret backing from '+g.factions[hostileForeign].name+'.','conspiracy',head.id);
    return true;
   }
   x.conspiracy.stage='striking';
  }else if(stage==='striking'&&(head.age<18||num(g.factions?.[r]?.stability)<65||Object.values(g.conflict?.wars||{}).some(w=>w.status==='active'&&[w.attacker,w.defender].includes(r)))){
   for(const fx of Object.values(g.conflict?.factions||{}))if(fx.realm===r&&ACTIVE_FACTION_STATUSES.includes(fx.status)){fx.pressure=cap((fx.pressure||20)+22,0,100);fx.discontent=fx.pressure;}
   x.conspiracy.stage='recruiting';
   note(g,p,p.name+' escalated faction demands during crown weakness.','conspiracy',head.id);
   return true;
  }
 }
 if(x.agenda==='accumulate wealth'){
   const q=goal(g,p,'accumulate wealth');q.baseline??=num(p.wealth);q.progress=Math.max(0,num(p.wealth)-q.baseline);if(q.progress>=100)complete(g,p,'accumulate wealth',null,0,100);return false;
 }
 if(x.agenda==='develop ability'&&num(p.wealth)>=60){const skill=Object.keys(p.skills||{}).sort((a,b)=>num(p.skills[a])-num(p.skills[b])||a.localeCompare(b))[0];if(skill&&p.skills[skill]<5){p.wealth-=60;p.skills[skill]++;p.prestige=num(p.prestige)+2;complete(g,p,'develop ability',skill,1,2);note(g,p,p.name+' invested in '+skill+' training.','training');return true;}}
 // Educate children / take wards when unguarded royal/noble youths need mentorship.
 if((p.skills?.learning||0)>=3||(p.skills?.martial||0)>=3){
  const child=(p.children||[]).map(id=>live(g,id)).find(c=>c?.alive&&c.realm===r&&c.age>=6&&c.age<18&&c.civic&&!c.civic.guardian);
  if(child){child.civic.guardian=p.id;note(g,p,p.name+' took responsibility for educating '+child.name+'.','education',child.id);return true;}
 }
 // Adults form their own households without commandeering royal diplomatic marriages.
 if(!p.spouse&&age>=20&&age<=45&&num(p.wealth)>=90&&p.id!==head?.id&&p.house!==head?.house&&hash(p.id+':marry:'+g.turn)%3===0){
   const partner=peers.filter(q=>!controlled(g,q)&&q.id!==head?.id&&q.house!==head?.house&&q.sex!==p.sex&&!q.spouse&&q.age>=20&&q.age<=50&&Math.abs(q.age-age)<=18&&personalOpinion(g,p.id,q.id)>=0).sort((a,b)=>personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||a.id.localeCompare(b.id)).find(q=>personalMarriage(g,p.id,q.id).ok);
   if(partner){relation(g,p,partner,20);p.prestige=num(p.prestige)+4;complete(g,p,'secure household',partner.id,1,1);return true;}
 }
 // Landed estate owners periodically reinvest personal wealth into estate prosperity.
 if(estate.length&&num(p.wealth)>=150&&hash(p.id+':estate:'+g.turn)%4===0){
   const [,h]=estate[0];p.wealth-=60;h.wealth=num(h.wealth)+45;p.prestige=num(p.prestige)+3;h.loyalty=cap(h.loyalty+2,0,100);
   note(g,p,p.name+' invested personal gold in estate improvements.','estate');return true;
 }
 const hostile=x.agenda==='undermine rival';const target=pickPeer(g,p,peers,hostile);
 if(!target)return false;const opinion=personalOpinion(g,p.id,target.id);
 if(hostile){
   if(opinion<=-45&&dilemma(g,p,target,'rivalry'))return true;
   if(opinion<=-35&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,target.id,localEstate(g,rows,target).length?'undermine':'discredit').ok){complete(g,p,'undermine rival',target.id,1,3);note(g,p,p.name+' began a personal scheme against '+target.name+'.','scheme',target.id);return true;}
   if(opinion>-90){relation(g,p,target,-16);loyalty(rows,target,-2);stress(target,5);complete(g,p,'undermine rival',target.id);note(g,p,p.name+' openly opposed '+target.name+'.','rivalry',target.id);return true;}
 }
 if(x.agenda==='seek influence'&&head&&head.id!==p.id&&estate.length&&!council.has(p.id)&&requestVassalPetition(g,r,p.id,estate[0][0],'council').ok){complete(g,p,'seek council office',head.id,1,2);return true;}
 if(x.agenda==='seek influence'&&head&&head.id!==p.id&&!council.has(p.id)&&g.royalCourt?.realms?.[r]&&!humanControlsRealm(g,r)){
  const rc=g.royalCourt.realms[r],f=g.factions[r],busy=new Set(Object.values(rc.offices||{}).map(o=>o.person));
  if(!busy.has(p.id)&&f?.treasury>=160){
   const role=['treasurer','quartermaster','envoy','archivist','intelligence','physician'].find(k=>!rc.offices?.[k]&&g.turn-(rc.last?.[k]??-120)>=6);
   if(role){rc.offices[role]={person:p.id,appointed:g.turn,paidUntil:g.turn+3};rc.last[role]=g.turn;f.treasury-=55;p.wealth=num(p.wealth)+15;p.prestige=num(p.prestige)+4;complete(g,p,'seek court office',head.id,1,1);note(g,p,p.name+' secured appointment as '+role+'.','office');return true;}
  }
 }
 if(head&&head.id!==p.id&&g.feudal?.claimants?.[r+':'+p.id]&&(p.personality?.boldness||0)>=10&&num(p.wealth)>=70&&startPersonalScheme(g,p.id,head.id,'undermine').ok){
  complete(g,p,'press claim',head.id,1,2);note(g,p,p.name+' pressed a dynastic claim at court.','claim',head.id);return true;
 }
 // Autonomous court mediation & alliances for living non-player characters
 if(p.role==='councillor'||has(p,'just')||has(p,'gregarious')){
  const feud=peers.find(q=>q.id!==p.id&&!controlled(g,q)&&personalOpinion(g,p.id,q.id)>=10&&peers.some(z=>z.id!==q.id&&z.id!==p.id&&personalOpinion(g,q.id,z.id)<=-35));
  if(feud&&num(p.wealth)>=30&&hash(p.id+':mediate:'+g.turn)%4===0){
   const rival=peers.find(z=>z.id!==feud.id&&z.id!==p.id&&personalOpinion(g,feud.id,z.id)<=-35);
   if(rival){p.wealth-=30;relation(g,feud,rival,18);p.prestige=num(p.prestige)+4;note(g,p,p.name+' mediated a simmering court quarrel between '+feud.name+' and '+rival.name+'.','reconciliation',feud.id);return true;}
  }
 }
 if(num(p.wealth)>=45&&opinion>=25&&!(x.bonds[target.id]?.kind==='alliance')&&hash(p.id+':ally:'+g.turn)%4===0){
  p.wealth-=25;bond(g,p,target,'alliance');relation(g,p,target,12);p.prestige=num(p.prestige)+3;note(g,p,p.name+' formed a household compact with '+target.name+'.','alliance',target.id);return true;
 }
 // Romantic attraction for high-sociability compatible peers
 if(opinion>=35&&target.sex!==p.sex&&!(p.lovers||[]).includes(target.id)&&(p.personality?.sociability||0)>=15&&hash(p.id+target.id+g.turn)%5===0){
   addRomance(g,p.id,target.id);return true;
 }
 if(opinion<0&&has(p,'just')&&num(p.wealth)>=25){p.wealth-=25;target.wealth=num(target.wealth)+25;relation(g,p,target,20);stress(p,-5);stress(target,-5);note(g,p,p.name+' reconciled with '+target.name+'.','reconciliation',target.id);return true;}
 if(num(p.wealth)>=35&&opinion<75){transfer(g,p,target,35,p);relation(g,p,target,15);x.influence=cap(x.influence+3,0,100);p.influence=x.influence;complete(g,p,x.agenda,target.id);if(opinion<50&&personalOpinion(g,p.id,target.id)>=50)note(g,p,p.name+' became friends with '+target.name+'.','friendship',target.id);else note(g,p,p.name+' cultivated ties with '+target.name+'.','patronage',target.id);if(head?.id===target.id)loyalty(rows,p,5);return true;}
 return false;
}
export function tickAgency(g){const root=initAgency(g);if(root.lastTick===g.turn)return;root.lastTick=g.turn;
 const groups=new Map(),rows=new Map(),land=new Set(Object.values(g.provinces||{}).map(p=>p.owner)),{landedSet,commanderSet}=roleSets(g);
 for(const p of Object.values(g.politics.people)){if(!p.alive)continue;ensureCharacterSchema(g,p,landedSet,commanderSet);const x=record(g,p.id);x.agenda=motive(p);if(!free(g,p)){reactToImprisonment(g,p);continue;}if(!groups.has(p.realm))groups.set(p.realm,[]);groups.get(p.realm).push(p);}
 for(const [id,h] of Object.entries(g.politics.holdings)){if(g.provinces[id]?.owner!==h.realm)continue;if(!rows.has(h.lord))rows.set(h.lord,[]);rows.get(h.lord).push([id,h]);}
 for(const [r,people] of groups){const s=g.politics.realms[r];if(!s||!land.has(r))continue;const head=live(g,s.ruler),council=new Set(Object.values(s.council||{}));people.sort((a,b)=>a.id.localeCompare(b.id));
 for(const p of people){const x=record(g,p.id),estate=localEstate(g,rows,p);if(g.turn%12===0&&x.lastIncome!==g.turn){for(const [,h] of estate){const draw=Math.min(25,Math.floor(Math.max(0,num(h.wealth))*.12));h.wealth-=draw;p.wealth=num(p.wealth)+draw;}x.lastIncome=g.turn;const standing=(council.has(p.id)?3:0)+(estate.length?2:0)+(p.id===s.ruler?2:0);x.influence=cap(x.influence+standing-(standing?0:2),0,100);p.influence=x.influence;p.prestige=num(p.prestige)+(council.has(p.id)?2:0)+(estate.length?2:0)+(p.id===s.ruler?4:0);p.piety=num(p.piety)+(p.role==='clergy'?3:p.traits?.includes('zealous')?2:0);}
 reviewChosenGoal(g,p);if(g.turn%12===0)evolveCharacterTraits(g,p);if(g.turn%3===0&&p.id!==head?.id){const pressure=(num(g.factions[r]?.stability)<40?3:0)+(estate.some(([,h])=>h.loyalty<35)?3:0)+(num(g.living?.health?.[p.id]?.severity)>=50?3:0);stress(p,pressure||-2);}
 }
 // Staggered monthly modulo cohorts without artificial 6-character realm bottleneck.
 const ready=people.filter(p=>!controlled(g,p)&&g.turn-record(g,p.id).lastAction>=6&&hash(p.id)%6===g.turn%6).sort((a,b)=>record(g,a.id).lastAction-record(g,b.id).lastAction||a.id.localeCompare(b.id));
 for(const p of ready){const x=record(g,p.id);x.lastAction=g.turn;advancePersonal(g,p,people.filter(q=>q.id!==p.id),rows,council,head);}
 }
 syncCharacterRelationships(g);
 for(const [id,x] of Object.entries(root.dilemmas)){if(x.status==='pending'&&(x.deadline<g.turn||![x.actor,x.target,x.recipient].every(i=>live(g,i)?.alive))){x.status='lapsed';x.ended=g.turn;const p=live(g,x.actor),q=live(g,x.recipient);if(p?.alive&&q?.alive){relation(g,p,q,-8);stress(p,6);note(g,p,'An unanswered personal petition lapsed.','resolution',q.id);}}else if(x.ended!==undefined&&g.turn-x.ended>60)delete root.dilemmas[id];}
 for(const [id,x] of Object.entries(root.people)){if(!live(g,id)?.alive){delete root.people[id];continue;}if(g.turn%12===0){for(const [other,b] of Object.entries(x.bonds))if(!live(g,other)?.alive||g.turn-b.last>120)delete x.bonds[other];}}
}

export const PERSONAL_GOALS={wealth:'Build a personal fortune',friend:'Make a close friend',training:'Master a skill',resilience:'Overcome stress'};
export function personalGoalStatus(g,p){const q=g.agency?.people?.[p.id]?.chosenGoal;if(!q)return null;let progress=0;if(q.kind==='wealth')progress=Math.max(0,num(p.wealth)-q.baseline);else if(q.kind==='friend')progress=live(g,q.target)?.alive?Math.max(0,personalOpinion(g,p.id,q.target)):0;else if(q.kind==='training')progress=num(p.skills?.[q.skill])-q.baseline;else if(q.kind==='resilience')progress=Math.max(0,q.baseline-num(p.civic?.stress));return {...q,label:PERSONAL_GOALS[q.kind],progress:q.status==='completed'?q.required:Math.max(0,Math.min(q.required,progress))};}
export function playerLifeAction(g,actorId,action,target){const p=live(g,actorId);if(!free(g,p)||!controlled(g,p))return no('Only your living free adult character may act.');const x=record(g,p.id),q=live(g,target);
 if(action==='goal'){if(!Object.hasOwn(PERSONAL_GOALS,target)||x.chosenGoal?.status==='active'||x.goals['player:'+target])return no('Choose a new, uncompleted personal goal.');const base={kind:target,status:'active',started:g.turn};if(target==='wealth')Object.assign(base,{baseline:num(p.wealth),required:100});else if(target==='friend'){const peer=Object.values(g.politics.people).filter(q=>free(g,q)&&q.realm===p.realm&&q.id!==p.id&&personalOpinion(g,p.id,q.id)<50).sort((a,b)=>personalOpinion(g,p.id,b.id)-personalOpinion(g,p.id,a.id)||a.id.localeCompare(b.id))[0];if(!peer)return no('No available new friend.');Object.assign(base,{target:peer.id,required:50});}else if(target==='training'){const skill=Object.keys(p.skills||{}).filter(k=>p.skills[k]<5).sort((a,b)=>p.skills[a]-p.skills[b]||a.localeCompare(b))[0];if(!skill)return no('All skills are mastered.');Object.assign(base,{skill,baseline:p.skills[skill],required:1});}else{if(num(p.civic?.stress)<25)return no('Requires at least 25 stress.');Object.assign(base,{baseline:p.civic.stress,required:25});}x.chosenGoal=base;note(g,p,p.name+' chose '+PERSONAL_GOALS[target]+'.','goal');return ok('Personal goal selected.');}
 if(action==='abandon'){if(x.chosenGoal?.status!=='active')return no('No active personal goal.');x.chosenGoal.status='abandoned';return ok('Personal goal abandoned.');}
 if(g.turn-(x.lastPlayerAction??-120)<6)return no('Personal actions require six months between uses.');
 if(action==='train'){if(!Object.hasOwn(p.skills||{},target)||p.skills[target]>=5||p.wealth<60)return no('Choose an unmastered skill and have 60 personal gold.');p.wealth-=60;p.skills[target]++;note(g,p,p.name+' trained in '+target+'.','training');}
 else if(action==='rest'){if(p.wealth<30||num(p.civic?.stress)<10)return no('Requires 30 personal gold and at least 10 stress.');p.wealth-=30;stress(p,-25);note(g,p,p.name+' rested and recovered.','recovery');}
 else if(action==='befriend'||action==='reconcile'){if(!canInteract(g,p,q)||q.realm!==p.realm||p.wealth<35)return no('Requires a free adult local character, 35 personal gold and available contact.');transfer(g,p,q,35,p);relation(g,p,q,action==='reconcile'?25:18);stress(p,-3);note(g,p,p.name+' renewed ties with '+q.name+'.','friendship',q.id);}
 else return no('Unknown personal action.');x.lastPlayerAction=g.turn;return ok('Personal action completed.');}
function reviewChosenGoal(g,p){const x=record(g,p.id),q=personalGoalStatus(g,p);if(!q||q.status!=='active')return;if(q.kind==='friend'&&!live(g,q.target)?.alive){x.chosenGoal.status='failed';return;}if(q.progress>=q.required){x.chosenGoal.status='completed';x.chosenGoal.ended=g.turn;x.goals['player:'+q.kind]=1;x.influence=cap(x.influence+8,0,100);stress(p,-8);note(g,p,p.name+' fulfilled '+q.label+'.','goal',q.target||null);}}
export function personalPoliticalSupport(g,person,liege){const a=g.agency?.people?.[person]?.bonds?.[liege];return a?cap((num(a.trust)-num(a.grievance))*.08,-8,8):0;}

// Health, traits, and stress modify performed work, never the underlying trained skill.
export function effectiveCharacterSkill(g,p,skill){
 if(!p?.alive)return 1;
 const base=cap(num(p.skills?.[skill])||1,1,10);
 const tMod=traitModifiers(p)[skill]||0;
 const severity=num(g.living?.health?.[p.id]?.severity);
 const stressValue=num(p.civic?.stress);
 return Math.max(1,base+tMod-Math.floor(severity/35)-(stressValue>=85?1:0));
}

export const DEATH_CAUSES = Object.freeze({
 old_age: 'Died of old age', battle: 'Fell in battle', assassinated: 'Assassinated',
 plague: 'Died of plague', executed: 'Executed by decree', stress_collapse: 'Collapsed from severe stress',
 illness: 'Died of grave illness'
});
export function deathCauseLabel(reason, actorName = null) {
 if (!reason) return 'Died';
 if (reason === 'executed' && actorName) return 'Executed by ' + actorName;
 return DEATH_CAUSES[reason] || String(reason).replaceAll('_', ' ');
}
export const traitModifiersForPerson = traitModifiers;
export function grantTrait(g, p, traitId) {
 if (!p || !traitId) return false;
 p.traits ??= [];
 if (p.traits.includes(traitId)) return false;
 const opp = TRAIT_CATALOG[traitId]?.opposite;
 if (opp) p.traits = p.traits.filter(t => t !== opp);
 p.traits.push(traitId);
 return true;
}
export const triggerMentalBreak = (g, p, tier = 'minor') => addStress(g, p?.id || p, tier === 'crisis' ? 160 : tier === 'major' ? 105 : 80, tier + ' break');
export const resolveStressCrisis = (g, personId, mode = 'redemption') => resolveStressBreak(g, mode === 'spiral' ? 'crisis_lash_out' : 'crisis_seek_redemption');

const GENE_EYES = ['Hazel', 'Amber', 'Chestnut', 'Slate Blue', 'Deep Brown', 'Storm Grey'];
const GENE_HAIR = ['Dark Chestnut', 'Raven Black', 'Burnished Auburn', 'Golden Ash', 'Copper', 'Silvered Onyx'];
const GENE_FEATURES = ['Aquiline Nose', 'High Cheekbones', 'Square Jaw', 'Arching Brows', 'Deep-Set Gaze', 'Noble Chin'];

export function geneticAppearance(person, people = {}) {
 if (!person) return null;
 const parentObjs = (person.parents || []).map(pid => people?.[pid]).filter(Boolean);
 const p0 = parentObjs[0], p1 = parentObjs[1] || p0;
 const pick = (arr, src, offset) => arr[(hash((src?.dna || src?.id || src?.name || 'seed') + ':' + offset)) % arr.length];
 const eyes = p0 ? pick(GENE_EYES, (hash(person.id) % 2 === 0 ? p0 : p1), 'eyes') : pick(GENE_EYES, person, 'eyes');
 const hair = p1 ? pick(GENE_HAIR, (hash(person.name || person.id) % 2 === 0 ? p1 : p0), 'hair') : pick(GENE_HAIR, person, 'hair');
 const feature = pick(GENE_FEATURES, p0 || person, 'feat');
 const age = Number.isFinite(person.age) ? person.age : 25;
 const stage = age < 18 ? 'Youth' : age < 45 ? 'Prime' : age < 65 ? 'Mature' : 'Elder';
 return {
  eyes,
  hair: age >= 60 ? 'Silvered ' + hair : hair,
  feature,
  resembles: p0 ? p0.name : null,
  stage
 };
}
