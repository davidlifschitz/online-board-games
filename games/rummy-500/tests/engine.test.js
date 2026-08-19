const assert=require('assert'),E=require('../engine.js'),c=(s,r)=>s*13+(r-1);
assert.equal(E.validateMeld([c(0,5),c(1,5),c(2,5)]).type,'set');assert.equal(E.validateMeld([c(0,3),c(0,4),c(0,5)]).type,'run');assert.equal(E.validateMeld([c(0,12),c(0,13),c(0,1)]).type,'run');assert.equal(E.validateMeld([c(0,3),c(0,5),c(0,6)]),null);
let s=E.createGame({players:3,seed:2,target:500});assert.equal(s.hands.every(h=>h.length===7),true);let two=E.createGame({players:2,seed:3});assert.equal(two.hands[0].length,13);assert.equal(two.hands[1].length,13);s=E.drawStock(s);assert.equal(s.phase,'action');const disc=s.hands[0][0];s=E.discardCard(s,disc);assert.equal(s.current,1);
// top discard may be taken but not immediately discarded back
let t=E.createGame({players:2,seed:12});const top=t.discard.at(-1);t=E.drawDiscardFrom(t,t.discard.length-1);assert.equal(t.cannotDiscardCard,top);assert.throws(()=>E.discardCard(t,top));
// buried discard pickup creates must-meld obligation
s.phase='draw';s.current=0;s.discard=[c(0,2),c(0,3),c(0,4)];s.hands[0]=[c(1,2),c(2,2),c(3,7)];s=E.drawDiscardFrom(s,0);assert.equal(s.mustMeldCard,c(0,2));assert.throws(()=>E.discardCard(s,c(3,7)));
s=E.meld(s,[c(0,2),c(1,2),c(2,2)]);assert.equal(s.mustMeldCard,null);
// layoff validates resulting meld
s={...s,phase:'action',roundOver:false,current:0,hands:[[c(0,6)],[],[]],melds:[{owner:1,type:'run',cards:[c(0,3),c(0,4),c(0,5)]}],mustMeldCard:null,roundMeldPoints:[0,0,0]};s=E.layoff(s,c(0,6),0);assert.equal(s.roundOver,true);
let pv=E.playerView(E.createGame({seed:99}),0);assert(!('hands' in pv));assert(Array.isArray(pv.hand));
console.log('rummy-500 engine tests passed');