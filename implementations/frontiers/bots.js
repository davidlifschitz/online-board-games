
function playerById(state,id){ return state.players.find(p=>p.id===id); }
function ownedNeighbors(state,id,playerId){ return ADJACENCY[id].filter(n=>state.territories[n].owner===playerId); }
function enemyNeighbors(state,id,playerId){ return ADJACENCY[id].filter(n=>state.territories[n].owner!==playerId); }
function regionCompletionPotential(state, playerId, targetId) {
  const region = Object.entries(REGION_TERRITORIES).find(([,ids])=>ids.includes(targetId));
  if (!region) return 0;
  const [,ids] = region;
  const owned = ids.filter(id=>state.territories[id].owner===playerId).length;
  return owned / ids.length;
}
function chokepointValue(state, targetId) {
  const targetOwner = state.territories[targetId].owner;
  const distinctOwners = new Set(ADJACENCY[targetId].map(n=>state.territories[n].owner).filter(Boolean));
  return Math.max(0, distinctOwners.size - 1) + Math.max(0, 3 - ADJACENCY[targetId].length) * 0.35 + (targetOwner ? 0.2 : 0);
}


function shouldHardBotRedeem(state, playerId) {
  const p=playerById(state,playerId);
  if(!p||!findRedeemableSet(p.cards)) return false;
  if(p.cards.length>=5) return true;
  const bonus=tradeBonusForIndex(state.tradeCount);
  const owned=territoriesOwned(state,playerId);
  const borders=owned.filter(id=>enemyNeighbors(state,id,playerId).length);
  const ownBorderPower=borders.reduce((sum,id)=>sum+state.territories[id].armies,0)||1;
  const enemyBorderPower=borders.reduce((sum,id)=>sum+enemyNeighbors(state,id,playerId).reduce((n,e)=>n+state.territories[e].armies,0),0);
  const incomingPressure=enemyBorderPower/ownBorderPower;
  const nearRegion=Object.values(REGION_TERRITORIES).some(ids=>{
    const count=ids.filter(id=>state.territories[id].owner===playerId).length;
    return count===ids.length-1;
  });
  const attackOpportunity=owned.some(id=>
    validAttackTargets(state,id,playerId).some(target=>state.territories[id].armies+bonus-1>state.territories[target].armies*1.4)
  );
  return incomingPressure>=1.25 || nearRegion || (bonus>=9 && attackOpportunity);
}
function chooseDefense(state, territoryId, difficulty='medium', rng) {
  const armies = state.territories[territoryId].armies;
  if (difficulty === 'easy') return rng.int(1,Math.min(3,armies));
  if (difficulty === 'medium') return Math.min(2,armies);
  return Math.min(3,armies);
}

function scoreAttackHard(state, playerId, fromId, targetId) {
  const from = state.territories[fromId];
  const target = state.territories[targetId];
  const enemyWeakness = (from.armies - 1) - target.armies * 1.15;
  const regionCompletion = regionCompletionPotential(state,playerId,targetId) * 6;
  const choke = chokepointValue(state,targetId) * 1.7;
  const ownerThreat = target.owner ? threatLevel(state,target.owner) : 0;
  const reinforcementEfficiency = Math.min(3,(from.armies-1)/Math.max(1,target.armies)) * 1.25;
  const borderRelief = enemyNeighbors(state,fromId,playerId).length > 1 ? 0.7 : 0;
  return enemyWeakness + regionCompletion + choke + ownerThreat * 0.18 + reinforcementEfficiency + borderRelief;
}

function chooseReinforcementTarget(state, playerId, difficulty, rng) {
  const borders = borderTerritories(state,playerId);
  const owned = territoriesOwned(state,playerId);
  const pool = borders.length ? borders : owned;
  if (difficulty === 'easy') return rng.pick(pool);
  const scored = pool.map(id=>{
    const t=state.territories[id];
    const enemyPower=enemyNeighbors(state,id,playerId).reduce((s,n)=>s+state.territories[n].armies,0);
    const regionNeed = regionCompletionPotential(state,playerId,id);
    const score = enemyPower - t.armies*0.6 + regionNeed*2 + chokepointValue(state,id);
    return {id,score};
  }).sort((a,b)=>b.score-a.score);
  if (difficulty === 'medium') return scored[Math.min(scored.length-1,rng.int(0,Math.min(2,scored.length-1)))].id;
  return scored[0].id;
}

function chooseAttack(state, playerId, difficulty, rng) {
  const options=[];
  for(const fromId of territoriesOwned(state,playerId)){
    for(const targetId of validAttackTargets(state,fromId,playerId)){
      const from=state.territories[fromId], target=state.territories[targetId];
      if(difficulty==='easy') options.push({from:fromId,to:targetId,score:rng.next()});
      else if(difficulty==='medium') options.push({from:fromId,to:targetId,score:(from.armies-target.armies)+regionCompletionPotential(state,playerId,targetId)*3+rng.next()});
      else options.push({from:fromId,to:targetId,score:scoreAttackHard(state,playerId,fromId,targetId)});
    }
  }
  if(!options.length) return null;
  options.sort((a,b)=>b.score-a.score);
  const best=options[0];
  const threshold = difficulty==='easy' ? 0.42 : difficulty==='medium' ? 0.3 : 0.65;
  if(difficulty!=='easy' && best.score < threshold) return null;
  if(difficulty==='easy' && rng.next()<0.35) return null;
  const from=state.territories[best.from];
  const target=state.territories[best.to];
  const maxCommit=Math.min(4,from.armies-1);
  const attackCommit=difficulty==='easy'?rng.int(1,maxCommit):Math.max(1,Math.min(maxCommit,target.armies+1));
  const defender=playerById(state,target.owner);
  const defendCommit=chooseDefense(state,best.to,defender?.difficulty||'medium',rng);
  return {...best,attackCommit,defendCommit};
}

function chooseFortification(state, playerId, difficulty, rng) {
  const borders=borderTerritories(state,playerId);
  if(!borders.length) return null;
  const interior=territoriesOwned(state,playerId).filter(id=>!borders.includes(id)&&state.territories[id].armies>1);
  const sources=interior.length?interior:territoriesOwned(state,playerId).filter(id=>state.territories[id].armies>2);
  if(!sources.length) return null;
  const target=[...borders].sort((a,b)=>{
    const ta=enemyNeighbors(state,a,playerId).reduce((s,n)=>s+state.territories[n].armies,0)-state.territories[a].armies;
    const tb=enemyNeighbors(state,b,playerId).reduce((s,n)=>s+state.territories[n].armies,0)-state.territories[b].armies;
    return tb-ta;
  })[0];
  const source=sources.find(s=>s!==target&&reachableOwned(state,playerId,s,target));
  if(!source) return null;
  const amount=difficulty==='easy'?1:Math.max(1,Math.floor((state.territories[source].armies-1)/2));
  return {from:source,to:target,amount};
}
function reachableOwned(state,pid,start,end){
  const seen=new Set([start]), q=[start];
  while(q.length){const id=q.shift();for(const n of ownedNeighbors(state,id,pid)){if(n===end)return true;if(!seen.has(n)){seen.add(n);q.push(n);}}}
  return false;
}

function runBotTurn(state, rng, maxAttacks=10) {
  const p=currentPlayer(state);
  if(p.type!=='bot') throw new Error('Current player is not a bot.');
  const difficulty=p.difficulty||'medium';
  if(state.phase==='reinforce'){
    if(difficulty==='hard'&&shouldHardBotRedeem(state,p.id)) redeemCards(state,p.id);
    while(state.reinforcementPool>0){
      const id=chooseReinforcementTarget(state,p.id,difficulty,rng);
      const amount=difficulty==='hard'?Math.min(state.reinforcementPool,Math.max(1,Math.ceil(state.reinforcementPool/3))):1;
      placeReinforcement(state,p.id,id,amount);
    }
  }
  let attacks=0;
  while(state.phase==='attack'&&attacks<maxAttacks&&!state.winner){
    const move=chooseAttack(state,p.id,difficulty,rng);
    if(!move)break;
    attack(state,move,rng);attacks++;
  }
  if(state.phase==='attack')endAttackPhase(state);
  if(state.phase==='fortify'){
    const move=chooseFortification(state,p.id,difficulty,rng);
    if(move){ try{fortify(state,move);}catch{skipFortify(state);} } else skipFortify(state);
  }
  if(!state.winner&&state.phase==='turn-end') endTurn(state);
  return {attacks, playerId:p.id, reinforcement:calculateReinforcements(state,p.id), regions:regionsControlled(state,p.id), armies:armiesOwned(state,p.id)};
}
