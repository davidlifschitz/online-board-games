(() => {
  'use strict';
  const E = window.MergefrontEngine;
  const $ = (id) => document.getElementById(id);
  const STORAGE = 'obg.mergefront.v1';
  let mode = 'solo';
  let games = [];
  let logs = [[], []];
  let coopPlayer = 0;
  let timer = null;
  let seconds = 60;
  let startX = 0, startY = 0, touchBoard = 0;

  const modeNames = {solo:'Solo',race:'Race',time:'Time attack',battle:'Battle',coop:'Co-op'};

  function hashText(text){let h=2166136261>>>0;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h||1;}
  function dailySeed(){const d=new Date();return hashText(`${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`);}

  function save(){
    try{localStorage.setItem(STORAGE,JSON.stringify({mode,games,logs,coopPlayer,seed:$('seed').value,size:$('size').value,seconds}));}catch(_e){}
  }
  function restore(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE));
      if(!raw||!raw.games?.length)return false;
      mode=raw.mode||'solo';games=raw.games;logs=raw.logs||[[],[]];coopPlayer=raw.coopPlayer||0;seconds=raw.seconds||60;
      $('mode').value=mode;$('seed').value=raw.seed||20260819;$('size').value=raw.size||4;
      return true;
    }catch(_e){return false;}
  }

  function newGame(){
    clearInterval(timer);timer=null;seconds=60;
    mode=$('mode').value;
    const size=Number($('size').value); const seed=Number($('seed').value)||hashText($('seed').value);
    const two=['race','time','battle'].includes(mode);
    games=[E.createGame({size,seed})];
    if(two) games.push(E.createGame({size,seed}));
    logs=[[],[]];coopPlayer=0;
    if(mode==='time') startTimer();
    render();save();
  }

  function startTimer(){
    $('clock').textContent='60s';
    timer=setInterval(()=>{seconds-=1;$('clock').textContent=`${seconds}s`;if(seconds<=0){clearInterval(timer);timer=null;finishTimed();}save();},1000);
  }
  function finishTimed(){
    const a=games[0].score,b=games[1].score;
    $('message').textContent=a===b?`Time: tie at ${a}.`:a>b?`Time: Player 1 wins ${a}–${b}.`:`Time: Player 2 wins ${b}–${a}.`;
    games.forEach(g=>g.over=true);render();
  }

  function directionFromKey(event){
    const k=event.key.toLowerCase();
    const p1={w:'up',a:'left',s:'down',d:'right'};
    const p2={arrowup:'up',arrowleft:'left',arrowdown:'down',arrowright:'right'};
    if(p1[k]) return {board:0,dir:p1[k]};
    if(p2[k]) return {board:mode==='solo'||mode==='coop'?0:1,dir:p2[k]};
    return null;
  }

  function perform(board,dir){
    if(mode==='time'&&!timer)return;
    if(mode==='coop'&&board!==0)board=0;
    const result=E.move(games[board],dir);
    if(!result.moved)return;
    games[board]=result.state;logs[board].push(dir);
    if(mode==='battle'&&result.attack&&games[1-board]) games[1-board]=E.applyAttack(games[1-board],result.attack);
    if(mode==='coop') coopPlayer=1-coopPlayer;
    checkWinners();render();save();
  }

  function checkWinners(){
    if(mode==='race'){
      const winners=games.map((g,i)=>g.won?i:-1).filter(i=>i>=0);
      if(winners.length){games.forEach(g=>g.over=true);$('message').textContent=`Player ${winners[0]+1} reached 2048 first.`;}
    } else if(mode==='battle'){
      if(games[0].over||games[1].over){const winner=games[0].over?2:1;games.forEach(g=>g.over=true);$('message').textContent=`Player ${winner} wins the battle.`;}
    } else if(mode==='solo'&&games[0].won){$('message').textContent='Target reached. Keep going for a higher score.';}
    else if(games.every(g=>g.over)) $('message').textContent='No moves remain. Start a new game to play again.';
  }

  function tileRank(v){return v>0?Math.min(12,Math.max(1,Math.log2(v)-1)):0;}
  function boardHtml(g,i){
    const title=mode==='solo'?'Solo board':mode==='coop'?`Shared board · Player ${coopPlayer+1} to move`:`Player ${i+1}`;
    return `<article class="board-card ${mode==='coop'?'active':''}" data-board="${i}">
      <div class="board-head"><h2>${title}</h2><span class="score">${g.score.toLocaleString()} pts</span></div>
      <div class="grid" style="grid-template-columns:repeat(${g.size},1fr)" data-board="${i}" aria-label="${title}">
        ${g.cells.map(v=>`<div class="tile ${v===0?'empty':''} ${v===-1?'blocker':''}" data-rank="${tileRank(v)}">${v===-1?'×':v||'0'}</div>`).join('')}
      </div>
      <div class="board-foot"><span>${g.moves} moves</span><span>${g.over?'No moves':g.won?'2048 reached':'Highest '+Math.max(...g.cells.filter(v=>v>0),0)}</span></div>
    </article>`;
  }

  function render(){
    $('modeLabel').textContent=modeNames[mode];
    $('clock').textContent=mode==='time'?`${Math.max(0,seconds)}s`:'—';
    $('replayCount').textContent=`${logs.reduce((n,l)=>n+l.length,0)} moves`;
    const el=$('boards');el.className='boards '+(games.length===1?'one':'');el.innerHTML=games.map(boardHtml).join('');
    bindTouch();
  }

  function bindTouch(){
    document.querySelectorAll('.grid').forEach(grid=>{
      grid.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;touchBoard=Number(grid.dataset.board);grid.setPointerCapture?.(e.pointerId);});
      grid.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');perform(touchBoard,dir);});
    });
  }

  document.addEventListener('keydown',e=>{const m=directionFromKey(e);if(!m)return;e.preventDefault();perform(m.board,m.dir);});
  $('newGame').addEventListener('click',newGame);
  $('mode').addEventListener('change',newGame);
  $('size').addEventListener('change',newGame);
  $('daily').addEventListener('click',()=>{$('seed').value=dailySeed();newGame();});
  if(!restore())newGame();else{if(mode==='time'&&seconds>0)startTimer();render();}
})();
