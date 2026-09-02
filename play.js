const descriptions={'deal-room':'Property-set card battles with bot and multiplayer play.','photo-puzzle':'Turn any photo into a private jigsaw-style puzzle.','reversi':'Disk-flipping strategy with optional hints and a mobility-aware AI.','checkers':'American checkers with mandatory captures, multi-jumps, kings and computer opponents.','five-dice':'A full five-dice scorecard with projected scoring, bots and offline support.','uno-style':'An original shedding-card game with multiplayer and bot play.','codenames-style':'Team word association with local, offline and online modes.','connect-four':'Connection strategy with strong AI, local matches and peer-to-peer rooms.','risk-style':'Territory conquest with reinforcement, attack, fortify and bots.','carcassonne-style':'Tile-placement strategy with scoring, bot play and offline support.','president':'President-family climbing cards with bot opponents and flexible rules.','hearts':'Four-player trick taking with rotating passes and computer opponents.','spades':'Partnership trick taking with bidding, nil, bags and computer opponents.','gin-rummy':'Two-player draw-and-discard rummy with meld detection and a computer opponent.','rummy-500':'Rummy for 2–6 seats with melds, layoffs, scoring and computer opponents.','backgammon':'Backgammon with complete-turn legality, doubling flow and bots.','battleship-style':'Hidden-fleet strategy with local privacy screens and probability-targeting bots.','blackjack':'Play-money Blackjack training with configurable rules and strategy feedback.','2048-multiplayer':'Deterministic merge puzzles with solo, race, battle and co-op modes.','dots-and-boxes':'Configurable Dots and Boxes with local players and endgame bots.','mancala':'Kalah with captures, extra turns and alpha-beta computer opponents.','nine-mens-morris':'Nine Men’s Morris with placement, movement, repetition handling and bots.','hex':'Configurable Hex with the pie rule, path analysis and computer play.','mastermind':'Code-breaking with duplicate-safe feedback and a candidate-elimination solver.','farkle':'Six-dice push-your-luck play with selectable scoring, bots and final-round logic.'};

const routes={
  strategy:{label:'Strategy',prefix:'S',color:'var(--subway-blue)'},
  cards:{label:'Cards',prefix:'C',color:'var(--subway-red)'},
  puzzle:{label:'Puzzle',prefix:'P',color:'var(--subway-green)'},
  word:{label:'Word',prefix:'W',color:'var(--subway-purple)'},
  party:{label:'Party',prefix:'A',color:'var(--subway-orange)'},
  dice:{label:'Dice',prefix:'D',color:'var(--subway-yellow)'}
};

let allGames=[],activeFilter='all',upstreamMap={},stationCodes=new Map();

function routeFor(game){
  const cats=game.categories||[];
  if(cats.includes('cards'))return'cards';
  if(cats.includes('puzzle')||cats.includes('deduction'))return'puzzle';
  if(cats.includes('word'))return'word';
  if(cats.includes('dice'))return'dice';
  if(cats.includes('party'))return'party';
  if(cats.includes('strategy')||cats.includes('abstract')||cats.includes('territory'))return'strategy';
  return'party';
}

function buildStationCodes(){
  const counters={strategy:0,cards:0,puzzle:0,word:0,party:0,dice:0};
  stationCodes=new Map(allGames.map(game=>{
    const route=routeFor(game);
    counters[route]+=1;
    return[game.id,`${routes[route].prefix}${String(counters[route]).padStart(2,'0')}`];
  }));
}

function provenance(game){
  const upstream=upstreamMap[game.id];
  if(!upstream)return{text:'Original'};
  return{text:upstream.status==='adapted-v1'?'Permissive adapted':upstream.status==='audited'?'Permissive audited':'Independent'};
}

function linkMeta(url){
  const external=/^https?:\/\//.test(url)&&!url.startsWith(location.origin);
  return{external,target:external?' target="_blank" rel="noreferrer"':''};
}

function prettyCategory(category){return category.replaceAll('-',' ')}

function render(){
  const list=document.getElementById('game-grid');
  const visible=allGames.filter(game=>activeFilter==='all'||(game.categories||[]).includes(activeFilter));
  if(!visible.length){list.innerHTML='<p class="empty-state">No live stations match this route filter.</p>';return}

  list.innerHTML=visible.map(game=>{
    const routeKey=routeFor(game),route=routes[routeKey],p=provenance(game);
    const preferred=game.preferredVersion&&game.versions?.[game.preferredVersion]?.liveUrl?game.preferredVersion:null;
    const primaryUrl=preferred?game.versions[preferred].liveUrl:game.liveUrl;
    const primary=linkMeta(primaryUrl);
    const v1Url=game.versions?.v1?.liveUrl||game.liveUrl;
    const v1=linkMeta(v1Url);
    const hasV2=preferred==='v2'&&primaryUrl!==v1Url;
    const actions=hasV2
      ?`<div class="station-actions"><a class="game-play-primary" href="${primaryUrl}"${primary.target}>PLAY V2 →</a><a class="game-play-v1" href="${v1Url}"${v1.target}>V1${v1.external?' ↗':' →'}</a></div>`
      :`<div class="station-actions"><a class="game-play-primary" href="${primaryUrl}"${primary.target}>PLAY →</a></div>`;
    const meta=[route.label,game.difficulty,p.text,...(game.categories||[]).filter(category=>category!==routeKey).slice(0,2).map(prettyCategory)];
    return`<article id="game-${game.id}" class="station-row" data-tags="${(game.categories||[]).join(' ')}" style="--route-color:${route.color}"><div class="station-code"><i class="route-dot"></i><span>${stationCodes.get(game.id)}</span></div><div class="station-title"><h3>${game.title}</h3><p>${descriptions[game.id]||'A browser-first open-source game in the TrainGames network.'}</p></div><div class="station-meta">${meta.map(item=>`<span>${item}</span>`).join('')}</div>${actions}</article>`;
  }).join('');

  if(location.hash){
    const target=document.querySelector(location.hash);
    if(target)setTimeout(()=>target.scrollIntoView({block:'center'}),0);
  }
}

Promise.all([
  fetch('/games.json').then(response=>{if(!response.ok)throw new Error('games.json '+response.status);return response.json()}),
  fetch('/upstreams.json').then(response=>response.ok?response.json():{games:[]})
]).then(([catalog,upstreams])=>{
  upstreamMap=Object.fromEntries((upstreams.games||[]).map(item=>[item.id,item]));
  allGames=(catalog.games||[]).filter(game=>game.status==='live'&&game.liveUrl);
  buildStationCodes();
  const v2Count=allGames.filter(game=>game.preferredVersion==='v2').length;
  document.getElementById('collection-summary').textContent=`${allGames.length} operational stations. ${v2Count} run V2 express service; every V1 remains available.`;
  render();
}).catch(error=>{
  document.getElementById('collection-summary').textContent='The live network could not be loaded.';
  document.getElementById('game-grid').innerHTML=`<p class="empty-state">Network error: ${error.message}</p>`;
});

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  activeFilter=button.dataset.filter;
  render();
}));
