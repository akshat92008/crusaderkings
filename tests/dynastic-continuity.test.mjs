import test from 'node:test';
import assert from 'node:assert/strict';
import {partitionRepresentatives,hereditaryLine} from '../src/succession-systems.js';
import {reconcileMarriageTreaties} from '../src/dynastic-ties.js';
const person=(id,realm,age,children=[])=>({id,realm,house:'House',age,children,alive:true});
test('partition preserves a local grandchild through a foreign elder parent',()=>{
 const people={head:person('head','a',70,['elder','younger']),elder:person('elder','b',40,['grandchild']),grandchild:person('grandchild','a',20),younger:person('younger','a',30)};
 const g={politics:{people}};
 assert.deepEqual(hereditaryLine(g,people.head).map(x=>x.id),['grandchild','younger']);
 assert.deepEqual(partitionRepresentatives(g,people.head).map(x=>x.id),['grandchild','younger']);
 people.grandchild.crownExclusion='a';
 assert.deepEqual(partitionRepresentatives(g,people.head).map(x=>x.id),['younger']);
});
test('partition skips excluded parents but respects eligible descendants of the senior branch',()=>{
 const people={head:person('head','a',70,['elder','younger']),elder:person('elder','a',40,['grandchild']),grandchild:person('grandchild','a',20),younger:person('younger','a',30)};
 people.elder.crownExclusion='a';
 const g={politics:{people}};
 assert.deepEqual(partitionRepresentatives(g,people.head).map(x=>x.id),['grandchild','younger']);
});
test('marriage treaty survives reciprocal living ties but expires when both spouses no longer belong to its courts',()=>{
 const a=person('x','a',30),b=person('y','b',30);a.spouse=b.id;b.spouse=a.id;
 const g={politics:{people:{x:a,y:b},marriages:[{a:a.id,b:b.id}]},factions:{a:{treaties:{b:'marriage',c:'alliance'}},b:{treaties:{a:'marriage'}},c:{treaties:{a:'alliance'}}}};
 reconcileMarriageTreaties(g);assert.equal(g.factions.a.treaties.b,'marriage');
 b.realm='c';reconcileMarriageTreaties(g);
 assert.equal(g.factions.a.treaties.b,undefined);assert.equal(g.factions.b.treaties.a,undefined);
 assert.equal(g.factions.a.treaties.c,'alliance');
 assert.equal(g.factions.c.treaties.a,'alliance');
});
test('another living marriage maintains an existing bilateral tie after one spouse dies',()=>{
 const p=person('p','a',30),q=person('q','b',30),x=person('x','a',30),y=person('y','b',30);
 p.spouse='q';q.spouse='p';x.spouse='y';y.spouse='x';p.alive=false;
 const g={politics:{people:{p,q,x,y}},factions:{a:{treaties:{b:'marriage'}},b:{treaties:{a:'marriage'}}}};
 reconcileMarriageTreaties(g);assert.equal(g.factions.a.treaties.b,'marriage');
 y.spouse=null;reconcileMarriageTreaties(g);assert.equal(g.factions.a.treaties.b,undefined);
});
