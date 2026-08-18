
const PLAYER_COLORS = ['#ef6a5b','#4d9de0','#6bbf59','#f0b44d','#9b6fd3','#4db6ac'];
const CARD_SYMBOLS = ['forge','beacon','aegis'];
const TRADE_PROGRESS = [4, 6, 9, 13, 18, 24];
const STARTING_ARMIES = {2: 32, 3: 28, 4: 24, 5: 21, 6: 19};

class SeededRng {
  constructor(seed = 1) { this.state = (Number(seed) >>> 0) || 1; }
  next() {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const out = ((t ^ t >>> 14) >>> 0) / 4294967296;
    this.state >>>= 0;
    return out;
  }
  int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  pick(items) { return items[Math.floor(this.next() * items.length)]; }
}

class SequenceRng {
  constructor(values = [0.5]) { this.values = values; this.i = 0; }
  next() { const v = this.values[this.i % this.values.length]; this.i += 1; return Math.max(0, Math.min(0.999999, v)); }
  int(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  pick(items) { return items[Math.floor(this.next() * items.length)]; }
}

function deepClone(value) { return structuredClone(value); }
function shuffle(items, rng) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function normalizePlayers(rawPlayers) {
  if (!Array.isArray(rawPlayers) || rawPlayers.length < 2 || rawPlayers.length > 6) throw new Error('Frontiers supports 2–6 players.');
  return rawPlayers.map((p, i) => ({
    id: p.id || `p${i+1}`,
    name: String(p.name || `Player ${i+1}`).slice(0, 24),
    type: p.type === 'bot' ? 'bot' : 'human',
    difficulty: ['easy','medium','hard'].includes(p.difficulty) ? p.difficulty : 'medium',
    color: p.color || PLAYER_COLORS[i],
    cards: [],
    capital: null,
    mission: null,
    connected: p.connected !== false,
    networkToken: p.networkToken || null,
    defenseCommitment: Math.min(3, Math.max(1, Number(p.defenseCommitment || 2))),
    eliminated: false
  }));
}

function createGame(options = {}, rng = new SeededRng(options.seed || Date.now())) {
  const players = normalizePlayers(options.players || [{name:'Player 1'},{name:'Player 2',type:'bot'}]);
  const assignment = options.assignment === 'draft' ? 'draft' : 'random';
  const winMode = ['domination','capital','mission','score'].includes(options.winMode) ? options.winMode : 'domination';
  const state = {
    version: 1,
    seed: options.seed || rng.state || 1,
    players,
    territories: Object.fromEntries(TERRITORIES.map(t => [t.id,{owner:null,armies:0}])),
    setup: { assignment, draftIndex: 0, remaining: {}, complete: false },
    phase: assignment === 'draft' ? 'draft' : 'setup',
    currentPlayerIndex: 0,
    turnNumber: 0,
    reinforcementPool: 0,
    conquestThisTurn: false,
    tradeCount: 0,
    cardDeck: buildCardDeck(rng),
    discard: [],
    settings: {
      winMode,
      turnLimit: Math.max(10, Number(options.turnLimit || 40)),
      turnTimerSeconds: Math.max(0, Number(options.turnTimerSeconds || 0))
    },
    winner: null,
    history: []
  };
  if (assignment === 'random') {
    assignRandomTerritories(state, rng);
    initializeStartingReserves(state);
  }
  return state;
}

function buildCardDeck(rng) {
  const deck = TERRITORIES.map((territory, i) => ({
    id: `card-${territory.id}`,
    territoryId: territory.id,
    symbol: CARD_SYMBOLS[i % CARD_SYMBOLS.length]
  }));
  deck.push({id:'wild-prism-1',territoryId:null,symbol:'prism'},{id:'wild-prism-2',territoryId:null,symbol:'prism'});
  return shuffle(deck, rng);
}

function assignRandomTerritories(state, rng) {
  const ids = shuffle(TERRITORIES.map(t => t.id), rng);
  ids.forEach((id, i) => {
    const p = state.players[i % state.players.length];
    state.territories[id] = { owner: p.id, armies: 1 };
  });
  state.phase = 'setup';
  log(state, 'Territories scattered across the frontier.');
  return state;
}

function draftTerritory(state, playerId, territoryId) {
  if (state.phase !== 'draft') throw new Error('Not in draft phase.');
  const current = state.players[state.setup.draftIndex % state.players.length];
  if (!current || current.id !== playerId) throw new Error('Not this player’s draft pick.');
  if (!state.territories[territoryId] || state.territories[territoryId].owner) throw new Error('Territory is not available.');
  state.territories[territoryId] = {owner:playerId,armies:1};
  state.setup.draftIndex += 1;
  if (Object.values(state.territories).every(t => t.owner)) {
    state.phase = 'setup';
    initializeStartingReserves(state);
  }
  return state;
}

function initializeStartingReserves(state) {
  const total = STARTING_ARMIES[state.players.length];
  for (const p of state.players) {
    state.setup.remaining[p.id] = Math.max(0, total - territoriesOwned(state,p.id).length);
  }
  state.phase = 'setup';
}

function allocateStartingArmy(state, playerId, territoryId, amount = 1) {
  if (state.phase !== 'setup') throw new Error('Starting allocation is closed.');
  const territory = state.territories[territoryId];
  if (!territory || territory.owner !== playerId) throw new Error('Choose one of your territories.');
  const remaining = state.setup.remaining[playerId] || 0;
  const spend = Math.min(Math.max(1, Number(amount) || 1), remaining);
  if (spend <= 0) throw new Error('No starting armies remain.');
  territory.armies += spend;
  state.setup.remaining[playerId] -= spend;
  return state;
}

function autoAllocateStartingArmies(state, rng = new SeededRng(state.seed)) {
  for (const p of state.players) {
    while ((state.setup.remaining[p.id] || 0) > 0) {
      const owned = territoriesOwned(state,p.id);
      const borders = owned.filter(id => ADJACENCY[id].some(n => state.territories[n].owner !== p.id));
      const choicePool = borders.length ? borders : owned;
      const target = rng.pick(choicePool);
      state.territories[target].armies += 1;
      state.setup.remaining[p.id] -= 1;
    }
  }
  finalizeSetup(state, rng);
  return state;
}

function finalizeSetup(state, rng = new SeededRng(state.seed)) {
  if (state.phase !== 'setup') throw new Error('Not in setup allocation.');
  if (Object.values(state.setup.remaining).some(v => v > 0)) throw new Error('All starting armies must be allocated.');
  for (const p of state.players) {
    const owned = territoriesOwned(state,p.id).sort((a,b) => state.territories[b].armies - state.territories[a].armies);
    p.capital = owned[0] || null;
    p.mission = createMissionForPlayer(state,p.id,rng);
  }
  state.setup.complete = true;
  state.currentPlayerIndex = 0;
  state.turnNumber = 1;
  beginReinforcement(state);
  log(state, `${currentPlayer(state).name} begins the first frontier turn.`);
  return state;
}

function createMissionForPlayer(state, playerId, rng) {
  const candidates = [
    {type:'territories',target:14,label:'Hold 14 territories at once'},
    {type:'regions',target:2,label:'Control any 2 complete regions'},
    {type:'capitals',target:2,label:'Control 2 capitals at once'},
    {type:'fortresses',target:5,label:'Hold 5 territories with at least 5 armies'}
  ];
  return structuredClone(rng.pick(candidates));
}

function currentPlayer(state) { return state.players[state.currentPlayerIndex]; }
function territoriesOwned(state, playerId) { return Object.entries(state.territories).filter(([,v]) => v.owner === playerId).map(([id]) => id); }
function armiesOwned(state, playerId) { return territoriesOwned(state,playerId).reduce((sum,id) => sum + state.territories[id].armies,0); }
function regionsControlled(state, playerId) {
  return Object.entries(REGION_TERRITORIES).filter(([,ids]) => ids.every(id => state.territories[id].owner === playerId)).map(([r]) => r);
}

function calculateReinforcements(state, playerId) {
  const owned = territoriesOwned(state,playerId).length;
  const base = Math.max(3, Math.floor(owned / 4));
  const regionBonus = regionsControlled(state,playerId).reduce((sum,r) => sum + REGIONS[r].bonus,0);
  return {base, regionBonus, total: base + regionBonus};
}

function beginReinforcement(state) {
  state.phase = 'reinforce';
  state.conquestThisTurn = false;
  const p = currentPlayer(state);
  const reinf = calculateReinforcements(state,p.id);
  state.reinforcementPool = reinf.total;
  state.turnStartedAt = Date.now();
  log(state, `${p.name} receives ${reinf.total} reinforcements (${reinf.base} frontier + ${reinf.regionBonus} region).`);
  return state;
}

function placeReinforcement(state, playerId, territoryId, amount = 1) {
  if (state.phase !== 'reinforce') throw new Error('Not in reinforcement phase.');
  if (currentPlayer(state).id !== playerId) throw new Error('Not your turn.');
  const territory = state.territories[territoryId];
  if (!territory || territory.owner !== playerId) throw new Error('Reinforce one of your territories.');
  const spend = Math.min(Math.max(1, Number(amount)||1), state.reinforcementPool);
  if (spend <= 0) throw new Error('No reinforcements remain.');
  territory.armies += spend;
  state.reinforcementPool -= spend;
  if (state.reinforcementPool === 0) state.phase = 'attack';
  return state;
}

function validAttackTargets(state, fromId, playerId) {
  if (state.territories[fromId]?.owner !== playerId || state.territories[fromId].armies <= 1) return [];
  return ADJACENCY[fromId].filter(id => state.territories[id].owner !== playerId);
}

function resolveClash({attackerArmies, defenderArmies, attackCommit, defendCommit}, rng) {
  if (attackerArmies < 2) throw new Error('Attacker must leave one army behind.');
  const requestedAttack = Number(attackCommit);
  const requestedDefense = Number(defendCommit);
  const aCommit = Math.min(Math.max(1, Number.isFinite(requestedAttack) ? Math.round(requestedAttack) : 1), 4, attackerArmies - 1);
  const dCommit = Math.min(Math.max(1, Number.isFinite(requestedDefense) ? Math.round(requestedDefense) : 1), 3, defenderArmies);
  const attackRolls = Array.from({length:aCommit},() => rng.int(1,6));
  const defendRolls = Array.from({length:dCommit},() => rng.int(1,6));
  let attackHits = attackRolls.filter(v => v >= 5).length;
  let defendHits = defendRolls.filter(v => v >= 5).length;
  if (attackHits === 0 && defendHits === 0) {
    const aHigh = Math.max(...attackRolls), dHigh = Math.max(...defendRolls);
    if (aHigh > dHigh) attackHits = 1;
    else if (dHigh > aHigh) defendHits = 1;
    else { attackHits = 1; defendHits = 1; }
  }
  const defenderLosses = Math.min(defenderArmies, attackHits);
  const attackerLosses = Math.min(aCommit, defendHits);
  return {attackCommit:aCommit,defendCommit:dCommit,attackRolls,defendRolls,attackHits,defendHits,attackerLosses,defenderLosses};
}

