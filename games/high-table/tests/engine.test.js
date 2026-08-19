const assert=require('assert'),E=require('../engine.js');
let s=E.createGame({players:4,seed:1,revolution:true});assert.equal(s.hands.reduce((n,h)=>n+h.length,0),52);assert.equal(E.legalGroups(s).length>0,true);
// Deterministic custom table: single 5 may be beaten by 6, not 4.
s={players:3,hands:[[3,4],[17],[31]],current:0,table:{rank:5,count:1,cards:[3]},lastPlayPlayer:1,passes:[false,false,false],finished:[],over:false,revolution:false,options:{revolution:true,clearRank:null},history:[]}; // cards ranks: 5,6
assert.equal(E.canPlay(s,0,[4]),true);assert.equal(E.canPlay(s,0,[3]),false);
// Matching group size enforced.
s.table={rank:3,count:2,cards:[1,14]};assert.equal(E.canPlay(s,0,[4]),false);
// Passes reset trick after everyone else passes.
s={players:3,hands:[[3],[4],[5]],current:1,table:{rank:5,count:1,cards:[3]},lastPlayPlayer:0,passes:[false,false,false],finished:[],over:false,revolution:false,options:{revolution:true,clearRank:null},history:[]};s=E.pass(s);assert.equal(s.current,2);s=E.pass(s);assert.equal(s.table,null);assert.equal(s.current,0);
// Four of a kind reverses order.
s={players:3,hands:[[1,14,27,40,2],[5],[6]],current:0,table:null,lastPlayPlayer:null,passes:[false,false,false],finished:[],over:false,revolution:false,options:{revolution:true,clearRank:null},history:[]};s=E.play(s,[1,14,27,40]);assert.equal(s.revolution,true);
// Finishing order completes when one player remains.
s={players:3,hands:[[3],[4],[5]],current:0,table:null,lastPlayPlayer:null,passes:[false,false,false],finished:[],over:false,revolution:false,options:{revolution:false,clearRank:null},history:[]};s=E.play(s,[3]);assert.deepEqual(s.finished,[0]);s=E.play(s,[4]);assert.equal(s.over,true);assert.deepEqual(s.finished,[0,1,2]);
let pv=E.playerView(E.createGame({seed:99,players:4}),0);assert(!('hands' in pv));assert(Array.isArray(pv.hand));
console.log('high-table engine tests passed');
