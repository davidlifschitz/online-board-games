function renderCombat(){
  if(!lastCombat){els.combat.classList.add('hidden');return;}els.combat.classList.remove('hidden');
  const d=lastCombat;els.combat.innerHTML=`<div class="card-title-row"><h2>Clash result</h2><span class="subtle">${d.captured?'CAPTURED':'CONTESTED'}</span></div><div class="dice-row"><div class="dice-side"><h3>Attack</h3><div class="dice-list">${d.attackRolls.map(v=>`<span class="die ${v>=5?'hit':''}">${v}</span>`).join('')}</div></div><div class="dice-side"><h3>Defense</h3><div class="dice-list">${d.defendRolls.map(v=>`<span class="die ${v>=5?'hit':''}">${v}</span>`).join('')}</div></div></div><div class="combat-summary">Attack lost ${d.attackerLosses}; defense lost ${d.defenderLosses}.${d.captured?' Surviving committed armies crossed the border.':''}</div>`;
  requestAnimationFrame(()=>{const rows=els.combat.querySelectorAll('.dice-list');rows.forEach(x=>x.classList.add('rolling'));setTimeout(()=>rows.forEach(x=>x.classList.remove('rolling')),420);});
}
function renderCards(){
  if(!state.setup?.complete){els.cards.innerHTML='<h2>Frontier cards</h2><div class="action-copy">Cards unlock after setup.</div>';return;}
  const p=currentPlayer(state);const canAct=canLocalActFor(p.id);const set=findRedeemableSet(p.cards);
  els.cards.innerHTML=`<div class="card-title-row"><h2>Frontier cards</h2><span class="subtle">${p.cards.length}</span></div><div class="cards-row">${p.cards.length?p.cards.map(c=>`<div class="frontier-card"><div class="card-symbol">${symbolIcon[c.symbol]}</div><div class="card-name">${c.symbol}</div></div>`).join(''):'<span class="subtle">Conquer territory to earn a card.</span>'}</div>${state.phase==='reinforce'&&set?`<button class="button secondary full" id="redeemSet" ${canAct?'':'disabled'}>Redeem set</button>`:''}`;
  const b=$('redeemSet');if(b)b.onclick=()=>sendOrApply({kind:'redeem'});
}
function renderHistory(){els.historyCount.textContent=`${state.history.length} events`;els.history.innerHTML=state.history.slice(0,30).map(h=>`<li><span class="history-turn">R${h.turn}</span> ${escapeHtml(h.message)}</li>`).join('')||'<li>No moves yet.</li>';}
function renderVictory(){
  if(!state.winner){els.victory.classList.add('hidden');return;}const p=state.players.find(p=>p.id===state.winner.playerId);$('victoryTitle').textContent=`${p?.name||'A commander'} wins`;$('victoryReason').textContent=state.winner.reason;els.victory.classList.remove('hidden');
}

function onTerritoryClick(id){
  if(!state)return;showTerritoryInfo(id);
  if(state.phase==='draft'){const p=state.players[state.setup.draftIndex%state.players.length];if(canLocalActFor(p.id)&&p.type!=='bot')sendOrApply({kind:'draft',territoryId:id,playerId:p.id});return;}
  if(state.phase==='setup'){const p=nextSetupPlayer();if(p&&canLocalActFor(p.id)&&p.type!=='bot'&&state.territories[id].owner===p.id){const raw=$('setupAmount')?.value||'1';const amount=raw==='all'?state.setup.remaining[p.id]:Number(raw);sendOrApply({kind:'setupArmy',territoryId:id,amount,playerId:p.id});}return;}
  const p=currentPlayer(state);if(!canLocalActFor(p.id)||p.type==='bot')return;
  if(state.phase==='reinforce'){if(state.territories[id].owner!==p.id)return;const raw=$('reinforceAmount')?.value||'1';const amount=raw==='all'?state.reinforcementPool:Number(raw);sendOrApply({kind:'reinforce',territoryId:id,amount});return;}
  if(state.phase==='attack'){
    if(!selectedFrom){if(state.territories[id].owner===p.id&&state.territories[id].armies>1){selectedFrom=id;selectedTo=null;render();}return;}
    if(id===selectedFrom){selectedFrom=selectedTo=null;render();return;}
    if(state.territories[id].owner===p.id){selectedFrom=state.territories[id].armies>1?id:null;selectedTo=null;render();return;}
    if(validAttackTargets(state,selectedFrom,p.id).includes(id)){selectedTo=id;render();}return;
  }
  if(state.phase==='fortify'){
    if(state.territories[id].owner!==p.id)return;if(!selectedFrom){if(state.territories[id].armies>1)selectedFrom=id;}else if(id===selectedFrom){selectedFrom=null;selectedTo=null;}else selectedTo=id;render();
  }
}

function sendOrApply(command){
  if(networkRole==='guest'){network.sendCommand(command);return;}
  applyGameCommand(command,false);
}
function applyGameCommand(command,fromRemote){
  if(!state)return;const actingPlayerId=command.playerId||currentPlayer(state)?.id;
  if(command.kind!=='defense'&&state.setup?.complete&&actingPlayerId!==currentPlayer(state).id)throw new Error('That player is not active.');
  if(fromRemote&&networkRole==='host'){
    const p=state.players.find(p=>p.id===actingPlayerId);if(!p||p.type!=='human')throw new Error('Seat cannot send this action.');
  }
  switch(command.kind){
    case 'draft': draftTerritory(state,actingPlayerId,command.territoryId);break;
    case 'setupArmy': allocateStartingArmy(state,actingPlayerId,command.territoryId,command.amount);break;
    case 'reinforce': placeReinforcement(state,actingPlayerId,command.territoryId,command.amount);break;
    case 'defense': {const p=state.players.find(p=>p.id===actingPlayerId);if(!p)throw new Error('Unknown player.');const value=Number(command.value);p.defenseCommitment=Number.isFinite(value)?Math.min(3,Math.max(1,Math.round(value))):2;break;}
    case 'attack': {
      const targetOwner=state.players.find(p=>p.id===state.territories[command.to]?.owner); const defend=networkRole==='host'?targetOwner?.defenseCommitment:Number(command.defendCommit||targetOwner?.defenseCommitment||2);
      lastCombat=attack(state,{from:command.from,to:command.to,attackCommit:command.attackCommit,defendCommit:defend},rng);selectedFrom=command.from;selectedTo=null;break;
    }
    case 'endAttack': endAttackPhase(state);selectedFrom=selectedTo=null;break;
    case 'fortify': fortify(state,{from:command.from,to:command.to,amount:command.amount});selectedFrom=selectedTo=null;break;
    case 'skipFortify': skipFortify(state);selectedFrom=selectedTo=null;break;
    case 'redeem': redeemCards(state,actingPlayerId);break;
    case 'endTurn': endTurn(state);selectedFrom=selectedTo=null;lastCombat=null;break;
    default: throw new Error('Unknown game command.');
  }
  if(state.phase==='setup'&&Object.values(state.setup.remaining).every(v=>v===0)){finalizeSetup(state,rng);}
  saveAndBroadcast();render();maybeAdvanceAutomation();
}

function nextSetupPlayer(){if(!state||state.phase!=='setup')return null;return state.players.find(p=>(state.setup.remaining[p.id]||0)>0)||null;}
function autoAllocateCurrentSetupPlayer(playerId){
  const p=state.players.find(p=>p.id===playerId);if(!p)return;while((state.setup.remaining[playerId]||0)>0){const owned=territoriesOwned(state,playerId);const borders=owned.filter(id=>ADJACENCY[id].some(n=>state.territories[n].owner!==playerId));const pool=borders.length?borders:owned;const id=rng.pick(pool);allocateStartingArmy(state,playerId,id,1);}if(Object.values(state.setup.remaining).every(v=>v===0))finalizeSetup(state,rng);saveAndBroadcast();render();maybeAdvanceAutomation();
}
function autoDraftBot(){
  if(state.phase!=='draft')return;const p=state.players[state.setup.draftIndex%state.players.length];if(p.type!=='bot')return;const open=TERRITORIES.map(t=>t.id).filter(id=>!state.territories[id].owner);draftTerritory(state,p.id,rng.pick(open));saveAndBroadcast();render();maybeAdvanceAutomation();
}
function maybeAdvanceAutomation(){
  if(!state||state.winner)return;
  if(state.phase==='draft'){const p=state.players[state.setup.draftIndex%state.players.length];if(p?.type==='bot'&&networkRole!=='guest')setTimeout(autoDraftBot,380);return;}
  if(state.phase==='setup'){const p=nextSetupPlayer();if(p?.type==='bot'&&networkRole!=='guest')setTimeout(()=>autoAllocateCurrentSetupPlayer(p.id),350);return;}
  const p=currentPlayer(state);if(p?.type==='bot'&&networkRole!=='guest')setTimeout(()=>{if(currentPlayer(state).id!==p.id||state.winner)return;runBotTurn(state,rng,8);saveAndBroadcast();render();maybeAdvanceAutomation();},550);
}
function canLocalActFor(playerId){
  if(networkRole==='offline')return true;
  if(networkRole==='host')return playerId===localPlayerId||state?.players.find(p=>p.id===playerId)?.type==='bot';
  if(networkRole==='guest')return playerId===localPlayerId;
  return false;
}
function saveAndBroadcast(){
  if(!state)return;if(networkRole==='offline')localStorage.setItem('frontiers-save',serializeState(state));if(networkRole==='host')network.broadcastState(state);
}

function showTerritoryInfo(id){
  if(!state){els.hover.textContent=TERRITORY_BY_ID[id].name;return;}const meta=TERRITORY_BY_ID[id],t=state.territories[id],p=state.players.find(p=>p.id===t.owner);const neighbors=ADJACENCY[id].map(n=>TERRITORY_BY_ID[n].name).join(', ');els.hover.innerHTML=`<strong>${meta.name}</strong> · ${REGIONS[meta.region].name} · ${p?escapeHtml(p.name):'Unclaimed'} · ${t.armies} armies · borders ${escapeHtml(neighbors)}`;
}
function updateTimer(){
  clearInterval(timerTick);timerTick=null;if(!state?.setup?.complete||!state.settings.turnTimerSeconds||state.winner){els.timer.classList.add('hidden');return;}els.timer.classList.remove('hidden');lastTurnStamp=state.turnStartedAt||Date.now();
  const tick=()=>{const remain=Math.max(0,state.settings.turnTimerSeconds-Math.floor((Date.now()-lastTurnStamp)/1000));els.timer.textContent=`${remain}s`;if(remain===0&&networkRole!=='guest'){clearInterval(timerTick);handleTimerExpiry();}};tick();timerTick=setInterval(tick,1000);
}
function handleTimerExpiry(){
  if(!state||state.winner)return;const p=currentPlayer(state);try{
    if(state.phase==='reinforce'){while(state.reinforcementPool>0){const id=chooseReinforcementTarget(state,p.id,p.type==='bot'?p.difficulty:'medium',rng);placeReinforcement(state,p.id,id,Math.min(state.reinforcementPool,3));}}
    if(state.phase==='attack')endAttackPhase(state);
    if(state.phase==='fortify')skipFortify(state);
    if(state.phase==='turn-end')endTurn(state);
    toast(`${p.name}'s timer expired.`);saveAndBroadcast();render();maybeAdvanceAutomation();
  }catch(err){toast(err.message);}
}

function wireGlobalEvents(){
  document.querySelectorAll('.mode-tab').forEach(btn=>btn.onclick=()=>{setupMode=btn.dataset.mode;document.querySelectorAll('.mode-tab').forEach(x=>x.classList.toggle('active',x===btn));['local','host','join'].forEach(m=>$(`${m}Setup`).classList.toggle('hidden',m!==setupMode));});
  $('rulesButton').onclick=()=>els.rules.classList.remove('hidden');$('closeRules').onclick=()=>els.rules.classList.add('hidden');els.rules.addEventListener('click',e=>{if(e.target===els.rules)els.rules.classList.add('hidden');});
  $('newGameButton').onclick=()=>{network.close();networkRole='offline';state=null;selectedFrom=selectedTo=null;els.start.classList.remove('hidden');els.victory.classList.add('hidden');renderSetupForms();};
  $('resumeButton').onclick=resumeSaved;$('victoryNewGame').onclick=()=>{$('newGameButton').click();};
  $('sidebarToggle').onclick=()=>els.side.classList.toggle('open');
  $('addBotButton').onclick=()=>{if(lobbyPlayers.length<6){lobbyPlayers.push({name:`Bot ${lobbyPlayers.filter(p=>p.type==='bot').length+1}`,type:'bot',difficulty:'medium'});renderLobby();}};
  $('launchOnlineButton').onclick=launchOnlineGame;$('cancelLobbyButton').onclick=()=>{network.close();networkRole='offline';els.lobby.classList.add('hidden');els.start.classList.remove('hidden');};
  $('roomCodeButton').onclick=async()=>{try{await navigator.clipboard.writeText($('roomCodeButton').textContent);toast('Room code copied.');}catch{toast('Room code: '+$('roomCodeButton').textContent);}};
  $('zoomIn').onclick=()=>zoomMap(.82);$('zoomOut').onclick=()=>zoomMap(1.22);$('zoomReset').onclick=resetMap;
  const viewport=$('mapViewport');viewport.addEventListener('wheel',e=>{e.preventDefault();zoomMap(e.deltaY>0?1.12:.89);},{passive:false});
  viewport.addEventListener('pointerdown',onPointerDown);viewport.addEventListener('pointermove',onPointerMove);viewport.addEventListener('pointerup',onPointerUp);viewport.addEventListener('pointercancel',onPointerUp);
}
function onPointerDown(e){const vp=$('mapViewport');vp.setPointerCapture?.(e.pointerId);pointerState.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointerState.size===1)dragStart={x:e.clientX,y:e.clientY,view:{...mapView}};else if(pointerState.size===2){const pts=[...pointerState.values()];pinchStart={distance:dist(pts[0],pts[1]),view:{...mapView}};}}
function onPointerMove(e){if(!pointerState.has(e.pointerId))return;pointerState.set(e.pointerId,{x:e.clientX,y:e.clientY});const vp=$('mapViewport');if(pointerState.size===2&&pinchStart){const pts=[...pointerState.values()],d=dist(pts[0],pts[1]);const scale=pinchStart.distance/d;const nw=clamp(pinchStart.view.w*scale,330,1020),nh=nw*(650/1020);mapView.w=nw;mapView.h=nh;mapView.x=clamp(pinchStart.view.x+(pinchStart.view.w-nw)/2,0,1020-nw);mapView.y=clamp(pinchStart.view.y+(pinchStart.view.h-nh)/2,0,650-nh);applyView();return;}if(pointerState.size===1&&dragStart){const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;const sx=dragStart.view.w/vp.clientWidth,sy=dragStart.view.h/vp.clientHeight;mapView.x=clamp(dragStart.view.x-dx*sx,0,1020-mapView.w);mapView.y=clamp(dragStart.view.y-dy*sy,0,650-mapView.h);applyView();}}
function onPointerUp(e){pointerState.delete(e.pointerId);if(pointerState.size<2)pinchStart=null;if(pointerState.size===0)dragStart=null;}
function zoomMap(factor){const nw=clamp(mapView.w*factor,330,1020),nh=nw*(650/1020);mapView.x=clamp(mapView.x+(mapView.w-nw)/2,0,1020-nw);mapView.y=clamp(mapView.y+(mapView.h-nh)/2,0,650-nh);mapView.w=nw;mapView.h=nh;applyView();}
function resetMap(){mapView={x:0,y:0,w:1020,h:650};applyView();}function applyView(){els.map.setAttribute('viewBox',`${mapView.x} ${mapView.y} ${mapView.w} ${mapView.h}`);}function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function centroid(points){const pts=points.trim().split(/\s+/).map(p=>p.split(',').map(Number));return [pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length];}
function setBusy(el,busy,label){el.disabled=busy;el.textContent=label;}function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
let toastTimer;function toast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2600);}

boot();
