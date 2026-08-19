# 43-Game Conversion Plan

Inventory source: `games.json` on 2026-08-19. These 43 concepts were marked `unbuilt` at the start of the conversion pass.

**Progress:** 10 of the original 43 have now received production-verified first implementations. **33 remain.**

## Batch 1 — deterministic / compact engines — COMPLETE
2048 multiplayer variants · Dots and Boxes · Mancala · Mastermind-style · Farkle

Live implementations: Mergefront · Boxline · Sowstone · Cipherloom · Spark Six

## Batch 2 — classic abstracts — COMPLETE
Nine Men's Morris · Hex · Backgammon · Battleship-style · Blackjack strategy trainer

Live implementations: Millstone · Hexline · Racehome · Gridwake · Twenty-One Lab

## Batch 3 — classic cards I — NEXT
President · Gin Rummy · Rummy 500 · Hearts · Spades

## Batch 4 — bluffing / hidden information
Liar's Dice · Perudo-style · Love-Letter-style · Coup-style · Guess-Who-style

## Batch 5 — word / party
Boggle-style · Scattergories-style · Charades / Heads-Up-style · Pictionary-style · Scrabble-style

## Batch 6 — abstract / spatial
Chess · Go · Santorini-style · Hive-style · Qwirkle-style

## Batch 7 — social deduction / cooperative hidden information
Werewolf / Mafia · Secret-government-style · Resistance / Avalon-style · Hanabi-style · Clue-style

## Batch 8 — larger card / tile systems
Play-money Poker · Mahjong · Dominion-style · Sequence-style

## Batch 9 — larger network / cooperative strategy
Settlers-style resource game · Ticket-to-Ride-style route game · Pandemic-style · Stratego-inspired

The sequence starts with engines that can be fully tested and played locally/offline, then moves toward games needing increasingly complex hidden-state, multiplayer, content, and AI architecture.
