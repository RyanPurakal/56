# src/engine — Pure game-logic layer

This directory contains the complete rules engine for the 56 card game. It has **no I/O, no side effects, and no imports outside `shared/`**; every function takes a value and returns a new value.

## Responsibility

Transform `GameState` → `GameState` in response to player moves, enforcing all game rules (bidding, trick-following, scoring).

## What passes through it

- **In:** `GameState` + a `Move` (Bid / Pass / Double / PlayCard)
- **Out:** a new immutable `GameState` (one phase further along)

## Files

| File | Role |
|------|------|
| `Game.ts` | Game lifecycle — `createGame` and `dealCards` (the only randomness entry point). |
| `Bidding.ts` | Bidding-phase helpers: valid moves, `applyBiddingMove`, completion check. |
| `Deck.ts` | Deck construction, Fisher–Yates shuffle, hand dealing (48-card double deck, 12 cards each). |
| `Trick.ts` | Trick helpers: follow-suit validation, winner resolution, `appendPlay`. |
| `Scoring.ts` | Point calculation and `ScoreSummary` construction after all tricks are complete. |
| `Rules.ts` | Public entry point — `getValidMoves` and `applyMove` delegate to the above modules. |
| `index.ts` | Re-exports the public engine API consumed by the server. |

## Key design decisions

- **Immutability:** every function returns a new object; no in-place mutation anywhere.
- **Randomness isolation:** `shuffleDeck` is the single place randomness enters; callers may pass a seeded `Rng` for deterministic tests.
- **Fail-fast validation:** `applyMove` re-derives `getValidMoves` and throws on any invalid input, so the server can trust the engine as the authority.
- **Double deck:** the game uses two physical copies of each suit+rank (48 cards total), distinguished by the `uid` field (`"S-J-0"` vs `"S-J-1"`).
