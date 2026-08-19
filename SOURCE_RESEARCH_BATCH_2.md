# OS Online Board Games — Source Research, Batch 2

All Batch 2 games are original implementations. The selected upstream repositories are MIT-licensed references only; no upstream source code, artwork, fonts, audio, or presentation assets are copied.

| Concept | Candidate | License | Language | Useful reference | Limitation / use decision |
|---|---|---|---|---|---|
| Nine Men's Morris | `EstevesX10/Web-Nine-Mens-Morris` | MIT | JavaScript/browser | placement, mills, movement/flying, bot behavior | audited only; original graph engine/UI retained |
| Nine Men's Morris | `antonioc-26/Web-Games` | MIT | JavaScript | browser interaction and Morris rules | collection repo; regression/UX reference only |
| Hex | `GTmmiller/hex-game` | MIT | JavaScript | Hex board, canvas interaction, connection rules | archived/simple implementation; audited only |
| Hex | `ddepasquali/roentgen` | MIT | JavaScript | hex-grid browser/multiplayer architecture | different cooperative game; grid/network architecture reference only |
| Backgammon | `quasoft/backgammonjs` | MIT | JavaScript | complete rules, multiplayer architecture, move generation | larger jQuery/Node stack; audited rather than cloned |
| Backgammon | `binarymax/backgammon.js` | MIT | JavaScript | classic move/rules reference | older UI/engine; regression reference only |
| Battleship-style | `KelvinQiu802/battleship` | MIT | JavaScript/React | placement and shot-flow reference | branded presentation not reused; original fleet/names/UI |
| Battleship-style | `kbennett2000/lan-games` | MIT | JavaScript/Node | server-validated turn-based multiplayer reference | Socket.io/SQLite architecture not copied into static game |
| Blackjack trainer | `K9wwh/blackjack-basic-strategy-trainer` | MIT | JavaScript | S17/DAS/late-surrender strategy-training reference | trainer-focused; original full round engine added |
| Blackjack trainer | `joshknopp/Train21` | MIT | JavaScript | basic-strategy drill reference | not a full blackjack game; secondary strategy reference |

## Batch 2 implementation choices

- **Millstone**: independent 24-point Nine Men's Morris graph engine with mill/removal rules, movement/flying, threefold draw option, heuristic/minimax bots.
- **Hexline**: independent Hex connection engine with player/color separation for the pie rule, shortest-path heuristic, immediate tactical checks and bounded playout bot.
- **Racehome**: independent Backgammon engine that generates complete legal turn sequences before play, enforces maximum dice usage and the higher-die rule, handles hits/bar/bearing off, gammon/backgammon scoring, match score and doubling cube.
- **Gridwake**: independent hidden-fleet engine with original vessel names, SHA-256 fleet commitments, target-only shot views and probability-density bots.
- **Twenty-One Lab**: independent play-money blackjack engine and trainer with seeded shoes, splits/doubles/surrender/insurance, configurable S17/H17, strategy grading and hidden-hole-safe Hi-Lo practice.

Current networking note: Batch 2 first ships local/bot/offline modes. A shared online-room layer is being treated as a separate cross-game architecture task so hidden-information games do not transmit secret state to the opponent client.
