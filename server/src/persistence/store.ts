/**
 * Debounced JSON persistence for room state: writes to server/data/rooms.json at most once per
 * 500 ms; spectator socket IDs are transient and intentionally excluded from the serialized form.
 */
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(import.meta.dirname ?? ".", "..", "..", "data");
const FILE_PATH = path.join(DATA_DIR, "rooms.json");

type SerializableRoom = {
  id: string;
  phase: string;
  playersBySeat: Array<{ seat: number; playerId: string; name: string; socketId: string } | null>;
  reservedSeats: Array<{ seat: number; playerId: string; name: string; reservedUntilMs: number }>;
  gameState: unknown;
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Save rooms to disk (debounced to avoid excessive writes).
 */
export function saveRooms(rooms: Map<string, unknown>): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: Record<string, unknown> = {};
      for (const [id, room] of rooms) {
        const r = room as any;
        data[id] = {
          id: r.id,
          phase: r.phase,
          playersBySeat: r.playersBySeat,
          reservedSeats: r.reservedSeats,
          // spectators (Set<string>) are transient — not persisted
          gameState: r.gameState
        };
      }
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("[persistence] Failed to save rooms:", err);
    }
  }, 500);
}

/**
 * Load rooms from disk. Returns a map of room data (without transient fields like spectators).
 */
export function loadRooms(): Map<string, SerializableRoom> {
  const result = new Map<string, SerializableRoom>();
  try {
    if (!fs.existsSync(FILE_PATH)) return result;
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, SerializableRoom>;
    for (const [id, room] of Object.entries(parsed)) {
      result.set(id, room);
    }
  } catch (err) {
    console.error("[persistence] Failed to load rooms:", err);
  }
  return result;
}
