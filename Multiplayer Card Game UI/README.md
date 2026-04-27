# Multiplayer Card Game UI — Web reference client

This directory is the Figma Make / Vite + React web prototype of the 56 game UI. It uses static mock data and does **not** connect to the game server; it exists as a visual and interaction reference for the mobile app's cyberpunk glass aesthetic.

## Responsibility

Demonstrate the full UI flow (lobby → room → game table → result) with animations and component design, without requiring a running server.

## What passes through it

- **In:** user interactions (button clicks, card selections).
- **Out:** client-side navigation between screens; no network calls.

## Structure

| Path | Role |
|------|------|
| `app/` | React application root — `App.tsx`, routes, screens, and components. |
| `styles/` | Global CSS: Tailwind base, theme variables (brand colours, glass effect tokens), and font imports. |

## Key design decisions

- All game state in screens is **local React state with mock data** — wiring to a real server is left for the mobile app (`mobile/`).
- The cyberpunk aesthetic is driven by CSS custom properties (`--brand-orange`, `--brand-green`, `--brand-amber`) defined in `styles/theme.css`; change colours there to retheme the entire UI.
- `components/effects/` provides the animated background layers (circuit board, data streams, hexagon grid) that appear on the lobby; they are decorative and can be removed without affecting game logic.
