(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PatternFoundryEngine=api;})(typeof self!=='undefined'?self:this,function(){
'use strict';

const COLORS=['azure','gold','coral','ink','ivory'];
const WALL_PATTERN=[
  [0,1,2,3,4],
  [4,0,1,2,3],
  [3,4,0,1,2],
  [2,3,4,0,1],
  [1,2,3,4,0]
];
const FLOOR_PENALTIES=[-1,-1,-2,-2,-2,-3,-3];
function factoryCountForPlayers(n){return 2*n+1;}

function seedValue(seed){
  if(typeof seed==='number'&&Number.isFinite(seed)) return (seed>>>0)||0x9e3779b9;
  const text=String(seed==null?'pattern-foundry':seed);let h=2166136261>>>0;
  for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
  return h||0x9e3779b9;
}
function nextRandom(state){let x=state.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;state.rng=x>>>0;return (state.rng>>>0)/4294967296;}
function emptyCounts(){return Array(COLORS.length).fill(0);}
function newPlayer(){return{score:0,lines:Array.from({length:5},()=>({color:null,count:0})),wall:Array.from({length:5},()=>Array(5).fill(null)),floor:[],completedRows:0};}
function createGame(options){options=options||{};const numPlayers=Math.max(2,Math.min(4,Math.floor(Number(options.players)||2)));const state={numPlayers,players:Array.from({length:numPlayers},newPlayer),bag:Array(5).fill(20),discard:emptyCounts(),factories:Array.from({length:factoryCountForPlayers(numPlayers)},emptyCounts),center:emptyCounts(),firstToken:true,current:0,firstPlayer:0,nextFirstPlayer:null,round:1,over:false,winners:[],last:null,rng:seedValue(options.seed),moves:0};setupRound(state);return state;}
function clone(state){return JSON.parse(JSON.stringify(state));}
function refillBag(state){const total=state.discard.reduce((a,b)=>a+b,0);if(!total)return false;state.bag=state.discard.slice();state.discard=emptyCounts();return true;}
function drawOne(state){let total=state.bag.reduce((a,b)=>a+b,0);if(total===0){if(!refillBag(state))return null;total=state.bag.reduce((a,b)=>a+b,0);}let pick=Math.floor(nextRandom(state)*total);for(let c=0;c<5;c++){if(pick<state.bag[c]){state.bag[c]--;return c;}pick-=state.bag[c];}return null;}
function fillFactory(state,index){state.factories[index]=emptyCounts();for(let n=0;n<4;n++){const color=drawOne(state);if(color==null)break;state.factories[index][color]++;}}
function setupRound(state){const count=factoryCountForPlayers(state.numPlayers||state.players.length);state.factories=Array.from({length:count},emptyCounts);for(let i=0;i<count;i++)fillFactory(state,i);state.center=emptyCounts();state.firstToken=true;state.nextFirstPlayer=null;state.current=state.firstPlayer;return state;}
function wallColumnForColor(row,color){return WALL_PATTERN[row].indexOf(color);}
function canUseLine(player,row,color){if(row===5)return true;if(row<0||row>4)return false;const line=player.lines[row];if(line.count>=row+1)return false;if(line.color!=null&&line.color!==color)return false;const col=wallColumnForColor(row,color);if(player.wall[row][col]!=null)return false;return true;}
function sourceCounts(state,move){if(move.source==='center')return state.center;if(move.source==='factory'&&Number.isInteger(move.index)&&move.index>=0&&move.index<state.factories.length)return state.factories[move.index];return null;}
function validateMove(state,move){if(state.over)return'Game is over';if(!move||!Number.isInteger(move.color)||move.color<0||move.color>4)return'Choose a valid color';const source=sourceCounts(state,move);if(!source)return'Choose a valid source';if(source[move.color]<=0)return'That source has no tiles of that color';if(!Number.isInteger(move.line)||move.line<0||move.line>5)return'Choose a valid destination';if(!canUseLine(state.players[state.current],move.line,move.color))return'That pattern line cannot take this color';return null;}
function sourceEmpty(state){return state.factories.every(f=>f.every(n=>n===0))&&state.center.every(n=>n===0);}
function legalMoves(state){if(state.over)return[];const moves=[];const add=(source,index,counts)=>{for(let color=0;color<5;color++){if(counts[color]<=0)continue;for(let line=0;line<6;line++){const move={source,index,color,line};if(!validateMove(state,move))moves.push(move);}}};for(let i=0;i<state.factories.length;i++)add('factory',i,state.factories[i]);add('center',null,state.center);return moves;}
function placeOnLine(state,playerIndex,color,line,count){const player=state.players[playerIndex];if(line===5){for(let i=0;i<count;i++)player.floor.push(color);return{placed:0,overflow:count};}const row=player.lines[line],capacity=line+1,space=capacity-row.count,placed=Math.min(space,count),overflow=count-placed;if(placed){row.color=color;row.count+=placed;}for(let i=0;i<overflow;i++)player.floor.push(color);return{placed,overflow};}
function draft(input,move){const state=clone(input),error=validateMove(state,move);if(error)throw new Error(error);const playerIndex=state.current,source=sourceCounts(state,move),taken=source[move.color];let marker=false;
  if(move.source==='factory'){
    source[move.color]=0;
    for(let c=0;c<5;c++){if(source[c]){state.center[c]+=source[c];source[c]=0;}}
  }else{
    state.center[move.color]=0;
    if(state.firstToken){state.firstToken=false;state.nextFirstPlayer=playerIndex;state.players[playerIndex].floor.push('marker');marker=true;}
  }
  const placement=placeOnLine(state,playerIndex,move.color,move.line,taken);state.moves++;state.last={player:playerIndex,move:JSON.parse(JSON.stringify(move)),taken,marker,placed:placement.placed,overflow:placement.overflow};
  if(sourceEmpty(state))resolveRound(state);else state.current=(playerIndex+1)%state.numPlayers;
  return state;
}
function tileScore(wall,row,col){let horizontal=1,vertical=1;for(let c=col-1;c>=0&&wall[row][c]!=null;c--)horizontal++;for(let c=col+1;c<5&&wall[row][c]!=null;c++)horizontal++;for(let r=row-1;r>=0&&wall[r][col]!=null;r--)vertical++;for(let r=row+1;r<5&&wall[r][col]!=null;r++)vertical++;const hasH=horizontal>1,hasV=vertical>1;if(hasH&&hasV)return horizontal+vertical;if(hasH)return horizontal;if(hasV)return vertical;return 1;}
function floorPenalty(floor){let total=0;for(let i=0;i<Math.min(floor.length,FLOOR_PENALTIES.length);i++)total+=FLOOR_PENALTIES[i];return total;}
function countCompletedRows(player){return player.wall.filter(row=>row.every(v=>v!=null)).length;}
function endBonuses(player){let bonus=0;for(const row of player.wall)if(row.every(v=>v!=null))bonus+=2;for(let c=0;c<5;c++)if(player.wall.every(row=>row[c]!=null))bonus+=7;for(let color=0;color<5;color++){let count=0;for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(player.wall[r][c]===color)count++;if(count===5)bonus+=10;}return bonus;}
function resolveRound(state){for(let p=0;p<state.numPlayers;p++){
    const player=state.players[p];let gained=0;
    for(let row=0;row<5;row++){
      const line=player.lines[row],capacity=row+1;if(line.count!==capacity)continue;const color=line.color,col=wallColumnForColor(row,color);player.wall[row][col]=color;gained+=tileScore(player.wall,row,col);state.discard[color]+=capacity-1;player.lines[row]={color:null,count:0};
    }
    const penalty=floorPenalty(player.floor);for(const item of player.floor)if(item!=='marker')state.discard[item]++;player.floor=[];player.score=Math.max(0,player.score+gained+penalty);player.completedRows=countCompletedRows(player);
  }
  const ended=state.players.some(p=>p.completedRows>0);
  if(ended){for(const p of state.players){p.score+=endBonuses(p);p.completedRows=countCompletedRows(p);}const best=Math.max(...state.players.map(p=>p.score));const tied=state.players.map((p,i)=>({p,i})).filter(x=>x.p.score===best);let winners=tied;if(tied.length>1){const rows=Math.max(...tied.map(x=>x.p.completedRows));winners=tied.filter(x=>x.p.completedRows===rows);}state.winners=winners.map(x=>x.i);state.over=true;state.current=null;return state;}
  state.round++;state.firstPlayer=state.nextFirstPlayer==null?state.firstPlayer:state.nextFirstPlayer;setupRound(state);return state;
}
function moveKey(m){return`${m.source==='center'?'c':'f'+m.index}:${m.color}:${m.line}`;}
function evaluatePlayer(state,playerIndex){const p=state.players[playerIndex],opponents=state.players.filter((_,i)=>i!==playerIndex),oppScore=Math.max(...opponents.map(o=>o.score)),oppWall=Math.max(...opponents.map(o=>o.wall.flat().filter(v=>v!=null).length));let value=(p.score-oppScore)*20;value+=(p.wall.flat().filter(v=>v!=null).length-oppWall)*5;for(let r=0;r<5;r++){const line=p.lines[r];if(line.count){value+=line.count*2;if(line.count===r+1)value+=8;const col=wallColumnForColor(r,line.color),temp=p.wall.map(row=>row.slice());temp[r][col]=line.color;value+=tileScore(temp,r,col)*2;}}value+=floorPenalty(p.floor)*3;value-=Math.min(...opponents.map(o=>floorPenalty(o.floor)));if(state.over){if(state.winners.includes(playerIndex))value+=100000;if(state.winners.length===1&&!state.winners.includes(playerIndex))value-=100000;}return value;}
function immediateMoveScore(state,move,root){const next=draft(state,move);return evaluatePlayer(next,root);}
function botMove(state,difficulty,rng){const moves=legalMoves(state);if(!moves.length)return null;rng=rng||Math.random;if(difficulty==='easy')return moves[Math.floor(rng()*moves.length)];const root=state.current;const ranked=moves.map(move=>({move,value:immediateMoveScore(state,move,root)})).sort((a,b)=>b.value-a.value||moveKey(a.move).localeCompare(moveKey(b.move)));if(difficulty!=='hard')return ranked[0].move;
  let best=ranked[0].move,bestVal=-Infinity;for(const candidate of ranked.slice(0,14)){
    const next=draft(state,candidate.move);let value;if(next.over||next.current===root)value=evaluatePlayer(next,root);else{const replies=legalMoves(next).map(move=>({move,value:immediateMoveScore(next,move,next.current)})).sort((a,b)=>b.value-a.value).slice(0,10);if(!replies.length)value=evaluatePlayer(next,root);else{value=Infinity;for(const reply of replies){const after=draft(next,reply.move);value=Math.min(value,evaluatePlayer(after,root));}}}if(value>bestVal){bestVal=value;best=candidate.move;}}
  return best;
}
function describeMove(move){const src=move.source==='center'?'center':`factory ${move.index+1}`;const dst=move.line===5?'floor':`line ${move.line+1}`;return`${COLORS[move.color]} from ${src} to ${dst}`;}
return{COLORS,WALL_PATTERN,FLOOR_PENALTIES,factoryCountForPlayers,createGame,clone,setupRound,legalMoves,validateMove,draft,resolveRound,wallColumnForColor,tileScore,floorPenalty,endBonuses,botMove,evaluatePlayer,describeMove};
});
