// Legacy single-army threats and coordinated groups reserve all committed forces.
export function invasionReserved(g,id){return Boolean(g.kingdom?.threats?.some(t=>t.army===id||t.armies?.includes(id)));}
