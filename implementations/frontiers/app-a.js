const $ = id => document.getElementById(id);
const els = {
  map:$('worldMap'), routeLayer:$('routeLayer'), territoryLayer:$('territoryLayer'), counterLayer:$('counterLayer'), arrowLayer:$('arrowLayer'), regionLabelLayer:$('regionLabelLayer'),
  legend:$('regionLegend'), hover:$('hoverInfo'), roster:$('playerRoster'), action:$('actionPanel'), combat:$('combatPanel'), cards:$('cardsPanel'), history:$('historyList'), historyCount:$('historyCount'),
  phase:$('phaseLabel'), turn:$('turnLabel'), timer:$('timerLabel'), start:$('startOverlay'), lobby:$('lobbyOverlay'), rules:$('rulesOverlay'), victory:$('victoryOverlay'),
  side:$('sidePanel'), toast:$('toast')
};

let state = null;
let rng = new SeededRng(Date.now());
let selectedFrom = null;
let selectedTo = null;
let lastCombat = null;
let setupMode = 'local';
let localSetupPlayerIndex = 0;
let network = new FrontiersNetwork();
let networkRole = 'offline';
let localPlayerId = null;
let lobbyPlayers = [];
let lobbyConfig = null;
let tokenToPlayer = new Map();
let timerTick = null;
let lastTurnStamp = null;
let mapView = {x:0,y:0,w:1020,h:650};
let pointerState = new Map();
let pinchStart = null;
let dragStart = null;

const regionLabelPositions = {
  aurelian:[185,190],verdant:[205,458],ember:[535,306],nacre:[837,500],zephyr:[832,196],umbral:[522,126]
};
const symbolIcon = {forge:'⚒',beacon:'✦',aegis:'⬡',prism:'◇'};
const phaseName = {draft:'Draft',setup:'Deploy',reinforce:'Reinforce',attack:'Attack',fortify:'Fortify','turn-end':'End turn'};

function boot(){
  buildStaticMap();
  renderSetupForms();
  wireGlobalEvents();
  if(localStorage.getItem('frontiers-save')) $('resumeRow').classList.remove('hidden');
  if('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
}

function buildStaticMap(){
  els.territoryLayer.innerHTML=''; els.routeLayer.innerHTML=''; els.regionLabelLayer.innerHTML='';
  const drawnRoutes=new Set();
  for(const t of TERRITORIES){
    for(const n of t.neighbors){
      const other=TERRITORY_BY_ID[n];
      if(!other||other.region===t.region)continue;
      const key=[t.id,n].sort().join('|');if(drawnRoutes.has(key))continue;drawnRoutes.add(key);
      const a=centroid(t.points),b=centroid(other.points);const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',a[0]);line.setAttribute('y1',a[1]);line.setAttribute('x2',b[0]);line.setAttribute('y2',b[1]);line.classList.add('sea-route');els.routeLayer.appendChild(line);
    }
  }
  for(const t of TERRITORIES){
    const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
    poly.setAttribute('points',t.points); poly.dataset.id=t.id; poly.setAttribute('tabindex','0'); poly.setAttribute('role','button');
    poly.setAttribute('aria-label',t.name); poly.classList.add('territory');
    poly.addEventListener('mouseenter',()=>showTerritoryInfo(t.id));
    poly.addEventListener('focus',()=>showTerritoryInfo(t.id));
    poly.addEventListener('click',e=>{e.stopPropagation();onTerritoryClick(t.id);});
    poly.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onTerritoryClick(t.id);}});
    els.territoryLayer.appendChild(poly);
  }
  for(const [region,[x,y]] of Object.entries(regionLabelPositions)){
    const text=document.createElementNS('http://www.w3.org/2000/svg','text'); text.setAttribute('x',x);text.setAttribute('y',y);text.classList.add('region-label');text.textContent=REGIONS[region].name.toUpperCase();els.regionLabelLayer.appendChild(text);
  }
  els.legend.innerHTML=Object.entries(REGIONS).map(([,r])=>`<span class="legend-chip"><span class="legend-dot" style="background:${r.color}"></span>${r.name} +${r.bonus}</span>`).join('');
}

function renderSetupForms(){
  $('localSetup').innerHTML=`
    <div class="setup-grid">
      <div class="field"><label>Your name</label><input class="input" id="localName" value="Commander" maxlength="24"></div>
      <div class="field"><label>Players</label><select id="localPlayers"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></div>
      <div class="field"><label>Bots</label><select id="localBots"><option value="1">1 bot</option><option value="0">No bots</option></select></div>
      <div class="field"><label>Bot difficulty</label><select id="localDifficulty"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select></div>
      ${commonSetupFields('local')}
    </div>
    <p class="setup-note">Local humans use pass-and-play. Starting reserves can be placed manually or auto-deployed after territories are assigned.</p>
    <button class="button primary full" id="startLocal">Start local expedition</button>`;
  $('hostSetup').innerHTML=`
    <div class="setup-grid">
      <div class="field"><label>Host name</label><input class="input" id="hostName" value="Host" maxlength="24"></div>
      <div class="field"><label>Initial bots</label><select id="hostBots"><option value="0">None</option><option value="1">1 bot</option><option value="2">2 bots</option><option value="3">3 bots</option></select></div>
      ${commonSetupFields('host')}
    </div>
    <p class="setup-note">Guests connect with a six-character room code. The host alone applies game actions and broadcasts canonical state.</p>
    <button class="button primary full" id="startHost">Create online room</button>`;
  $('joinSetup').innerHTML=`
    <div class="setup-grid"><div class="field"><label>Your name</label><input class="input" id="joinName" value="Guest" maxlength="24"></div><div class="field"><label>Room code</label><input class="input" id="joinCode" maxlength="6" placeholder="ABC123" autocapitalize="characters"></div></div>
    <p class="setup-note">Online play needs a network connection for PeerJS signaling and WebRTC connectivity. Local/bot games do not.</p>
    <button class="button primary full" id="joinRoom">Join room</button>`;
  $('startLocal').onclick=startLocalGame; $('startHost').onclick=startHostLobby; $('joinRoom').onclick=joinOnlineRoom;
  $('localPlayers').onchange=syncBotOptions; syncBotOptions();
}
function commonSetupFields(prefix){return `
  <div class="field"><label>Territory assignment</label><select id="${prefix}Assignment"><option value="random">Random scatter</option><option value="draft">Territory draft</option></select></div>
  <div class="field"><label>Victory</label><select id="${prefix}Win"><option value="domination">World domination</option><option value="capital">Capital ascendancy</option><option value="mission">Objective missions</option><option value="score">40-round score</option></select></div>
  <div class="field"><label>Turn timer</label><select id="${prefix}Timer"><option value="0">Off</option><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">120 seconds</option></select></div>
  <div class="field"><label>Score round limit</label><select id="${prefix}Limit"><option>30</option><option selected>40</option><option>60</option></select></div>`;}
function syncBotOptions(){
  const n=Number($('localPlayers').value); const current=Number($('localBots').value||1); $('localBots').innerHTML='';
  for(let i=0;i<n;i++){const o=document.createElement('option');o.value=i;o.textContent=i?`${i} bot${i>1?'s':''}`:'No bots';if(i===Math.min(current,n-1))o.selected=true;$('localBots').appendChild(o);}
}

function setupOptions(prefix){return {assignment:$(`${prefix}Assignment`).value,winMode:$(`${prefix}Win`).value,turnLimit:Number($(`${prefix}Limit`).value),turnTimerSeconds:Number($(`${prefix}Timer`).value)};}
function startLocalGame(){
  network.close(); networkRole='offline'; tokenToPlayer.clear(); localPlayerId=null;
  const count=Number($('localPlayers').value), bots=Number($('localBots').value), humans=count-bots; const difficulty=$('localDifficulty').value;
  const players=[]; for(let i=0;i<humans;i++)players.push({id:`p${i+1}`,name:i===0?$('localName').value||'Commander':`Player ${i+1}`,type:'human'});
  for(let i=humans;i<count;i++)players.push({id:`p${i+1}`,name:`${difficulty[0].toUpperCase()+difficulty.slice(1)} Bot ${i-humans+1}`,type:'bot',difficulty});
  startState(createGame({...setupOptions('local'),players,seed:Date.now()},rng));
}

async function startHostLobby(){
  setBusy($('startHost'),true,'Opening room…');
  try{
    network.close(); networkRole='host'; lobbyConfig=setupOptions('host');
    lobbyPlayers=[{name:$('hostName').value||'Host',type:'human',token:'host'}];
    const botCount=Number($('hostBots').value); for(let i=0;i<botCount;i++)lobbyPlayers.push({name:`Bot ${i+1}`,type:'bot',difficulty:'medium',token:null});
    const code=createRoomCode();
    await network.host(code,{onJoin:onNetworkJoin,onCommand:onNetworkCommand,onDisconnect:onNetworkDisconnect,onStatus:s=>networkStatus(s)});
    $('roomCodeButton').textContent=code; renderLobby(); els.start.classList.add('hidden'); els.lobby.classList.remove('hidden');
  }catch(err){networkRole='offline';toast(err.message||'Could not open room.');}
  finally{setBusy($('startHost'),false,'Create online room');}
}

async function joinOnlineRoom(){
  const code=normalizeRoomCode($('joinCode').value); if(code.length<4){toast('Enter the host room code.');return;}
  setBusy($('joinRoom'),true,'Connecting…');
  try{
    network.close(); networkRole='guest'; localPlayerId=null;
    await network.join(code,$('joinName').value||'Guest',{onState:incoming=>{state=hydrateState(incoming);localPlayerId=state.players.find(p=>p.networkToken===getClientToken())?.id||null; els.start.classList.add('hidden');render();},onStatus:s=>networkStatus(s)});
    $('joinRoom').textContent='Connected — waiting for host';
    toast(`Connected to ${code}. Waiting for launch.`);
  }catch(err){networkRole='offline';toast(err.message||'Could not join room.');setBusy($('joinRoom'),false,'Join room');}
}
function onNetworkJoin({token,name}){
  if(!state){
    if(lobbyPlayers.some(p=>p.token===token))return;
    if(lobbyPlayers.length>=6){network.sendNotice(token,'Room is full.');return;}
    lobbyPlayers.push({name,type:'human',token}); renderLobby(); return;
  }
  const existing=state.players.find(p=>p.networkToken===token);
  if(existing){existing.connected=true;tokenToPlayer.set(token,existing.id);network.sendStateTo(token,state);saveAndBroadcast();toast(`${existing.name} reconnected.`);}
  else network.sendNotice(token,'This match has already started.');
}
function onNetworkDisconnect({token}){
  const p=state?.players.find(p=>p.networkToken===token);if(p){p.connected=false;saveAndBroadcast();toast(`${p.name} disconnected.`);}else{lobbyPlayers=lobbyPlayers.filter(p=>p.token!==token);renderLobby();}
}
function onNetworkCommand({token,command}){
  const playerId=tokenToPlayer.get(token)||state?.players.find(p=>p.networkToken===token)?.id;
  if(!playerId||!command)return;
  try{applyGameCommand({...command,playerId},true);}catch(err){network.sendNotice(token,err.message);}
}
function networkStatus(s){if(s.kind==='error'||s.kind==='connection-error')toast(s.error?.message||'Network connection problem.');if(s.kind==='closed')toast('Disconnected from host. Rejoin with the same room code to reconnect.');if(s.kind==='notice')toast(s.message);}
function renderLobby(){
  $('lobbyPlayers').innerHTML=lobbyPlayers.map((p,i)=>`<div class="lobby-seat"><span>${i+1}. ${escapeHtml(p.name)}</span><span class="subtle">${p.type==='bot'?`${p.difficulty||'medium'} bot`:(p.token==='host'?'host':'connected')}</span></div>`).join('');
  $('launchOnlineButton').disabled=lobbyPlayers.length<2||lobbyPlayers.length>6;
}
function launchOnlineGame(){
  if(lobbyPlayers.length<2){toast('At least two seats are required.');return;}
  const players=lobbyPlayers.slice(0,6).map((p,i)=>({id:`p${i+1}`,name:p.name,type:p.type,difficulty:p.difficulty||'medium',networkToken:p.token,connected:true}));
  state=createGame({...lobbyConfig,players,seed:Date.now()},rng); localPlayerId='p1'; tokenToPlayer=new Map(players.filter(p=>p.networkToken&&p.networkToken!=='host').map(p=>[p.networkToken,p.id]));
  els.lobby.classList.add('hidden'); saveAndBroadcast(); render(); maybeAdvanceAutomation();
}

function startState(newState){state=newState;selectedFrom=selectedTo=null;lastCombat=null;els.start.classList.add('hidden');localSetupPlayerIndex=0;saveAndBroadcast();render();maybeAdvanceAutomation();}
function resumeSaved(){try{state=hydrateState(localStorage.getItem('frontiers-save'));networkRole='offline';els.start.classList.add('hidden');render();maybeAdvanceAutomation();}catch{toast('Saved game could not be loaded.');}}

function render(){
  if(!state)return;
  renderMap(); renderTopbar(); renderRoster(); renderActionPanel(); renderCombat(); renderCards(); renderHistory(); renderVictory(); updateTimer();
}
