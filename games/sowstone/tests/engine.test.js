const assert=require('node:assert/strict');const E=require('../engine.js');
let s=E.createGame({stones:4});assert.deepEqual(E.legalMoves(s),[0,1,2,3,4,5]);
let r=E.play(s,2);assert.equal(r.state.board[2],0);assert.equal(r.state.board[3],5);assert.equal(r.state.board[6],1);assert.equal(r.extraTurn,true,'landing in own store grants extra turn');
// Store skip: player 1 sowing a large pit must skip store 13.
s=E.createGame({stones:1});s.board=[0,0,0,0,0,9,0, 1,1,1,1,1,1,0];s.current=0;r=E.play(s,5);assert.equal(r.state.board[13],0,'opponent store is skipped');
// Capture.
s=E.createGame({stones:1});s.board=[0,1,0,0,0,0,0, 0,0,0,4,0,0,0];s.current=0;r=E.play(s,1);assert.equal(r.captured,5);assert.equal(r.state.board[6],5);assert.equal(r.state.board[2],0);assert.equal(r.state.board[10],0);
// End sweep.
s={board:[0,0,0,0,0,1,20, 2,0,0,0,0,0,18],current:0,stones:4,over:false,winner:null,moves:0,last:null};r=E.play(s,5);assert.equal(r.state.over,true);assert.equal(r.state.board[13],20);assert.equal(r.state.board[6],21);assert.equal(r.state.winner,0);
assert.ok(E.botMove(E.createGame(),'medium')!=null);assert.ok(E.botMove(E.createGame(),'hard')!=null);
console.log('sowstone engine tests passed');
