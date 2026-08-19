const assert=require('assert'),E=require('../engine.js');
// overlapping run/set chooses partition minimizing deadwood
const c=(s,r)=>s*13+(r-1);let hand=[c(0,3),c(0,4),c(0,5),c(1,5),c(2,5),c(3,5),c(1,9)];let o=E.optimalMelds(hand);assert.equal(o.deadwoodValue,9);assert.equal(o.melds.length>=2,true);
let s=E.createGame({seed:1,target:100});assert.equal(s.hands[0].length,10);s=E.drawStock(s);assert.equal(s.hands[0].length,11);const d=E.bestDiscard(s.hands[0],null).card;s=E.discardCard(s,d,false);assert.equal(s.current,1);assert.equal(s.hands[0].length,10);
// cannot immediately discard the same face-up card drawn
s.phase='draw';s.current=0;const top=s.discard.at(-1);s=E.drawDiscard(s);assert.throws(()=>E.discardCard(s,top,false));
// gin scoring
s.hands=[[c(0,1),c(0,2),c(0,3),c(1,7),c(2,7),c(3,7),c(1,9),c(1,10),c(1,11),c(1,12)],[c(0,13),c(1,13),c(2,2),c(3,4),c(3,6),c(2,8),c(2,10),c(2,12),c(3,1),c(3,2)]];s.scores=[0,0];let r=E.scoreKnock(s,0);assert.equal(r.type,'gin');assert.equal(s.scores[0]>25,true);
// undercut: knocker 10 deadwood, opponent lower after layoffs
s.hands=[[c(0,1),c(0,2),c(0,3),c(1,5),c(2,5),c(3,5),c(1,7),c(1,8),c(1,9),c(2,10)],[c(2,1),c(2,2),c(2,3),c(3,6),c(3,7),c(3,8),c(0,11),c(1,11),c(2,11),c(0,1)]];s.scores=[0,0];r=E.scoreKnock(s,0);assert.equal(['undercut','knock','gin'].includes(r.type),true);
// standard stock exhaustion ends hand without score
let z=E.createGame({seed:4});z.stock=z.stock.slice(0,3);z=E.drawStock(z);const zd=E.bestDiscard(z.hands[0],null).card;z=E.discardCard(z,zd,false);assert.equal(z.phase,'round-over');assert.equal(z.roundResult.type,'stock-draw');
// explicit undercut and layoff behavior
const k=[c(0,2),c(1,2),c(2,2),c(0,4),c(0,5),c(0,6),c(2,7),c(2,8),c(2,9),c(0,10)],opp=[c(0,3),c(1,3),c(2,3),c(1,4),c(1,5),c(1,6),c(3,7),c(3,8),c(3,9),c(3,1)];let u=E.createGame({seed:8});u.hands=[k,opp];u.scores=[0,0];let ur=E.scoreKnock(u,0);assert.equal(ur.type,'undercut');assert.equal(ur.winner,1);assert.deepEqual(E.layoffDeadwood([c(0,3)],[[c(0,4),c(0,5),c(0,6)]]),[]);
let pv=E.playerView(E.createGame({seed:99}),0);assert(!('hands' in pv));assert(Array.isArray(pv.hand));
console.log('gin-rummy engine tests passed');