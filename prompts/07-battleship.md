# Battleship-style game

Build an open-source browser naval hidden-information game inspired by Battleship.

Use original branding, ship names, artwork, and visual design.

## Core gameplay
- Two players each have a hidden 10x10 grid.
- Each secretly places a fleet.
- Default original fleet: 5-cell carrier, 4-cell cruiser, 3-cell destroyer, 3-cell submarine, 2-cell patrol boat.
- Ships may be horizontal or vertical.
- No overlapping.
- Players alternate firing at coordinates.
- Reveal miss, hit, and sunk.
- First player to sink the opponent’s entire fleet wins.

## Placement
- Drag-and-drop on desktop.
- Tap/rotate/place on mobile.
- Random fleet placement button.
- Validate placement.

## Modes
- Vs computer.
- Local pass-and-play with privacy screen between turns.
- Online multiplayer.

## Online architecture
- Use peer-to-peer WebRTC where feasible.
- Each player should keep their own fleet layout locally.
- Exchange commitments/hashes at setup so neither player can silently rearrange ships after play begins.
- Reveal proof information as shots occur or at game end.
- Host should not automatically receive the opponent's full hidden board.
- Handle reconnects where feasible.

## AI
- Easy random shots.
- Medium hunt/target strategy.
- Hard probability-density targeting based on remaining ship placements.

## Variants
- Salvo mode.
- Smaller boards.
- Custom fleets.
- Faster 7x7 mode.

## UI
- Side-by-side own-board and target-board on desktop.
- Tabbed boards on mobile.
- Coordinates clearly labeled.
- Hit/sunk animations.
- Sound optional.
- No copyrighted Battleship art.

## Testing
- Placement validation.
- Shot legality.
- Hit/sunk detection.
- Win condition.
- Commitment validation.
- AI target behavior.
- Open-source license.
- Vercel deployment.
