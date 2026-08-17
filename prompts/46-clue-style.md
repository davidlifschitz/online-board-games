# Clue-style deduction mystery game

Build an original open-source deduction board/card mystery game inspired by hidden-solution investigation games. Do not copy Clue/Cluedo characters, rooms, weapons, board, cards, artwork, or exact rules text.

## Original concept
Create a distinct setting such as a sabotaged space station, museum heist, or magical academy. The hidden solution consists of one culprit, one method/tool, and one location.

## Core gameplay
- 3–6 players.
- Secretly place one card from each solution category into a case file; deal remaining evidence privately.
- Players move through an original map or use an action-point location system.
- Make a hypothesis; other players privately refute in turn order by showing exactly one matching card if able.
- Players record deductions in a private notebook.
- Make a final accusation to win; wrong accusation removes ability to win while optionally retaining refutation duties.

## Modes/AI
- Bots, local privacy handoff, online rooms.
- AI tracks logical constraints and card ownership probabilities.

## Engineering/UI
- Strict private evidence handling, notebook grid, event log that does not leak shown cards.
- Tests for case setup, refutation order, movement, accusation, and deduction-state visibility.
- Original theme/assets, README, open-source license, Vercel deployment.
