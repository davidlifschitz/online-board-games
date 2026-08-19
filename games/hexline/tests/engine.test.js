const assert=require('node:assert/strict'),E=require('../engine.js');let s=E.createGame({size:3,swap:true});assert.equal(E.neighbors(s,E.idx(s,1,1)).length,6);s=E.apply(s,{type:'place',at:E.idx(s,1,1)});assert.ok(E.legalActions(s).some(a=>a.type==='swap'));s=E.apply(s,{type:'swap'});assert.deepEqual(s.colorOfPlayer,[1,0]);assert.equal(s.current,0);
let w=E.createGame({size:3,swap:false});for(const at of[0,3,1,4,2])w=E.apply(w,{type:'place',at});assert.equal(w.over,true);assert.equal(w.winner,0,'color 0 connects left-right');
let v=E.createGame({size:3,swap:false});v.board[0]=v.board[1]=0;v.current=0;const a=E.botAction(v,'medium',()=>.5);assert.ok(a&&a.type==='place');assert.equal(a.at,2,'bot sees immediate left-right win');
console.log('hexline engine tests passed');
