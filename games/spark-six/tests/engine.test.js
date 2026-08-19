const assert=require('node:assert/strict');const E=require('../engine.js');
const s=d=>E.scoreSelection(d);
assert.deepEqual(s([1]).score,100);assert.equal(s([5]).score,50);assert.equal(s([1,1,1]).score,1000);assert.equal(s([6,6,6]).score,600);assert.equal(s([2,2]).valid,false);assert.equal(s([1,2]).valid,false,'selected non-scoring dice make selection invalid');
assert.equal(s([1,2,3,4,5,6]).score,1500);assert.equal(s([1,1,2,2,6,6]).score,1500);assert.equal(s([4,4,4,4]).score,800);assert.equal(s([5,5,5,5,5]).score,1500);assert.equal(s([1,1,1,1,1,1]).score,4000);
assert.equal(E.isBust([2,3,4,6,2,3]),true);assert.equal(E.isBust([2,3,4,6,2,5]),false);
const best=E.bestSelection([1,5,2,2,2,6]);assert.equal(best.score,350);assert.ok(best.indices.length>=5);
assert.ok(E.bustProbability(6)>0&&E.bustProbability(6)<1);
let m=E.createMatch({players:3,target:1000});m=E.endTurn(m,1000);assert.equal(m.finalTrigger,0);assert.equal(m.finalRemaining,2);assert.equal(m.over,false);m=E.endTurn(m,400);assert.equal(m.finalRemaining,1);m=E.endTurn(m,1200);assert.equal(m.over,true);assert.equal(m.winner,2);
console.log('spark-six engine tests passed');
