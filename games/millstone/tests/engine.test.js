const assert=require('node:assert/strict'),E=require('../engine.js');
let s=E.createGame({drawByRepetition:false});assert.equal(E.legalActions(s).length,24);s=E.apply(s,{type:'place',to:0});s=E.apply(s,{type:'place',to:3});s=E.apply(s,{type:'place',to:1});s=E.apply(s,{type:'place',to:4});s=E.apply(s,{type:'place',to:2});assert.equal(s.pendingRemoval,true);assert.deepEqual(E.removalTargets(s).sort((a,b)=>a-b),[3,4]);s=E.apply(s,{type:'remove',at:3});assert.equal(s.board[3],-1);assert.equal(s.current,1);
let m=E.createGame({drawByRepetition:false});m.board.fill(-1);m.reserves=[0,0];m.board[0]=m.board[1]=m.board[3]=0;m.board[9]=m.board[10]=m.board[11]=1;m.current=0;assert.equal(E.phase(m,0),'flying');assert.ok(E.legalActions(m).some(a=>a.type==='move'&&a.from===0&&a.to===23));
m.fly=false;assert.equal(E.phase(m,0),'moving');assert.ok(!E.legalActions(m).some(a=>a.from===0&&a.to===23));
let r=E.createGame({drawByRepetition:false});r.board.fill(-1);r.reserves=[0,0];r.board[0]=r.board[1]=r.board[2]=0;r.board[3]=r.board[4]=r.board[5]=1;r.board[6]=1;r.current=0;r.pendingRemoval=true;assert.deepEqual(E.removalTargets(r),[6],'cannot remove from mill while outside piece exists');
assert.ok(E.botAction(E.createGame(),'medium'));assert.ok(E.botAction(E.createGame(),'hard'));
console.log('millstone engine tests passed');
