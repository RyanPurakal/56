# 56 — Real-time multiplayer card game

A four-player partnership trick-taking game (“56” / famous three style rules) with a **Socket.IO** game server, a **shared TypeScript** rules engine, and an **Expo (React Native)** client. The mobile UI follows a cyberpunk / glass aesthetic aligned with the **Multiplayer Card Game UI** reference in this repo (`Multiplayer Card Game UI/`).

## Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│  Mobile app (Expo/React Native)  │  Web UI reference        │
│  socket.io-client ───────────────┤  (Multiplayer Card       │
│                                  │   Game UI/, static)      │
└────────────────────┬─────────────┴──────────────────────────┘
                     │  Socket.IO  (WebSocket / long-poll)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   server/  (Node + Express)                 │
│                                                             │
│  registerSocketHandlers  ──▶  RoomManager  ──▶  GameRoom   │
│         │                         │                         │
│         │ applyMove / getValidMoves│ filterStateForPlayer   │
│         ▼                         ▼                         │
│     src/engine/  (pure TS, no I/O)          persistence/   │
│   Game · Bidding · Trick · Scoring · Rules  store.ts       │
└─────────────────────────────────────────────────────────────┘
                     │  shared/  (imported by both sides)
                     ▼
          Types · SocketEvents · GameConstants
```

## Data flow (one round-trip)

1. **Client** emits `make_bid` or `play_card` via Socket.IO.
2. **`registerSocketHandlers`** resolves the seated player, validates the move via `getValidMoves`, then calls `applyMove` on the current `GameState`.
3. `applyMove` (in `src/engine/Rules.ts`) returns a new immutable `GameState`; it never mutates.
4. `RoomManager.upsertRoom` stores the new state in memory and debounces a write to `server/data/rooms.json`.
5. **`emitGameState`** calls `filterStateForPlayer` for each seated player (hiding opponents' cards) and emits `game_state_update`; spectators receive the full unfiltered state.

## Repository layout

| Path | Purpose |
|------|--------|
| `shared/` | Shared types and socket event contracts (`GameState`, `Suit`, `TrickPlay`, etc.). |
| `src/engine/` | Pure game logic: deck, bidding, tricks, scoring (used by the server). |
| `server/` | Node HTTP + **Socket.IO** server; rooms, match flow, pushes `game_state_update` to clients. |
| `mobile/` | **Expo SDK 54** app — lobby, room, table, bidding sheet, play phase, scoring / result panel (`src/mcg-ui/`). |
| `test/` | **Vitest** unit tests against the engine. |
| `Multiplayer Card Game UI/` | Figma Make / web reference (not required to run the app). |

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm**
- For the mobile app: **Expo CLI** via `npx expo`, Xcode (iOS) and/or Android Studio (Android) as needed

## Quick start

### 1. Game server

```bash
cd server
npm install
npm run dev
```

Default URL: `http://localhost:3000`  
Health check: `GET http://localhost:3000/health`

### 2. Mobile app

```bash
cd mobile
npm install
npx expo start
```

Then open in **iOS Simulator**, **Android emulator**, **Expo Go**, or a **development build**.

### 3. Point the app at your server

- **Simulator / same machine:** `http://localhost:3000` or `http://127.0.0.1:3000` is usually fine.
- **Physical phone:** `localhost` refers to the phone itself. Use your computer’s **LAN IP** (e.g. `http://192.168.1.10:3000`) in the lobby **Server** field.

### 4. Engine tests (optional)

From the repo root:

```bash
npm install
npm test
```

## How to play (local smoke test)

1. Start the server (`server/npm run dev`).
2. Start Expo (`mobile/npx expo start`).
3. Open the app on **four** clients (four simulators, or mix devices) — or fewer to verify lobby/room wiring.
4. **Create room** on one device, **join** with the room code on others, **Start game** when four seats are filled.

## Tech stack

- **Client:** React Native, Expo, Zustand, `socket.io-client`, `expo-linear-gradient`, `react-native-svg`, `@react-native-masked-view/masked-view`
- **Server:** Express, Socket.IO
- **Engine / types:** TypeScript, Vitest

## App Store / production notes

- Configure a **stable HTTPS/WSS URL** for the server; update the default or in-app server field accordingly.
- Use **EAS Build** and **TestFlight** (iOS) / Play internal testing (Android) before store submission.
- Tighten **CORS** and Socket.IO `origin` in `server/src/index.ts` for production.

## License

Private / unspecified — add a `LICENSE` file when you choose one.

---

## GitHub repository description (copy-paste)

Use this in **GitHub → Repository → ⚙ Settings → General → Description** (max 350 characters):

```
Real-time 4-player "56" trick-taking card game: Expo React Native client, Node Socket.IO server, and shared TypeScript engine—with a cyberpunk glass UI.
```

**Suggested topics:** `multiplayer` `card-game` `expo` `react-native` `socket-io` `typescript` `trick-taking` `game`
