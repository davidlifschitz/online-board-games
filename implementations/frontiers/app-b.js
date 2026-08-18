function renderMap(){
  const current=state.setup?.complete?currentPlayer(state):null;
  for(const poly of els.territoryLayer.querySelectorAll('.territory')){
    const id=poly.dataset.id,t=state.territories[id],meta=TERRITORY_BY_ID[id],owner=state.players.find(p=>p.id===t.owner);
    poly.setAttribute('fill',owner?.color||'#1f3a43'); poly.setAttribute('stroke',REGIONS[meta.region].color);
    poly.classList.toggle('selected',id===selectedFrom||id===selectedTo);
    const targetable=state.phase==='attack'&&selectedFrom&&validAttackTargets(state,selectedFrom,current?.id).includes(id); poly.classList.toggle('targetable',targetable);
    poly.classList.toggle('dim',Boolean(selectedFrom)&&state.phase==='attack'&&id!==selectedFrom&&!targetable);
  }
  els.counterLayer.innerHTML='';
  for(const meta of TERRITORIES){
    const t=state.territories[meta.id]; if(!t.owner)continue; const [x,y]=centroid(meta.points); const owner=state.players.find(p=>p.id===t.owner); const isCapital=state.players.some(p=>p.capital===meta.id);
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('army-counter');g.setAttribute('transform',`translate(${x} ${y})`);g.style.pointerEvents='none';
    if(isCapital){const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');ring.setAttribute('r','18');ring.classList.add('capital-ring');g.appendChild(ring);}
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('r','13');c.setAttribute('fill',owner?.color||'#49656d');g.appendChild(c);
    const tx=document.createElementNS('http://www.w3.org/2000/svg','text');tx.textContent=t.armies;g.appendChild(tx);els.counterLayer.appendChild(g);
  }
  els.arrowLayer.innerHTML='';
  if(selectedFrom&&selectedTo){const a=centroid(TERRITORY_BY_ID[selectedFrom].points),b=centroid(TERRITORY_BY_ID[selectedTo].points);const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',a[0]);line.setAttribute('y1',a[1]);line.setAttribute('x2',b[0]);line.setAttribute('y2',b[1]);line.classList.add('attack-line');els.arrowLayer.appendChild(line);}
}
function renderTopbar(){
  els.phase.textContent=phaseName[state.phase]||state.phase;
  if(state.phase==='draft'){const p=state.players[state.setup.draftIndex%state.players.length];els.turn.textContent=`Draft pick · ${p.name}`;}
  else if(state.phase==='setup'){const p=nextSetupPlayer();els.turn.textContent=p?`Starting armies · ${p.name}`:'Starting armies';}
  else {const p=currentPlayer(state);els.turn.textContent=`Round ${state.turnNumber} · ${p.name}`;}
}
function renderRoster(){
  const current=state.setup?.complete?currentPlayer(state):null;
  els.roster.innerHTML=`<div class="card-title-row"><h2>Commanders</h2><span class="subtle">${state.players.filter(p=>!p.eliminated).length} active</span></div><div class="roster">${state.players.map(p=>{
    const terr=territoriesOwned(state,p.id).length,score=scorePlayer(state,p.id);return `<div class="player-row ${current?.id===p.id?'active':''} ${p.eliminated?'eliminated':''}"><span class="player-dot" style="background:${p.color}"></span><div><div class="player-name">${escapeHtml(p.name)} ${p.type==='bot'?`· ${p.difficulty}`:''}</div><div class="player-meta">${terr} territories · ${regionsControlled(state,p.id).length} regions${!p.connected?` · <span class="disconnect-badge">offline</span>`:''}</div></div><div class="player-score">${score} pts</div></div>`;}).join('')}</div>${networkRole==='host'&&state.players.some(p=>!p.connected&&p.type==='human')?'<button class="button danger full" id="replaceDisconnected">Replace disconnected with bots</button>':''}`;
  const replace=$('replaceDisconnected');if(replace)replace.onclick=()=>{for(const p of state.players){if(!p.connected&&p.type==='human'){p.type='bot';p.difficulty='medium';p.name+=` · Bot`;}}saveAndBroadcast();render();maybeAdvanceAutomation();};
}
function renderActionPanel(){
  if(state.phase==='draft'){renderDraftActions();return;}if(state.phase==='setup'){renderSetupAllocation();return;}
  const p=currentPlayer(state); const canAct=canLocalActFor(p.id);
  let html=`<div class="card-title-row"><h2>${phaseName[state.phase]}</h2><span class="subtle">${escapeHtml(p.name)}</span></div>`;
  if(state.phase==='reinforce'){
    const calc=calculateReinforcements(state,p.id);html+=`<div class="action-heading">${state.reinforcementPool} armies to deploy</div><div class="action-copy">Base ${calc.base} + regions ${calc.regionBonus}. Tap one of your territories to place armies.</div><div class="control-grid"><div class="field"><label>Deploy amount</label><select id="reinforceAmount"><option>1</option><option>3</option><option>5</option><option value="all">All remaining</option></select></div><div class="field"><label>Defense stance</label>${defenseSelect(p,canAct)}</div></div>`;
  }else if(state.phase==='attack'){
    html+=`<div class="action-heading">Choose a frontier to press</div><div class="action-copy">${selectedFrom?`From ${TERRITORY_BY_ID[selectedFrom].name}. Tap an adjacent enemy territory.`:'Tap one of your territories with 2+ armies, then an adjacent enemy.'}</div>`;
    if(selectedFrom&&selectedTo&&canAct){const from=state.territories[selectedFrom],target=state.territories[selectedTo],def=state.players.find(x=>x.id===target.owner);const defenseControl=networkRole==='offline'?`<select id="defendCommit">${Array.from({length:Math.min(3,target.armies)},(_,i)=>`<option ${i+1===(def?.defenseCommitment||2)?'selected':''}>${i+1}</option>`).join('')}</select>`:`<div class="locked-value">${Math.min(target.armies,def?.defenseCommitment||2)} armies · defender stance</div>`;html+=`<div class="control-grid"><div class="field"><label>Attack commit</label><select id="attackCommit">${Array.from({length:Math.min(4,from.armies-1)},(_,i)=>`<option>${i+1}</option>`).join('')}</select></div><div class="field"><label>${escapeHtml(def?.name||'Defender')} commits</label>${defenseControl}</div></div><button class="button primary full" id="resolveAttack">Resolve clash</button>`;}
    html+=`<div class="button-row"><button class="button ghost" id="clearAttack" ${selectedFrom?'':'disabled'}>Clear</button><button class="button secondary" id="endAttack" ${canAct?'':'disabled'}>End attacks</button></div>`;
  }else if(state.phase==='fortify'){
    html+=`<div class="action-heading">Shift along your supply line</div><div class="action-copy">Select an origin and destination you own. They may connect through any chain of friendly territories.</div><div class="control-grid"><div class="field"><label>Move armies</label><input id="fortifyAmount" class="input" type="number" value="1" min="1"></div><div class="field"><label>Defense stance</label>${defenseSelect(p,canAct)}</div></div><div class="button-row"><button class="button primary" id="doFortify" ${selectedFrom&&selectedTo&&canAct?'':'disabled'}>Fortify</button><button class="button ghost" id="skipFortify" ${canAct?'':'disabled'}>Skip</button></div>`;
  }else if(state.phase==='turn-end')html+=`<div class="action-heading">Field orders complete</div><div class="action-copy">End the turn. If you conquered territory, one Frontier card is drawn.</div><button class="button primary full" id="endTurn" ${canAct?'':'disabled'}>End turn</button>`;
  const seatPlayer = networkRole!=='offline' && localPlayerId ? state.players.find(x=>x.id===localPlayerId) : null;
  if(seatPlayer && seatPlayer.id!==p.id && seatPlayer.type==='human'){
    html+=`<div class="defense-stance-box"><div><strong>Your defense stance</strong><div class="action-copy">Used automatically if another online commander attacks your territory.</div></div>${seatDefenseSelect(seatPlayer)}</div>`;
  }
  if(networkRole==='guest'&&!canAct)html+=`<div class="action-copy">Waiting for ${escapeHtml(p.name)}.</div>`;
  els.action.innerHTML=html; wireActionControls(canAct,p);
}
function renderDraftActions(){
  const p=state.players[state.setup.draftIndex%state.players.length], canAct=canLocalActFor(p.id);els.action.innerHTML=`<h2>Territory draft</h2><div class="action-heading">${escapeHtml(p.name)} chooses</div><div class="action-copy">Tap any unclaimed territory. Picks rotate until the map is fully assigned.</div>${p.type==='bot'?'<div class="subtle">Bot is choosing…</div>':''}`;
}
function renderSetupAllocation(){
  const p=nextSetupPlayer();if(!p){try{finalizeSetup(state,rng);saveAndBroadcast();render();maybeAdvanceAutomation();}catch{}return;}
  localSetupPlayerIndex=state.players.indexOf(p);const remaining=state.setup.remaining[p.id]||0;const canAct=canLocalActFor(p.id);
  els.action.innerHTML=`<h2>Starting armies</h2><div class="action-heading">${escapeHtml(p.name)} · ${remaining} left</div><div class="action-copy">Tap owned territories to place reserves. Every territory already has one occupying army.</div><div class="control-grid"><div class="field"><label>Place</label><select id="setupAmount"><option>1</option><option>3</option><option>5</option><option value="all">All remaining</option></select></div><div class="field"><label>Quick setup</label><button class="button secondary" id="autoSetupOne" ${canAct?'':'disabled'}>Auto-place reserve</button></div></div>`;
  const b=$('autoSetupOne');if(b)b.onclick=()=>autoAllocateCurrentSetupPlayer(p.id);
}
function wireActionControls(canAct,p){
  const defense=$('defenseCommitment');if(defense)defense.onchange=()=>sendOrApply({kind:'defense',value:Number(defense.value),playerId:p.id});
  const seatDefense=$('seatDefenseCommitment');if(seatDefense)seatDefense.onchange=()=>sendOrApply({kind:'defense',value:Number(seatDefense.value),playerId:localPlayerId});
  const resolve=$('resolveAttack');if(resolve)resolve.onclick=()=>sendOrApply({kind:'attack',from:selectedFrom,to:selectedTo,attackCommit:Number($('attackCommit').value),defendCommit:Number($('defendCommit')?.value||1)});
  const clear=$('clearAttack');if(clear)clear.onclick=()=>{selectedFrom=selectedTo=null;render();};
  const endA=$('endAttack');if(endA)endA.onclick=()=>sendOrApply({kind:'endAttack'});
  const doF=$('doFortify');if(doF)doF.onclick=()=>sendOrApply({kind:'fortify',from:selectedFrom,to:selectedTo,amount:Number($('fortifyAmount').value)});
  const skip=$('skipFortify');if(skip)skip.onclick=()=>sendOrApply({kind:'skipFortify'});
  const end=$('endTurn');if(end)end.onclick=()=>sendOrApply({kind:'endTurn'});
}
function defenseSelect(p,enabled){return `<select id="defenseCommitment" ${enabled?'':'disabled'}><option value="1" ${p.defenseCommitment===1?'selected':''}>1 army</option><option value="2" ${p.defenseCommitment===2?'selected':''}>2 armies</option><option value="3" ${p.defenseCommitment===3?'selected':''}>3 armies</option></select>`;}
function seatDefenseSelect(p){return `<select id="seatDefenseCommitment"><option value="1" ${p.defenseCommitment===1?'selected':''}>1 army</option><option value="2" ${p.defenseCommitment===2?'selected':''}>2 armies</option><option value="3" ${p.defenseCommitment===3?'selected':''}>3 armies</option></select>`;}

