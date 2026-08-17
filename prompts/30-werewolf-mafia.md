# Werewolf / Mafia social-deduction platform

Build an original open-source social-deduction game engine for hidden-role village-versus-minority games.

## Core gameplay
- 5–20+ players.
- Secret role assignment.
- Alternating night and day phases.
- Night roles submit private actions.
- Day phase supports discussion, nominations, voting, elimination, and public reveals according to room settings.
- Win detection for majority/minority factions and neutral roles.

## Role system
- Start with original equivalents of villagers, informed minority, investigator, protector, and a few neutral/special roles.
- Implement roles as data-driven modules so new roles can be added safely.

## Modes
- Online rooms with automated moderator.
- In-person companion mode that privately distributes roles and runs night prompts.
- Spectators/dead-player chat settings.

## Engineering/UI
- Strict role-based state redaction; never send night-only information to unauthorized clients.
- Phase timers, reconnect, host controls, audit-friendly event log without secret leakage.
- Tests for role assignment, night resolution order, protection/investigation interactions, voting ties, and every victory condition.
- Original theme/assets, README, license, Vercel deployment.
