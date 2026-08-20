# Build Queue

Want a concrete issue to claim right now? This page tracks **pre-created build issues** for selected TrainGames prompts. It is intentionally smaller than the full challenge catalog.

For the canonical list of every prompt still waiting for a first deployment, use the [TrainGames Build page](https://os-online-board-games.vercel.app/build.html#challenge), which is generated directly from [`games.json`](games.json).

Claims are coordination signals, not exclusive reservations. Multiple independent implementations of the same game are welcome.

## Pre-created starter issues

| Game | Prompt | Build issue | Difficulty | Status |
|---|---|---|---|---|
| Boggle-style | [`prompts/26-boggle-style.md`](prompts/26-boggle-style.md) | [#7](https://github.com/davidlifschitz/online-board-games/issues/7) | Starter | Open |
| Love-Letter-style | [`prompts/15-love-letter-style.md`](prompts/15-love-letter-style.md) | [#8](https://github.com/davidlifschitz/online-board-games/issues/8) | Starter | Open |

Other starter concepts currently waiting for a first deployment include President-style, Scattergories-style, Charades / Heads-Up-style, and Guess-Who-style. Use the repository's **Claim a game** issue form for any prompt that does not already have a dedicated build issue.

Mancala, Dots and Boxes, Mastermind-style, and Farkle were previously listed here and now have live first-party implementations in the collection. See [`games.json`](games.json) for current status across all 51 prompt concepts.

## How to claim one

1. Open an existing build issue, or use the **Claim a game** issue form for another prompt.
2. Comment **“I’d like to build this”** on a pre-created issue, or submit the claim form. Link your repository when you have one.
3. Build from the matching prompt.
4. Deploy the game publicly.
5. Submit the deployment through the TrainGames Build page or the repository's **Submit a deployed game** issue form.

## What counts as done?

A starter implementation should still be a real game, not a mockup. It should have a complete playable loop, a responsive browser UI, tests around important rules, original or appropriately licensed presentation, and a stable public deployment. Local, solo, or bot modes should work offline after a successful online load where practical.

## Want something harder?

See [BUILD_CHALLENGE.md](BUILD_CHALLENGE.md) for difficulty guidance, or browse the full [GAME_CATALOG.md](GAME_CATALOG.md).