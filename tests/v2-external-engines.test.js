const test = require('node:test');
const assert = require('node:assert/strict');

const Fourfront = require('../games/fourfront/v2/game.js');
const FiveDice = require('../games/five-dice/v2/game.js');
const HueBreak = require('../games/huebreak/v2/game.js');
const Threadmark = require('../games/threadmark/v2/game.js');
const Frontiers = require('../games/frontiers/v2/game.js');

test('Fourfront detects horizontal, vertical and diagonal wins', () => {
  let b = Fourfront.createBoard();
  for (const c of [0,1,2,3]) b = Fourfront.drop(b,c,1).board;
  assert.equal(Fourfront.winner(b),1);
  b = Fourfront.createBoard();
  for (let i=0;i<4;i++) b = Fourfront.drop(b,2,2).board;
  assert.equal(Fourfront.winner(b),2);
  b = Fourfront.createBoard();
  [[0,1],[1,2],[1,1],[2,2],[2,2],[2,1],[3,2],[3,2],[3,2],[3,1]].forEach(([c,p])=>{b=Fourfront.drop(b,c,p).board});
  assert.equal(Fourfront.winner(b),1);
});

test('Five Dice scores core categories and straights', () => {
  assert.equal(FiveDice.scoreCategory([6,6,6,2,3],'sixes'),18);
  assert.equal(FiveDice.scoreCategory([2,2,2,3,3],'fullHouse'),25);
  assert.equal(FiveDice.scoreCategory([1,2,3,4,6],'smallStraight'),30);
  assert.equal(FiveDice.scoreCategory([2,3,4,5,6],'largeStraight'),40);
  assert.equal(FiveDice.scoreCategory([5,5,5,5,5],'fiveKind'),50);
});

test('HueBreak allows matching hue, rank/action, and wild cards', () => {
  const top={hue:'ocean',kind:'number',value:'7'};
  assert.equal(HueBreak.canPlay({hue:'ocean',kind:'number',value:'2'},top,'ocean'),true);
  assert.equal(HueBreak.canPlay({hue:'sun',kind:'number',value:'7'},top,'ocean'),true);
  assert.equal(HueBreak.canPlay({hue:'wild',kind:'wild',value:'wild'},top,'ocean'),true);
  assert.equal(HueBreak.canPlay({hue:'sun',kind:'number',value:'2'},top,'ocean'),false);
});

test('Threadmark reveals switch turns correctly and assassin ends the game', () => {
  let s=Threadmark.createState(['A','B','C','D','E']);
  s.roles={A:'red',B:'blue',C:'neutral',D:'assassin',E:'red'};
  s.team='red';
  s=Threadmark.reveal(s,'C');
  assert.equal(s.team,'blue');
  s.team='red'; s.ended=false; s.winner=null;
  s=Threadmark.reveal(s,'D');
  assert.equal(s.ended,true);
  assert.equal(s.winner,'blue');
});

test('Frontiers attack resolution preserves nonnegative troops and can capture', () => {
  const state={territories:{a:{owner:'human',troops:3},b:{owner:'bot',troops:1}}};
  const result=Frontiers.resolveAttack(state,'a','b',[6,5,4],[1]);
  assert.equal(result.territories.b.owner,'human');
  assert.ok(result.territories.a.troops>=1);
  assert.ok(result.territories.b.troops>=1);
});
