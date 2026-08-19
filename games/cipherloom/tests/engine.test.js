const assert=require('node:assert/strict');const E=require('../engine.js');
assert.deepEqual(E.feedback([0,0,1,2],[0,1,0,3]),{exact:1,partial:2},'duplicate feedback is aggregate and non-overcounting');
assert.deepEqual(E.feedback([0,1,2,3],[3,2,1,0]),{exact:0,partial:4});
assert.equal(E.allCodes(4,6,true).length,1296);assert.equal(E.allCodes(4,6,false).length,360);
const candidates=E.allCodes(3,4,true);const filtered=E.filterCandidates(candidates,[0,0,0],{exact:1,partial:0});assert.ok(filtered.every(c=>E.feedback(c,[0,0,0]).exact===1));
const a=E.makeSecret({length:4,symbolCount:6,seed:123}),b=E.makeSecret({length:4,symbolCount:6,seed:123});assert.deepEqual(a,b,'seeded secrets deterministic');
let g=E.createGame({secret:[1,2,3,4],length:4,symbolCount:6});g=E.submit(g,[1,2,3,4]).state;assert.equal(g.won,true);assert.equal(g.over,true);
const solution=E.solve([0,1,2,3],{symbolCount:4,allowDuplicates:true,maxTurns:10});assert.equal(solution.at(-1).feedback.exact,4,'solver reaches the secret');assert.ok(solution.length<=10);
console.log('cipherloom engine tests passed');
