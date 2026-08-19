const assert=require('assert'),E=require('../engine.js');let s=E.createGame({seed:7,target:100});assert.equal(s.hands.every(h=>h.length===13),true);assert.equal(s.passDir,'left');
for(let p=0;p<4;p++)s=E.passCards(s,p,s.hands[p].slice(0,3));assert.equal(s.phase,'playing');assert.equal(s.hands.every(h=>h.length===13),true);assert.equal(s.hands[s.current].includes(E.TWO_CLUBS),true);assert.deepEqual(E.legalCards(s,s.current),[E.TWO_CLUBS]);
// Follow suit enforced.
s.phase='playing';s.current=0;s.trick=[{player:3,card:0}];s.hands[0]=[1,13,26];assert.deepEqual(E.legalCards(s,0),[1]);
// First trick penalty restriction when void in lead.
s.taken=[[],[],[],[]];s.trick=[{player:1,card:0}];s.current=0;s.hands[0]=[13,E.QS,26];assert.deepEqual(E.legalCards(s,0),[13]);
// Hearts lead restriction before broken unless only hearts.
s.trick=[];s.taken=[[0,1,2,3],[],[],[]];s.current=0;s.heartsBroken=false;s.hands[0]=[13,26,27];assert.deepEqual(E.legalCards(s,0),[13]);s.hands[0]=[26,27];assert.equal(E.legalCards(s,0).length,2);
// Trick winner.
assert.equal(E.trickWinner([{player:0,card:0},{player:1,card:12},{player:2,card:13},{player:3,card:5}]),1);
// Moon scoring via full-round scorer path.
s={...s,taken:[Array.from({length:13},(_,i)=>26+i).concat([E.QS]),[],[],[]],scores:[0,0,0,0],target:100,roundPoints:[0,0,0,0],hands:[[],[],[],[]],trick:[],roundOver:false,over:false,history:[]}; // synthetic over-count hearts but scoreTaken 26
// direct verify scoreTaken canonical 13 hearts + QS
assert.equal(E.scoreTaken(Array.from({length:13},(_,i)=>26+i).concat([E.QS])),26);
// moon variants and tie-at-target continue
let moon=E.createGame({seed:2,target:100,moonMode:'subtract'});moon.taken=[Array.from({length:13},(_,i)=>26+i).concat([E.QS]),[],[],[]];moon.scores=[0,0,0,0];moon=E.finishRound(moon);assert.deepEqual(moon.roundPoints,[-26,0,0,0]);let tie=E.createGame({seed:3,target:100});tie.taken=[[],[],[],[]];tie.scores=[100,100,50,50];tie=E.finishRound(tie);assert.equal(tie.over,false);
let pv=E.playerView(E.createGame({seed:99}),0);assert(!('hands' in pv));assert(Array.isArray(pv.hand));
console.log('hearts engine tests passed');