function attack(state, action, rng = new SeededRng(state.seed + state.turnNumber)) {
  if (state.phase !== 'attack') throw new Error('Not in attack phase.');
  const player = currentPlayer(state);
  const from = state.territories[action.from];
  const to = state.territories[action.to];
  if (!from || !to) throw new Error('Unknown territory.');
  if (from.owner !== player.id) throw new Error('Attack must start from your territory.');
  if (to.owner === player.id) throw new Error('Target must be enemy-held.');
  if (!ADJACENCY[action.from].includes(action.to)) throw new Error('Territories are not adjacent.');
  if (from.armies <= 1) throw new Error('Origin needs at least two armies.');
  const beforeOwner = to.owner;
  const result = resolveClash({
    attackerArmies:from.armies,
    defenderArmies:to.armies,
    attackCommit:Number(action.attackCommit||1),
    defendCommit:Number(action.defendCommit||1)
  }, rng);
  from.armies -= result.attackerLosses;
  to.armies -= result.defenderLosses;
  let captured = false;
  let moved = 0;
  if (to.armies <= 0) {
    const survivors = result.attackCommit - result.attackerLosses;
    if (survivors > 0 && from.armies > 1) {
      moved = Math.min(survivors, from.armies - 1);
      from.armies -= moved;
      to.owner = player.id;
      to.armies = moved;
      captured = true;
      state.conquestThisTurn = true;
      log(state, `${player.name} captured ${TERRITORY_BY_ID[action.to].name}.`);
      markEliminatedPlayers(state);
    } else {
      to.armies = 1;
    }
  }
  const victory = checkVictory(state,player.id);
  if (victory) state.winner = {playerId:player.id,reason:victory};
  return {...result,captured,moved,beforeOwner};
}

function endAttackPhase(state) {
  if (state.phase !== 'attack') throw new Error('Not in attack phase.');
  state.phase = 'fortify';
  return state;
}

function connectedOwnedPath(state, playerId, start, end) {
  if (start === end) return true;
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const id = queue.shift();
    for (const n of ADJACENCY[id]) {
      if (seen.has(n) || state.territories[n].owner !== playerId) continue;
      if (n === end) return true;
      seen.add(n); queue.push(n);
    }
  }
  return false;
}

function fortify(state, {from,to,amount}) {
  if (state.phase !== 'fortify') throw new Error('Not in fortification phase.');
  const p = currentPlayer(state);
  const a = state.territories[from], b = state.territories[to];
  if (!a || !b || a.owner !== p.id || b.owner !== p.id) throw new Error('Fortification must connect your territories.');
  if (!connectedOwnedPath(state,p.id,from,to)) throw new Error('No owned supply route connects those territories.');
  const move = Math.min(Math.max(1,Number(amount)||1),a.armies - 1);
  if (move <= 0) throw new Error('Origin must remain occupied.');
  a.armies -= move; b.armies += move;
  log(state, `${p.name} fortified ${TERRITORY_BY_ID[to].name} with ${move} armies.`);
  state.phase = 'turn-end';
  return state;
}

function skipFortify(state) {
  if (state.phase !== 'fortify') throw new Error('Not in fortification phase.');
  state.phase = 'turn-end';
  return state;
}

function drawConquestCard(state, playerId) {
  if (!state.conquestThisTurn) return null;
  if (!state.cardDeck.length && state.discard.length) {
    state.cardDeck = state.discard.splice(0);
  }
  const card = state.cardDeck.shift() || null;
  if (card) state.players.find(p => p.id === playerId)?.cards.push(card);
  return card;
}

function findRedeemableSet(cards) {
  if (!cards || cards.length < 3) return null;
  for (let i=0;i<cards.length;i++) for (let j=i+1;j<cards.length;j++) for (let k=j+1;k<cards.length;k++) {
    const group = [cards[i],cards[j],cards[k]];
    const wilds = group.filter(c => c.symbol === 'prism').length;
    const symbols = group.filter(c => c.symbol !== 'prism').map(c => c.symbol);
    const unique = new Set(symbols);
    const same = unique.size <= 1;
    const oneEach = unique.size + wilds === 3 && symbols.length === unique.size;
    if (same || oneEach) return [i,j,k];
  }
  return null;
}

function tradeBonusForIndex(index) { return index < TRADE_PROGRESS.length ? TRADE_PROGRESS[index] : TRADE_PROGRESS.at(-1) + 7 * (index - TRADE_PROGRESS.length + 1); }

function redeemCards(state, playerId, indexes = null) {
  if (state.phase !== 'reinforce') throw new Error('Cards may only be redeemed during reinforcement.');
  if (currentPlayer(state).id !== playerId) throw new Error('Not your turn.');
  const player = currentPlayer(state);
  const set = indexes || findRedeemableSet(player.cards);
  if (!set || set.length !== 3) throw new Error('No valid three-card set.');
  const cards = set.map(i => player.cards[i]);
  const probe = findRedeemableSet(cards);
  if (!probe) throw new Error('That card combination is not redeemable.');
  const bonus = tradeBonusForIndex(state.tradeCount);
  const sorted = [...set].sort((a,b)=>b-a);
  const removed = sorted.map(i => player.cards.splice(i,1)[0]);
  state.discard.push(...removed);
  state.tradeCount += 1;
  state.reinforcementPool += bonus;
  log(state, `${player.name} redeemed a frontier set for ${bonus} reinforcements.`);
  return bonus;
}

function endTurn(state) {
  if (!['fortify','turn-end'].includes(state.phase)) throw new Error('Finish attack before ending the turn.');
  const player = currentPlayer(state);
  drawConquestCard(state,player.id);
  const immediate = checkVictory(state,player.id);
  if (immediate) { state.winner = {playerId:player.id,reason:immediate}; return state; }
  const active = state.players.filter(p => !p.eliminated);
  let next = state.currentPlayerIndex;
  for (let i=0;i<state.players.length;i++) {
    next = (next + 1) % state.players.length;
    if (!state.players[next].eliminated) break;
  }
  if (next <= state.currentPlayerIndex) state.turnNumber += 1;
  state.currentPlayerIndex = next;
  if (state.settings.winMode === 'score' && state.turnNumber > state.settings.turnLimit) {
    const ranking = active.map(p => ({p,score:scorePlayer(state,p.id)})).sort((a,b)=>b.score-a.score);
    state.winner = {playerId:ranking[0].p.id,reason:`Highest score after ${state.settings.turnLimit} rounds`};
    return state;
  }
  beginReinforcement(state);
  return state;
}

function capitalCount(state, playerId) {
  const capitalIds = state.players.map(p => p.capital).filter(Boolean);
  return capitalIds.filter(id => state.territories[id]?.owner === playerId).length;
}

function missionComplete(state, playerId) {
  const p = state.players.find(p => p.id === playerId);
  if (!p?.mission) return false;
  if (p.mission.type === 'territories') return territoriesOwned(state,playerId).length >= p.mission.target;
  if (p.mission.type === 'regions') return regionsControlled(state,playerId).length >= p.mission.target;
  if (p.mission.type === 'capitals') return capitalCount(state,playerId) >= p.mission.target;
  if (p.mission.type === 'fortresses') return territoriesOwned(state,playerId).filter(id => state.territories[id].armies >= 5).length >= p.mission.target;
  return false;
}

function checkVictory(state, playerId) {
  const mode = state.settings.winMode;
  if (mode === 'domination' && territoriesOwned(state,playerId).length === TERRITORIES.length) return 'World domination';
  if (mode === 'capital') {
    const activeCount = state.players.filter(p => !p.eliminated).length;
    const threshold = Math.min(state.players.length, Math.max(2, Math.ceil(activeCount / 2) + 1));
    const p = state.players.find(p => p.id === playerId);
    if (p?.capital && state.territories[p.capital]?.owner === playerId && capitalCount(state,playerId) >= threshold) return `Capital ascendancy (${threshold} capitals)`;
  }
  if (mode === 'mission' && missionComplete(state,playerId)) return `Objective completed: ${state.players.find(p=>p.id===playerId).mission.label}`;
  return null;
}

function scorePlayer(state, playerId) {
  const territories = territoriesOwned(state,playerId).length;
  const regions = regionsControlled(state,playerId).length;
  const capitals = capitalCount(state,playerId);
  return territories + regions * 5 + capitals * 4 + Math.floor(armiesOwned(state,playerId) / 5);
}

function markEliminatedPlayers(state) {
  for (const p of state.players) {
    if (!p.eliminated && territoriesOwned(state,p.id).length === 0) {
      p.eliminated = true;
      log(state, `${p.name} has been pushed off the map.`);
    }
  }
}

function borderTerritories(state, playerId) {
  return territoriesOwned(state,playerId).filter(id => ADJACENCY[id].some(n => state.territories[n].owner !== playerId));
}

function threatLevel(state, playerId) {
  const owned = territoriesOwned(state,playerId).length || 1;
  return armiesOwned(state,playerId) / owned + regionsControlled(state,playerId).length * 2 + capitalCount(state,playerId) * 1.5;
}

function log(state, message) {
  state.history.unshift({turn:state.turnNumber,phase:state.phase,message,time:Date.now()});
  state.history = state.history.slice(0,80);
}

function serializeState(state) { return JSON.stringify(state); }
function hydrateState(json) { return typeof json === 'string' ? JSON.parse(json) : structuredClone(json); }
