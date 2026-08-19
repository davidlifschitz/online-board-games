# Open-source lineage for the live collection

The live collection uses a **permissive-upstream-only** rule for code and structured data adaptation. MIT/Apache/CC0-style sources may be adapted with required notices. GPL/AGPL sources and repositories without a clear license may be studied for interoperability or independent rules verification, but their code is not copied into this Apache-2.0 repository.

| Game | Permissive baseline | License | What we use |
|---|---|---|---|
| Deal Room | `Ads97/DealBench` | MIT | State-model and rules audit. V2 replaces commercial action-card names with original terminology and presentation. |
| DiscShift | `eigenfoo/otto-othello` | MIT | AI evaluation concepts: positional weights, mobility, parity and stability. |
| Crown Jump | `felipersteles/checkers-with-ai` | MIT | Regression baseline for capture priority, multi-jumps, promotion and AI behavior. |
| Five Dice | `sorenchr/yahtzeebot` | MIT | Optimal keeper/category strategy is the AI-quality reference. Its 22 MB state map is not bundled into the browser app. |
| HueBreak | `eperezcosano/Uno` | MIT | Regression reference for shedding-card action flow and legality; HueBreak keeps its original deck, symbols and vocabulary. |
| Threadmark | `stepmat/Codenames_GPT` | MIT | Game-state/AI reference for team word association; Threadmark keeps original roles, vocabulary and presentation. |
| Fourfront | `kbennett2000/lan-games` | MIT | Connect-four legality/win-detection regression baseline. |
| Frontiers | `argosopentech/Conquest` and `kbennett2000/lan-games` | MIT | Risk-like reinforcement/attack/fortify and battle-flow regression baselines. |
| Tilebound | `DinnerBuffet/TTSCarcassonne` | MIT | Structured tile edge/special-feature data is adapted directly; full notice ships beside the game. |

## Migration policy

1. Preserve our original names, visual design, artwork, word packs, maps, and UX unless the upstream asset itself has a compatible license and is worth adopting.
2. Prefer upstream rules engines, tests, state models, AI evaluation methods, and structured game data over proprietary presentation assets.
3. Preserve features where our implementation is already stronger (offline/PWA, local modes, peer-to-peer rooms, accessibility, custom variants).
4. Keep the full upstream license notice next to any game where code or structured data is actually adapted.
5. Do not mark a game "adapted" merely because an open-source implementation exists. `upstreams.json` distinguishes `adapted-*` from `audited`.

## Current changes

- **Deal Room v2:** migrated into this repository, aligned to DealBench's permissive state-model approach, and renamed action/suit vocabulary to original terms.
- **DiscShift v2:** already lives in this repository; its move-hint toggle is preserved and its AI is upgraded to a stronger mobility/parity/frontier/stability-aware evaluation.
- **Tilebound:** already adapted from MIT Tabletop Simulator data.
- **Crown Jump, Five Dice, HueBreak, Threadmark, Fourfront, Frontiers:** current live implementations were audited against the listed MIT baselines. Their extra offline/online/variant features are intentionally preserved rather than replaced by less capable upstream UIs.
