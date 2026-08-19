const assert=require('node:assert/strict');const E=require('../engine.js');
let s=E.createGame({rows:1,cols:1,players:2});
assert.equal(E.legalEdges(s).length,4);
for(const e of [{t:'h',r:0,c:0},{t:'v',r:0,c:0},{t:'h',r:1,c:0}])s=E.playEdge(s,e).state;
assert.equal(s.scores[0]+s.scores[1],0);
const before=s.current;let r=E.playEdge(s,{t:'v',r:0,c:1});s=r.state;
assert.equal(r.completed,1);assert.equal(r.extraTurn,true);assert.equal(s.current,before);assert.equal(s.over,true);assert.equal(s.scores[before],1);

s=E.createGame({rows:1,cols:2,players:2});
// Make the middle vertical edge the final side of both boxes.
for(const e of [{t:'h',r:0,c:0},{t:'h',r:1,c:0},{t:'v',r:0,c:0},{t:'h',r:0,c:1},{t:'h',r:1,c:1},{t:'v',r:0,c:2}])s=E.playEdge(s,e).state;
r=E.playEdge(s,{t:'v',r:0,c:1});assert.equal(r.completed,2,'one edge can complete two boxes');

s=E.createGame({rows:2,cols:2,players:2});const easy=E.botMove(s,'easy',()=>0);assert.deepEqual(easy,E.legalEdges(s)[0]);assert.ok(E.botMove(s,'medium'));assert.ok(E.botMove(s,'hard'));
console.log('boxline engine tests passed');
