# server/src — Socket.IO game server

This directory is the runtime process that connects clients to the game engine. It owns no game logic — all rule enforcement is delegated to `src/engine/`.

## Responsibility

Accept Socket.IO connections, manage room lifecycle, route player moves into the engine, and broadcast filtered game state back to each client.

## What passes through it

- **In:** raw Socket.IO events from clients (`create_room`, `join_room`, `start_game`, `make_bid`, `play_card`).
- **Out:** `room_update`, `game_state_update`, `player_joined`, `game_started`, `invalid_move`, `player_token` events emitted to the relevant socket room.

## Sub-directories

| Path | Role |
|------|------|
| `index.ts` | Process entry point — wires Express, the HTTP server, Socket.IO, and `RoomManager` together. |
| `rooms/` | Room data model (`GameRoom`), seat/spectator management (`RoomManager`), and shared room types. |
| `sockets/` | Socket event registration; translates raw payloads into engine `Move` objects and emits results. |
| `game/` | `filterStateForPlayer` — hides opponent hands before emitting `game_state_update`. |
| `auth/` | Lightweight HMAC token for player reconnection; stored in `PLAYER_TOKEN_SECRET` env var. |
| `persistence/` | Debounced JSON write/read for `server/data/rooms.json`; spectator sets are transient and not persisted. |

## Key design decisions

- **Per-player state emission:** each seated player receives a `PublicGameState` with only their own cards visible; spectators receive the full `GameState`.
- **Reconnection:** `RoomManager` keeps a 60-second reservation when a socket disconnects; a returning client supplies its `playerToken` to reclaim the seat.
- **No game logic in handlers:** `registerSocketHandlers` only validates that the acting socket is a seated player, then delegates move validation entirely to `getValidMoves` / `applyMove` in the engine.
