# Mastermind-style code-breaking game

Build an original open-source deduction game where one side creates a hidden sequence and the other tries to infer it from positional/color feedback.

## Core gameplay
- Configurable code length, default 4.
- Configurable symbol/color count, default 6.
- Option to allow or disallow duplicate symbols.
- After each guess, return only aggregate feedback: correct symbol in correct position and correct symbol in wrong position.
- Limited attempts; solve before attempts run out.

## Modes
- Solo code-breaking against computer.
- Computer solver against a user-created code.
- Local 1v1 roles.
- Online 1v1 where hidden code remains private/committed.
- Daily seeded puzzle.

## AI
- Include a strong solver using candidate elimination and information-gain/minimax-style guess selection.
- Explain remaining candidate count without revealing the solution.

## UI/engineering
- Colorblind-safe symbols/patterns as well as colors.
- Tests for duplicate handling, feedback calculation, candidate filtering, win/loss, and solver correctness.
- Original branding/assets, README, open-source license, Vercel deployment.
