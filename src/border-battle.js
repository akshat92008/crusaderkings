// Strategic resolution uses force strength instead of deleting all defeated armies.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function borderBattleOutcome(attack,defense,roll=.5){attack=Math.max(0,attack);defense=Math.max(0,defense);const ratio=attack/Math.max(1,defense),adjusted=ratio*(.85+clamp(roll,0,1)*.30),victory=attack>0&&adjusted>=1;return {victory,attackerLoss:clamp(victory?.10/Math.max(1,ratio):.25+.12/Math.max(.25,ratio),.01,.70),defenderLoss:clamp(victory?.24+.10*Math.min(4,ratio):.10*Math.min(1,ratio),.01,.75)};}
export function proportionalLoss(army,fraction){for(const t of ['infantry','archers','cavalry'])army[t]=Math.max(0,Math.round((army[t]||0)*(1-clamp(fraction,0,1))));return army;}
