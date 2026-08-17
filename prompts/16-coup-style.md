# Coup-style bluffing game

Build an original open-source multiplayer bluffing card game inspired by hidden-role influence games. Do not copy Coup branding, role names, art, or rule text.

## Core gameplay
- 3–6 players.
- Each player begins with two hidden influence cards.
- Players may take universal actions or claim role-specific powers whether or not they actually hold that role.
- Other players can challenge claimed roles or block certain actions.
- Failed challenges or successful challenges cost influence.
- Last player with influence remaining wins.

## Required systems
- A reaction window for challenge/block decisions.
- Clear sequencing when multiple players can react.
- Timers that can be disabled for private rooms.
- Action log that reveals only information players are entitled to know.

## AI
- Easy rarely bluffs; medium mixes truthful and deceptive claims; hard estimates opponent role probabilities and adjusts bluff/challenge frequency.

## Multiplayer/UI
- Online-first rooms, bots, local mode, reconnect support.
- Private role cards, large action controls, challenge/block prompts, accessible mobile layout.
- Tests for all action/challenge/block combinations and information visibility.
- Original theme/assets, open-source license, README, Vercel deployment.
