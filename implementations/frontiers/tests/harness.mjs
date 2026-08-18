import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const parts=['map.js','engine-a.js','engine-b.js','bots.js'].map(name=>fs.readFileSync(path.join(dir,name),'utf8'));
const expose=`\nglobalThis.FrontiersTest={REGIONS,TERRITORIES,TERRITORY_BY_ID,ADJACENCY,REGION_TERRITORIES,STARTING_ARMIES,SeededRng,SequenceRng,createGame,draftTerritory,autoAllocateStartingArmies,finalizeSetup,armiesOwned,calculateReinforcements,regionsControlled,resolveClash,attack,fortify,findRedeemableSet,tradeBonusForIndex,redeemCards,checkVictory,endTurn,currentPlayer,scoreAttackHard,runBotTurn,shouldHardBotRedeem};`;
const context=vm.createContext({console,structuredClone,Date,Math,Map,Set,Array,Object,Number,String,Boolean,JSON,Error,RegExp});
vm.runInContext(parts.join('\n')+expose,context,{filename:'frontiers-runtime.js'});
export const F=context.FrontiersTest;
