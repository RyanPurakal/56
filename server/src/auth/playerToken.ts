/**
 * Lightweight HMAC-SHA256 reconnection token: encodes `playerId:timestampMs:sig` so a returning
 * client can prove its identity without a full auth system; set PLAYER_TOKEN_SECRET in env for production.
 */
import crypto from "node:crypto";

const SECRET = process.env.PLAYER_TOKEN_SECRET ?? "56-game-dev-secret-key";

/**
 * Creates a signed player token: `{playerId}:{timestampMs}:{signature}`
 */
export function createPlayerToken(playerId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${playerId}:${timestamp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 16);
  return `${payload}:${sig}`;
}

/**
 * Verifies a player token and returns the playerId if valid, or null if invalid.
 */
export function verifyPlayerToken(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [playerId, timestamp, sig] = parts as [string, string, string];
  if (!playerId || !timestamp || !sig) return null;
  const payload = `${playerId}:${timestamp}`;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 16);
  if (sig !== expected) return null;
  return playerId;
}
