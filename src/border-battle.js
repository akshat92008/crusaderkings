// Strategic resolution uses force strength instead of deleting all defeated armies.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const TROOP_TYPES=['infantry','archers','cavalry'];

export const TERRAIN_MODIFIERS={
 plains:{id:'plains',defense:1.00,attack:1.00,cavalry:1.10,archers:1.00,supply:1.05,winterAttrition:1.00},
 forest:{id:'forest',defense:1.15,attack:0.96,cavalry:0.85,archers:0.90,supply:0.92,winterAttrition:1.15},
 highlands:{id:'highlands',defense:1.26,attack:0.92,cavalry:0.80,archers:1.05,supply:0.84,winterAttrition:1.40},
 mountains:{id:'mountains',defense:1.32,attack:0.88,cavalry:0.72,archers:1.05,supply:0.78,winterAttrition:1.55},
 hills:{id:'hills',defense:1.18,attack:0.95,cavalry:0.88,archers:1.04,supply:0.90,winterAttrition:1.25},
 desert:{id:'desert',defense:1.02,attack:0.98,cavalry:1.06,archers:1.00,supply:0.75,winterAttrition:0.80},
 marsh:{id:'marsh',defense:1.20,attack:0.92,cavalry:0.70,archers:0.92,supply:0.82,winterAttrition:1.20}
};

export function terrainCombatModifiers(terrain='plains'){
 return TERRAIN_MODIFIERS[terrain]||TERRAIN_MODIFIERS.plains;
}

export function armyTerrainFactor(army,terrain='plains',isDefender=false){
 const mod=terrainCombatModifiers(terrain);
 const total=TROOP_TYPES.reduce((n,t)=>n+Math.max(0,army?.[t]||0),0);
 if(total<=0)return isDefender?mod.defense:mod.attack;
 const cavShare=(army?.cavalry||0)/total;
 const archShare=(army?.archers||0)/total;
 const unitFit=1+cavShare*(mod.cavalry-1)+archShare*(mod.archers-1);
 const roleMod=isDefender?mod.defense:mod.attack;
 return clamp(roleMod*unitFit,0.75,1.40);
}

export function borderBattleOutcome(attack,defense,roll=.5){
 attack=Math.max(0,attack);
 defense=Math.max(0,defense);
 const ratio=attack/Math.max(1,defense);
 const adjusted=ratio*(1+(clamp(roll,0,1)-.5)*1.46);
 const victory=attack>0&&adjusted>=1;
 return {
  victory,
  attackerLoss:clamp(victory?.10/Math.max(1,ratio):.25+.12/Math.max(.25,ratio),.01,.70),
  defenderLoss:clamp(victory?.24+.10*Math.min(4,ratio):.10*Math.min(1,ratio),.01,.75)
 };
}

export function proportionalLoss(army,fraction){
 for(const t of TROOP_TYPES)army[t]=Math.max(0,Math.round((army[t]||0)*(1-clamp(fraction,0,1))));
 return army;
}

// One estimate for both sides in strategic planning and automatic battles.
// Readiness already includes supply, fatigue and commander skill; morale and
// experience are bounded so that quality cannot erase overwhelming numbers.
export function campaignArmyPower(army,readiness={}){
 const troops=TROOP_TYPES.reduce((n,t)=>n+Math.max(0,Number.isFinite(army?.[t])?army[t]:0),0);
 const power=clamp(Number.isFinite(readiness.power)?readiness.power:1,0,3);
 const morale=clamp(Number.isFinite(readiness.morale)?readiness.morale:Number.isFinite(army?.morale)?army.morale:75,0,100);
 const experience=clamp(Number.isFinite(army?.experience)?army.experience:0,0,1);
 return troops*power*(.7+.4*morale/100)*(1+.2*experience);
}

export function campaignGarrison(province){
 return 45+Math.max(0,province?.development||0)*12+Math.max(0,province?.buildings?.fort||0)*45;
}

// Invasion results use player-centric field result names even when the AI attacks.
export function automaticDefense(offense,defense){
 const outcome=borderBattleOutcome(offense,defense*1.13,.5);
 return {victory:!outcome.victory,attackerRemaining:1-outcome.defenderLoss,enemyRemaining:1-outcome.attackerLoss,fieldBattle:true};
}

export function resolveCampaignBattle({
 attackers=[],defenders=[],province=null,terrain=null,
 attackerPower=null,defenderPower=null,
 attackerReadiness=[],defenderReadiness=[],
 garrison=0,roll=.5
}={}){
 const terr=terrain||province?.terrain||'plains';
 const mod=terrainCombatModifiers(terr);
 const attList=Array.isArray(attackers)?attackers:[attackers].filter(Boolean);
 const defList=Array.isArray(defenders)?defenders:[defenders].filter(Boolean);
 const attPow=Number.isFinite(attackerPower)
  ?Math.max(0,attackerPower)
  :attList.reduce((sum,a,i)=>sum+campaignArmyPower(a,attackerReadiness[i]||{})*armyTerrainFactor(a,terr,false),0);
 const garr=garrison==='auto'?campaignGarrison(province)*mod.defense:Math.max(0,Number.isFinite(garrison)?garrison:0);
 const defPow=Number.isFinite(defenderPower)
  ?Math.max(0,defenderPower)+garr
  :defList.reduce((sum,a,i)=>sum+campaignArmyPower(a,defenderReadiness[i]||{})*armyTerrainFactor(a,terr,true),0)+garr;
 const outcome=borderBattleOutcome(attPow,defPow,roll);
 return {
  ...outcome,
  attackPower:attPow,
  defensePower:defPow,
  ratio:attPow/Math.max(1,defPow),
  terrain:terr
 };
}
