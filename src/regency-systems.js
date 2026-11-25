// Regency council: supports minority, incapacity, imprisonment, and entrenched regencies.
const cap=(n,a,b)=>Math.max(a,Math.min(b,n)),num=n=>Number.isFinite(n)?n:0;
const person=(g,id)=>g.politics?.people?.[id];
const eligible=(g,r,id)=>{
 const p=person(g,id);
 return p?.alive&&p.age>=18&&p.realm===r&&id!==g.politics.realms[r]?.ruler&&!p.incapacitated&&g.feudal?.prisoners?.[id]?.status!=='held';
};
const opinion=(g,a,b)=>num(g.chronicles?.relationships?.[[a,b].sort().join('|')]?.opinion);
const ok=msg=>({ok:true,msg}),no=msg=>({ok:false,msg});

export function initRegencies(g){return g.regencies??={version:1,realms:{},history:[]};}

function note(g,r,text){
 const root=initRegencies(g);
 root.history.unshift({realm:r,turn:g.turn,text});
 root.history=root.history.slice(0,120);
 if(r===g.player&&Array.isArray(g.log)){
  g.log.unshift({date:g.year+' · month '+(g.month+1),text});
  g.log=g.log.slice(0,45);
 }
}

export function needsRegency(g,r,head=person(g,g.politics?.realms?.[r]?.ruler)){
 if(!head?.alive)return null;
 if(head.age<18)return 'minority';
 if(head.incapacitated||g.living?.health?.[head.id]?.severity>=75||g.living?.health?.[head.id]?.condition==='incapable')return 'incapacitated';
 if(g.feudal?.prisoners?.[head.id]?.status==='held')return 'imprisoned';
 return null;
}

export function regentCandidates(g,r){
 const s=g.politics?.realms?.[r];
 if(!s)return [];
 const head=person(g,s.ruler),council=new Set(Object.values(s.council||{})),family=new Set([head?.spouse,...(head?.parents||[]),...(head?.children||[])]);
 return [...new Set([...council,...family])].filter(id=>eligible(g,r,id)).map(id=>{
  const p=person(g,id);
  return {id,score:num(p.skills?.stewardship)*3+num(p.skills?.diplomacy)*2+opinion(g,head.id,id)*.25+(family.has(id)?5:0)+(p.traits?.includes('content')?8:0)-(p.traits?.includes('ambitious')?6:0)};
 }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

function buildRegencyCouncil(g,r,regentId){
 const s=g.politics?.realms?.[r];
 if(!s)return [];
 const members=[regentId];
 for(const id of Object.values(s.council||{})){
  if(members.length>=3)break;
  if(id&&!members.includes(id)&&eligible(g,r,id))members.push(id);
 }
 return members;
}

export function regencyView(g,r){
 const s=g.politics?.realms?.[r],x=g.regencies?.realms?.[r];
 if(!x||!s||x.sovereign!==s.ruler||!eligible(g,r,x.regent))return null;
 return x;
}

export function reconcileRegency(g,r){
 const s=g.politics?.realms?.[r],head=person(g,s?.ruler);
 if(!s||!head?.alive)return null;
 const root=initRegencies(g),reason=needsRegency(g,r,head);
 let x=regencyView(g,r);
 if(!x){
  const previous=s.regent;
  delete root.realms[r];s.regent=null;
  if(!reason)return null;
  const regent=eligible(g,r,previous)?previous:regentCandidates(g,r)[0]?.id;
  if(!regent)return null;
  x=root.realms[r]={
   sovereign:head.id,regent,reason,
   council:buildRegencyCouncil(g,r,regent),
   influence:25,started:g.turn,lastTick:g.turn,lastAction:-120
  };
  s.regent=regent;
  note(g,r,person(g,regent).name+' assumes the '+reason+' regency.');
 }else{
  x.reason=reason||(x.influence>=45?'entrenched':null);
  x.council=buildRegencyCouncil(g,r,x.regent);
 }
 if(!reason&&x.influence<45){
  delete root.realms[r];s.regent=null;
  note(g,r,'The regent relinquished authority to '+head.name+'.');
  return null;
 }
 s.regent=x.regent;
 return x;
}

export function regencyPermission(g,r,proposal){
 const x=regencyView(g,r);
 if(!x||!['law','war','revoke'].includes(proposal))return true;
 const mandatory=x.reason==='incapacitated'||x.reason==='imprisoned';
 if(!mandatory&&x.influence<65)return true;
 const head=person(g,x.sovereign);
 const council=(x.council?.length?x.council:[x.regent]).filter(id=>eligible(g,r,id));
 let yes=0,total=0;
 for(const id of council){
  const p=person(g,id),weight=id===x.regent?2:1;
  const loyalty=opinion(g,p.id,head.id);
  const score=loyalty+(p.traits?.includes('content')?25:0)-(p.traits?.includes('ambitious')?25:0)-(proposal==='war'&&p.traits?.includes('cautious')?30:0);
  if(score>=0)yes+=weight;
  total+=weight;
 }
 return total===0||yes>=total/2;
}

export function regencyAction(g,r,action,id){
 const x=reconcileRegency(g,r),f=g.factions[r],head=person(g,x?.sovereign),regent=person(g,x?.regent);
 if(!x||!f)return no('No active regency.');
 if(g.turn-x.lastAction<6)return no('Regency negotiations are limited to once every six months.');
 if(action==='regency-concession'){
  if(f.treasury<100)return no('Requires 100 gold for a negotiated settlement.');
  f.treasury-=100;regent.wealth=num(regent.wealth)+100;x.influence=cap(x.influence-15,0,100);
 }else if(action==='regency-assert'){
  if(needsRegency(g,r,head)||f.prestige<20||f.legitimacy<50)return no('Requires a free capable adult sovereign, 20 prestige and 50 legitimacy.');
  f.prestige-=20;f.legitimacy=cap(f.legitimacy-5,0,100);x.influence=cap(x.influence-25,0,100);
 }else if(action==='regency-replace'){
  if(x.influence>=65||id===x.regent||!regentCandidates(g,r).some(c=>c.id===id)||f.treasury<120)return no('Replacing a regent requires a suitable candidate, less than 65 influence and 120 gold.');
  f.treasury-=120;x.regent=id;x.influence=25;g.politics.realms[r].regent=id;
  x.council=buildRegencyCouncil(g,r,id);
 }else return no('Unknown regency action.');
 x.lastAction=g.turn;note(g,r,'Regency settlement: '+action.slice(8)+'.');reconcileRegency(g,r);
 return ok('Regency authority updated.');
}

export function tickRegency(g,r){
 const x=reconcileRegency(g,r);
 if(!x||g.turn-x.lastTick<3)return;
 const p=person(g,x.regent),head=person(g,x.sovereign),f=g.factions[r];
 x.lastTick=g.turn;
 const ambitious=p.traits?.includes('ambitious'),loyal=opinion(g,p.id,head.id);
 const activeNeed=Boolean(needsRegency(g,r,head));
 const delta=(ambitious?7:2)+(p.traits?.includes('content')?-4:0)+(loyal<-25?3:loyal>35?-3:0)+(!activeNeed?-3:0);
 x.influence=cap(x.influence+delta,0,100);
 if(x.influence>=65&&g.turn%12===0){
  const amount=Math.min(40,Math.max(0,f.treasury));
  f.treasury-=amount;p.wealth=num(p.wealth)+amount;f.legitimacy=cap(f.legitimacy-2,0,100);
 }
 if(r!==g.player&&!activeNeed){
  if(f.prestige>=20&&f.legitimacy>=50)regencyAction(g,r,'regency-assert');
  else if(f.treasury>=200)regencyAction(g,r,'regency-concession');
 }
 reconcileRegency(g,r);
}
