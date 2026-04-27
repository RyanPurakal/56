# shared/src — Cross-boundary type contracts

This directory is the single source of truth for every type shared between the server and any client. Nothing here contains runtime logic — only type definitions, socket event maps, and game constants.

## Responsibility

Define the data shapes that cross the client–server boundary so that both sides compile against the same contracts.

## What passes through it

- **In:** nothing (this is a type-only library).
- **Out:** TypeScript types and constants imported by `src/engine/`, `server/`, and any client.

## Files / directories

| Path | Role |
|------|------|
| `index.ts` | Barrel re-export — the only import path clients and the server use. |
| `types/GameTypes.ts` | Core game state: `Card`, `Suit`, `Rank`, `Phase`, `BiddingState`, `PlayState`, `GameState`. |
| `types/MoveTypes.ts` | Union type `Move` = `Bid | Pass | Double | PlayCard`. |
| `types/PlayerTypes.ts` | `Player`, `PlayerId`, `TeamId` — team assignments are seat-based (seats 0/2 vs 1/3). |
| `types/SocketEvents.ts` | Typed Socket.IO event maps (`ClientToServerEvents`, `ServerToClientEvents`) and visibility types (`VisibleHand`, `PublicGameState`). |
| `constants/GameConstants.ts` | `SUITS`, `RANK_ORDER` (J→Q, high to low), `CARD_POINTS` (J=3, 9=2, A=1, 10=1, K/Q=0). |
| `debug/typeCheck.ts` | Compile-time only — instantiates every shared type to catch assignability regressions; never executed at runtime. |

## Key design decision

`SocketEvents.ts` defines `PublicGameState`, which replaces `handsByPlayerId` with `VisibleHand` (either `{ kind: "visible"; cards }` for the viewing player or `{ kind: "hidden"; count }` for opponents). The server applies this filter before emitting; clients never see raw opponent hands.
