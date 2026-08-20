const assert=require('node:assert/strict');
const E=require('../engine.js');

let s=E.createGame({seed:'test'});
assert.equal(s.factories.length,5);
let s4=E.createGame({seed:'four',players:4});assert.equal(s4.factories.length,9);assert.equal(s4.players.length,4);assert.equal(s4.factories.flat().reduce((a,b)=>a+b,0),36);
assert.equal(s.factories.flat().reduce((a,b)=>a+b,0),20);
assert.equal(s.bag.reduce((a,b)=>a+b,0),80);
assert.ok(E.legalMoves(s).length>0);

// Factory drafting moves leftovers to the center and fills the chosen line.
s={...E.createGame({seed:1}),factories:[[2,1,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],center:[0,0,0,0,0],firstToken:true};
s=E.draft(s,{source:'factory',index:0,color:0,line:1});
assert.equal(s.players[0].lines[1].count,2);
assert.equal(s.center[1],1);assert.equal(s.center[2],1);
assert.equal(s.current,1);

// Center token follows the first player to draft from the center.
s.current=1;s.center=[0,1,0,0,0];s.factories=Array.from({length:5},()=>[0,0,0,0,0]);
s=E.draft(s,{source:'center',index:null,color:1,line:0});
assert.equal(s.last.marker,true);
assert.equal(s.firstPlayer,1,'round reset should pass first-player status to token taker');

// Pattern-line color restrictions and wall restriction.
s=E.createGame({seed:2});s.players[0].lines[2]={color:3,count:1};
let fi=s.factories.findIndex(f=>f.some(n=>n)),fc=s.factories[fi].findIndex(n=>n);assert.ok(E.validateMove(s,{source:'factory',index:fi,color:fc,line:2}));
let p=s.players[0];p.lines[2]={color:null,count:0};p.wall[2][E.wallColumnForColor(2,4)]=4;
const idx=s.factories.findIndex(f=>f[4]>0);if(idx>=0)assert.ok(E.validateMove(s,{source:'factory',index:idx,color:4,line:2}));

// Scoring: isolated tile = 1, horizontal chain = 2, crossing chains adds both lengths.
let wall=Array.from({length:5},()=>Array(5).fill(null));wall[2][2]=0;assert.equal(E.tileScore(wall,2,2),1);
wall=Array.from({length:5},()=>Array(5).fill(null));wall[2][1]=1;wall[2][2]=0;assert.equal(E.tileScore(wall,2,2),2);
wall[1][2]=2;assert.equal(E.tileScore(wall,2,2),4);
assert.equal(E.floorPenalty(['marker',0,1,2,3,4,0,1]),-14);

// Completed line places one tile, discards the rest, and applies floor penalties without dropping below zero.
s=E.createGame({seed:3});
s.factories=Array.from({length:5},()=>[0,0,0,0,0]);s.center=[0,0,0,0,0];s.players[0].score=1;s.players[0].lines[2]={color:2,count:3};s.players[0].floor=['marker',1,1];s.players[1].lines[0]={color:0,count:1};s.nextFirstPlayer=0;
E.resolveRound(s);
assert.equal(s.players[0].wall[2][E.wallColumnForColor(2,2)],2);
assert.equal(s.players[0].score,0);
assert.equal(s.discard[2]>=2,true);

// End game and bonuses: completing one row ends the game.
s=E.createGame({seed:4});s.factories=Array.from({length:5},()=>[0,0,0,0,0]);s.center=[0,0,0,0,0];
for(let c=0;c<4;c++)s.players[0].wall[0][c]=E.WALL_PATTERN[0][c];
const missing=E.WALL_PATTERN[0][4];s.players[0].lines[0]={color:missing,count:1};
E.resolveRound(s);assert.equal(s.over,true);assert.ok(s.players[0].score>=7);assert.ok(s.winners.includes(0));

s=E.createGame({seed:5});assert.ok(E.botMove(s,'medium'));assert.ok(E.botMove(s,'hard'));

// Deterministic full-game invariant coverage for every supported local player count.
function countTiles(game){
  let total=game.bag.reduce((a,b)=>a+b,0)+game.discard.reduce((a,b)=>a+b,0)+game.center.reduce((a,b)=>a+b,0)+game.factories.flat().reduce((a,b)=>a+b,0);
  for(const player of game.players){
    for(const line of player.lines)total+=line.count;
    total+=player.wall.flat().filter(v=>v!=null).length;
    total+=player.floor.filter(v=>v!=='marker').length;
  }
  return total;
}
for(const players of [2,3,4]){
  for(let gameIndex=0;gameIndex<20;gameIndex++){
    let game=E.createGame({players,seed:`invariant-${players}-${gameIndex}`}),guard=0;
    assert.equal(countTiles(game),100);
    while(!game.over&&guard++<1000){
      const moves=E.legalMoves(game);assert.ok(moves.length>0,'non-terminal state must have a legal draft');
      game=E.draft(game,moves[(gameIndex*17+guard*31)%moves.length]);
      assert.equal(countTiles(game),100,'tiles must be conserved across drafts and round resolution');
      for(const player of game.players){
        assert.ok(player.score>=0,'scores never go below zero');
        player.lines.forEach((line,row)=>assert.ok(line.count>=0&&line.count<=row+1,'pattern line remains within capacity'));
      }
    }
    assert.ok(game.over,'deterministic games should reach an end state');
  }
}
console.log('pattern foundry engine tests passed');
