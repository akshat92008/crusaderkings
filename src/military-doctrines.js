/**
 * Crown of Nations original army doctrines. These are gameplay archetypes
 * inspired by broad medieval military practices, not a historically validated
 * order of battle for each named country in 1450.
 *
 * The existing strategic army fields (infantry, archers, cavalry) remain the
 * authoritative troop quantities, so old saves and battle results still work.
 */
export const DOCTRINES={
  longbow:{name:'Longbow Companies',unique:'Yeoman Longbowmen',style:'missile',mix:[.30,.57,.13],accuracy:1.37,defense:.84,charge:.82,speed:1,formations:['longbow_line','shield_wall','skirmish']},
  chivalry:{name:'Chivalric Host',unique:'Armored Lancers',style:'shock',mix:[.33,.16,.51],accuracy:.9,defense:1.08,charge:1.40,speed:1.12,formations:['cavalry_wedge','shield_wall','flank']},
  pike:{name:'Pike and Crossbow Companies',unique:'Pikemen',style:'defensive',mix:[.63,.31,.06],accuracy:1.05,defense:1.32,charge:.79,speed:.84,formations:['pike_square','shield_wall','longbow_line']},
  gunpowder:{name:'Firearms and Pavises',unique:'Handgunners',style:'fire',mix:[.43,.46,.11],accuracy:1.31,defense:1.02,charge:.89,speed:.9,formations:['volley_line','shield_wall','skirmish']},
  steppe:{name:'Mounted Steppe Host',unique:'Horse Archers',style:'mobility',mix:[.15,.25,.60],accuracy:1.09,defense:.86,charge:1.22,speed:1.27,formations:['encirclement','skirmish','cavalry_wedge']},
  janissary:{name:'Household Infantry',unique:'Janissary Guard',style:'disciplined',mix:[.56,.28,.16],accuracy:1.17,defense:1.17,charge:1.04,speed:1.0,formations:['volley_line','shield_wall','flank']},
  elephant:{name:'Elephant and Infantry Host',unique:'War Elephants',style:'shock',mix:[.55,.22,.23],accuracy:.95,defense:1.18,charge:1.33,speed:.87,formations:['elephant_push','shield_wall','flank']},
  samurai:{name:'Retainer Warbands',unique:'Mounted Retainers',style:'skirmish',mix:[.53,.26,.21],accuracy:1.12,defense:1.15,charge:1.13,speed:1.07,formations:['skirmish','shield_wall','flank']},
  archery:{name:'Archery Companies',unique:'Elite Bowmen',style:'missile',mix:[.39,.48,.13],accuracy:1.31,defense:1.01,charge:.91,speed:1.06,formations:['longbow_line','skirmish','shield_wall']},
  river:{name:'Riverland Infantry',unique:'River Scouts',style:'mobility',mix:[.52,.35,.13],accuracy:1.11,defense:1.0,charge:.92,speed:1.15,formations:['skirmish','shield_wall','flank']},
  highland:{name:'Highland Warriors',unique:'Mountain Guard',style:'defensive',mix:[.71,.22,.07],accuracy:1.01,defense:1.28,charge:1.01,speed:.98,formations:['shield_wall','pike_square','flank']},
  woodland:{name:'Woodland Warbands',unique:'Forest Skirmishers',style:'ambush',mix:[.38,.54,.08],accuracy:1.18,defense:.93,charge:1.0,speed:1.20,formations:['skirmish','ambush','shield_wall']},
  maritime:{name:'Maritime Militia',unique:'Harbor Crossbowmen',style:'economic',mix:[.48,.40,.12],accuracy:1.16,defense:1.04,charge:.88,speed:1.05,formations:['volley_line','shield_wall','skirmish']},
  warrior:{name:'Warrior Orders',unique:'Veteran Warriors',style:'shock',mix:[.77,.19,.04],accuracy:.93,defense:1.12,charge:1.23,speed:1.1,formations:['flank','shield_wall','ambush']},
  generic:{name:'Provincial Levies',unique:'Household Guard',style:'balanced',mix:[.59,.29,.12],accuracy:1,defense:1,charge:1,speed:1,formations:['shield_wall','skirmish','flank']}
};
const specific={
 england:'longbow',france:'chivalry',castile:'chivalry',burgundy:'chivalry',poland:'chivalry',
 imperial:'pike',
};
Object.assign(specific,{
 ottomans:'janissary',mamluks:'chivalry',timurids:'steppe',qara:'steppe',horde:'steppe',
 ming:'gunpowder',joseon:'archery',ashikaga:'samurai',vijayanagara:'elephant',ayutthaya:'elephant',
 ethiopia:'highland',inca:'highland',pueblo:'highland',maori:'highland',
 mexica:'warrior',maya:'archery',muisca:'highland',mapuche:'warrior',tupi:'woodland',
 haudenosaunee:'woodland',aboriginal:'woodland',dai_viet:'river',bengal:'river',
 kilwa:'maritime',majapahit:'maritime',malacca:'maritime',portugal:'maritime',
 aragon:'maritime',novgorod:'maritime',gujarat:'maritime',fiji:'maritime',
 mali:'river',songhai:'river',kongo:'warrior',bahmani:'chivalry',delhi:'pike',
 morocco:'chivalry',muscovy:'pike',tunis:'maritime'
});
export const FORMATIONS={
 shield_wall:{name:'Shield Wall',damage:.93,defense:1.30,speed:.84,range:1},
 pike_square:{name:'Pike Square',damage:.85,defense:1.55,speed:.70,range:1,vsCavalry:1.55},
 cavalry_wedge:{name:'Cavalry Wedge',damage:1.42,defense:.78,speed:1.18,range:1},
 skirmish:{name:'Skirmish Screen',damage:.95,defense:.94,speed:1.22,range:1.13},
 volley_line:{name:'Volley Line',damage:1.18,defense:.8,speed:.86,range:1.20},
 longbow_line:{name:'Longbow Line',damage:1.24,defense:.72,speed:.79,range:1.35},
 encirclement:{name:'Encirclement',damage:1.18,defense:.89,speed:1.25,range:1},
 elephant_push:{name:'Elephant Push',damage:1.38,defense:1.09,speed:.80,range:1},
 flank:{name:'Flanking Column',damage:1.18,defense:.82,speed:1.14,range:1},
 ambush:{name:'Ambush Formation',damage:1.21,defense:.78,speed:1.14,range:1}
};
const clip=(v,a,b)=>Math.max(a,Math.min(b,v));
export function militaryDoctrine(faction){
 const id=typeof faction==='string'?faction:faction?.id||'';
 const key=specific[id]||(faction?.specialty==='gunpowder'?'gunpowder':faction?.continent==='Oceania'?'woodland':'generic');
 return {id:key,...DOCTRINES[key]};
}
export function startingTroops(faction,total){
 const d=militaryDoctrine(faction),[i,a,c]=d.mix;const size=Math.max(0,Math.round(total));
 const infantry=Math.round(size*i),archers=Math.round(size*a),cavalry=size-infantry-archers;
 return {infantry,archers,cavalry};
}
export function armyFormationSlots(faction,army,slots=6){
 const d=militaryDoctrine(faction),values=['infantry','archers','cavalry'];
 let count={infantry:0,archers:0,cavalry:0};
 const ratio=Math.max(1,(army?.infantry||0)+(army?.archers||0)+(army?.cavalry||0));
 for(let n=0;n<slots;n++){
  // Greedy proportional allocation avoids every kingdom getting the same 4/1/1 lineup.
  const type=values.map(t=>({t,score:(army?.[t]||0)/ratio*(n+1)-count[t]})).sort((a,b)=>b.score-a.score)[0].t;
  count[type]++;
 }
 return values.flatMap(t=>Array.from({length:count[t]},()=>t)).sort((x,y)=>values.indexOf(x)-values.indexOf(y));
}
export function combatStatistics(faction,type,formationId){
 const d=militaryDoctrine(faction),formation=FORMATIONS[formationId]||FORMATIONS.shield_wall;
 return {
  damage:formation.damage*(type==='archers'?d.accuracy:d.charge),
  defense:formation.defense*d.defense,
  speed:formation.speed*d.speed,
  range:formation.range*(type==='archers'?d.accuracy:1),
  cavalryCounter:formation.vsCavalry||1
 };
}
export function chooseCounterFormation(faction,enemyType,ownType){
 const d=militaryDoctrine(faction);
 const prefer=enemyType==='cavalry'?'pike_square':ownType==='archers'?'volley_line':ownType==='cavalry'?'cavalry_wedge':'shield_wall';
 return d.formations.includes(prefer)?prefer:d.formations[0];
}
export function availableFormations(faction){return militaryDoctrine(faction).formations.map(id=>({id,...FORMATIONS[id]}));}
