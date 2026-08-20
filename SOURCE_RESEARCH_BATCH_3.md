# Source Research — Conversion Batch 3

All selected candidates below were verified from the repository's actual `LICENSE` file before selection. All five TrainGames implementations are independent; the permissive projects are used as audited rules, AI, architecture, or regression references only. No upstream code or assets are copied.

| Prompt | TrainGames game | Primary reference | License | Language | Secondary reference | License | Language | Use |
|---|---|---|---|---|---|---|---|---|
| President-style | High Table | `Keesayy/President_Card_Game` | MIT | C | `skiano/president` | MIT | JavaScript | MCTS/game-flow and compact rules reference |
| Hearts | Hearts | `cakeslice/Next-Hearts` | MIT | TypeScript | `zmcx16/OpenAI-Gym-Hearts` | MIT | Python | Browser multiplayer architecture plus rules/AI environment reference |
| Spades | Spades | `mreishus/spades` | MIT | Elixir/TypeScript | `Metamess/Spades` | MIT | Python | Online architecture plus game-rules framework reference |
| Gin Rummy | Gin Rummy | `vlmlee/Gin-Rummy` | MIT | Go | `jrheling/pylgrum` | MIT | Python | Rules/game-flow plus bot/AI reference |
| Rummy 500 | Rummy 500 | `matheu-s/Rummy500Game_AI` | MIT | Python | `Mego/rummy` | MIT | HTML/JavaScript | Rummy 500 AI/rules plus browser implementation reference |

## Excluded President candidates

- `smessie/AI-President`: direct LICENSE check found GPL-3.0; excluded from copied/adapted material.
- `SJGraboski/president`: no LICENSE found at the repository root during direct check; excluded.
- `quaresma95/president`: no LICENSE found at the repository root during direct check; excluded.

## Implementation classification

Each Batch 3 game is `audited`, not `adapted-v1`. The browser engines, bots, CSS card faces, local privacy screens, service workers, persistence, and tests were written independently for this repository.
