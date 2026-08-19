const assert=require('assert'),E=require('../engine.js');let s=E.createGame({seed:1,target:500});assert.equal(s.hands.every(h=>h.length===13),true);for(let p=0;p<4;p++)s=E.bid(s,p,p===0?0:3);assert.equal(s.phase,'playing');
// follow suit
s.current=0;s.trick=[{player:3,card:0}];s.hands[0]=[1,13,39];assert.deepEqual(E.legalCards(s,0),[1]);
// spades cannot lead before broken if nonspade exists
s.trick=[];s.hands[0]=[1,39];s.spadesBroken=false;assert.deepEqual(E.legalCards(s,0),[1]);
// spade trumps
assert.equal(E.trickWinner([{player:0,card:12},{player:1,card:13},{player:2,card:39},{player:3,card:11}]),2);
// scoring contract, bag, nil
let x={teamScores:[0,0],bags:[0,0],bids:[0,3,4,3],tricks:[0,3,5,5],target:500,nilValue:100,roundOver:false,phase:'playing',over:false};x=E.scoreRound(x);assert.equal(x.teamScores[0],141);assert.equal(x.bags[0],1);assert.equal(x.teamScores[1],62);assert.equal(x.bags[1],2);
// failed contract penalty
x={teamScores:[0,0],bags:[0,0],bids:[4,3,4,3],tricks:[3,3,4,3],target:500,nilValue:100,roundOver:false,phase:'playing',over:false};x=E.scoreRound(x);assert.equal(x.teamScores[0],-80);assert.equal(x.teamScores[1],60);
let pv=E.playerView(E.createGame({seed:99}),0);assert(!('hands' in pv));assert(Array.isArray(pv.hand));
console.log('spades engine tests passed');