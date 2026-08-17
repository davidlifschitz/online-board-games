# Codenames-style game

Build an open-source browser-based team word-association game inspired by clue-giving grid games.

Do not copy Codenames branding, artwork, word lists, or visual design. Create an original theme and name.

The app should be optimized for online group play and deployable on Vercel.

## Core gameplay
- 4+ players recommended, but allow 2–3 players with bots or cooperative variants.
- Split players into two teams.
- Each team has Operatives and one clue-giver.
- Generate a 5x5 grid of words from an original/open word list.
- Secretly assign each word to Team A, Team B, Neutral, or one instant-loss word.
- Only clue-givers can see the hidden role map.
- On each turn, the clue-giver submits a one-word clue and a number.
- Teammates discuss and click guesses.
- Correct guesses continue the turn.
- Wrong guesses end the turn.
- Guessing the instant-loss card immediately loses the game.
- First team to identify all of its words wins.

## Multiplayer
- Room codes and shareable invite links.
- Players choose team and role in lobby.
- Private clue-giver view.
- Host controls game setup and starts rounds.
- Synchronize board state in real time.
- Add text chat optionally.
- Allow spectators.
- Support reconnecting to an existing seat.

## Variants
- Standard team mode.
- Cooperative mode against a turn limit.
- Duet-style two-player mode using an original rule set.
- Custom board size.
- User-supplied word packs.
- Family-safe vocabulary filter.

## UI
- Large central word grid.
- Strong team-color distinction.
- Hidden information must never leak into operative DOM/state if feasible.
- Clear turn state and remaining-word counters.
- Mobile responsive.
- Add satisfying reveal animations when cards are guessed.

## Technical
- Separate server/host-authoritative hidden state from player-visible state.
- Add tests for board generation, assignment counts, win/loss detection, turn switching, and hidden-role visibility.
- Use an original or openly licensed word list.
- Include an open-source license and README.
- Deploy to Vercel.
