// Strategic resolution uses force strength instead of deleting all defeated armies.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function borderBattleOutcome(attack,defense,roll=.5){attack=Math.max(0,attack);defense=Math.max(0,defense);const ratio=attack/Math.max(1,defense),adjusted=ratio*(.85+clamp(roll,0,1)*.30),victory=attack>0&&adjusted>=1;return {victory,attackerLoss:clamp(victory?.10/Math.max(1,ratio):.25+.12/Math.max(.25,ratio),.01,.70),defenderLoss:clamp(victory?.24+.10*Math.min(4,ratio):.10*Math.min(1,ratio),.01,.75)};}
export function proportionalLoss(army,fraction){for(const t of ['infantry','archers','cavalry'])army[t]=Math.max(0,Math.round((army[t]||0)*(1-clamp(fraction,0,1))));return army;}

// One estimate for both sides in strategic planning and automatic battles.
// Readiness already includes supply, fatigue and commander skill; morale and
// experience are bounded so that quality cannot erase overwhelming numbers.
export function campaignArmyPower(army,readiness={}){
 const troops=['infantry','archers','cavalry'].reduce((n,t)=>n+Math.max(0,Number.isFinite(army?.[t])?army[t]:0),0);
 const power=clamp(Number.isFinite(readiness.power)?readiness.power:1,0,3);
 const morale=clamp(Number.isFinite(readiness.morale)?readiness.morale:Number.isFinite(army?.morale)?army.morale:75,0,100);
 const experience=clamp(Number.isFinite(army?.experience)?army.experience:0,0,1);
 return troops*power*(.7+.4*morale/100)*(1+.2*experience);
}
export function campaignGarrison(province){return 45+Math.max(0,province?.development||0)*12+Math.max(0,province?.buildings?.fort||0)*45;}
// Invasion results use player-centric field result names even when the AI attacks.
export function automaticDefense(offense,defense){
 const outcome=borderBattleOutcome(offense,defense*1.13,.5);
 return {victory:!outcome.victory,attackerRemaining:1-outcome.defenderLoss,enemyRemaining:1-outcome.attackerLoss,fieldBattle:true};
}
