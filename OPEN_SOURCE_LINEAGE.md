# Open-source lineage for the live collection

The live collection follows a permissive-upstream-only rule for copied or materially adapted code/data. Copyleft or unlicensed repositories may be studied for independent mechanics understanding, but their code, data, artwork, and text are not copied into this Apache-2.0 repository.

`upstreams.json` is the machine-readable source of truth. `audited` means a source was used only as a rules/regression/reference baseline; `adapted-v1` means permissively licensed implementation ideas/code/data were materially adapted; `independent` means no sufficiently useful permissive baseline was selected.

| Game | Permissive baseline | License | Status | Use |
|---|---|---|---|---|
| Deal Room | `Ads97/DealBench` | MIT | `adapted-v1` | State/rules baseline; original names and browser UX |
| DiscShift | `eigenfoo/otto-othello` | MIT | `adapted-v1` | Mobility/parity/stability AI concepts |
| Crown Jump | `felipersteles/checkers-with-ai` | MIT | `audited` | Rules and AI regression baseline |
| Five Dice | `sorenchr/yahtzeebot` | MIT | `audited` | Keeper/category strategy reference |
| HueBreak | `eperezcosano/Uno` | MIT | `audited` | Shedding-card flow regression reference |
| Threadmark | `stepmat/Codenames_GPT` | MIT | `audited` | Team word-game state/AI reference |
| Fourfront | `kbennett2000/lan-games` | MIT | `audited` | Legality/win regression baseline |
| Frontiers | `argosopentech/Conquest` + `kbennett2000/lan-games` | MIT | `audited` | Phase/battle/reinforcement reference |
| Tilebound | `DinnerBuffet/TTSCarcassonne` | MIT | `adapted-v1` | Structured tile edge/feature data |
| Mergefront | `gabrielecirulli/2048` + `mateuszsokola/2048-in-react` | MIT | `audited` | Merge ordering/browser interaction reference |
| Boxline | `aqeelanwar/Dots-and-Boxes` + `rolyatmax/dots` | MIT | `audited` | Rules/scoring/AI/browser reference |
| Sowstone | `josephsivits/mancala-js` + `OguzhanUmutlu/webmancala` | MIT | `audited` | Mancala/Kalah turn-flow reference |
| Cipherloom | `nuragic/MastermindJS` + `geobalas/colorbreaker` | MIT | `audited` | Feedback/browser game-loop reference |
| Spark Six | `Varrus/JMFarkle` + `opub/farkle` | MIT | `audited` | Scoring and roll/keep/bank reference |

## Batch 1

Mergefront, Boxline, Sowstone, Cipherloom, and Spark Six are independently implemented browser games. Their selected MIT upstreams are regression/mechanics/UX references only; no upstream source code or artwork was copied. Each includes `THIRD_PARTY_NOTICES.md`.

## Migration policy

1. Preserve original names, visuals, artwork, word packs, maps, and UX unless a specific upstream asset is compatibly licensed and intentionally adopted.
2. Prefer rules engines, tests, state models, AI evaluation methods, and structured game data over presentation assets.
3. Preserve stronger browser functionality such as offline/PWA support, local modes, online rooms, accessibility, and custom variants.
4. Keep required upstream notices beside any game where code or structured data is materially adapted.
5. Never label a game `adapted-v1` merely because a permissive implementation exists.
