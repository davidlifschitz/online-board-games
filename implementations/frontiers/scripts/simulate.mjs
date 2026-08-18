import { F } from '../tests/harness.mjs';
const {SeededRng,createGame,autoAllocateStartingArmies,runBotTurn}=F;
const winners={easy:0,medium:0,hard:0};
for(let seed=1;seed<=50;seed++){
  const count=2+((seed-1)%5),difficulties=['easy','medium','hard'];
  const players=Array.from({length:count},(_,i)=>({id:`p${i+1}`,name:`Bot ${i+1}`,type:'bot',difficulty:difficulties[(seed+i)%3]}));
  const rng=new SeededRng(seed*9973);const state=createGame({players,seed:seed*9973,winMode:'score',turnLimit:12},rng);autoAllocateStartingArmies(state,rng);
  let guard=0;while(!state.winner&&guard<180){runBotTurn(state,rng,8);for(const t of Object.values(state.territories)){if(!t.owner||t.armies<1)throw new Error(`Invalid territory state in seed ${seed}`);}guard++;}
  if(!state.winner)throw new Error(`Simulation ${seed} did not terminate`);
  const winner=state.players.find(p=>p.id===state.winner.playerId);winners[winner.difficulty]++;
}
console.log('50 seeded bot simulations (2–6 players):',winners);
