// Entry screen: lets the user create a room (generates a random code) or join one by code; uses
// mock navigation only — real server integration lives in the mobile app.
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Plus, LogIn } from "lucide-react";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { CyberLogo56 } from "../components/game/CyberLogo56";
import { DataStream } from "../components/effects/DataStream";
import { CircuitBoard } from "../components/effects/CircuitBoard";
import { HexagonGrid } from "../components/effects/HexagonGrid";

export function LobbyScreen() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${code}`);
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden dark">
      {/* Cyber background effects */}
      <DataStream />
      <CircuitBoard />
      <HexagonGrid />
      
      {/* Scanline overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 107, 53, 0.02) 3px, rgba(255, 107, 53, 0.02) 6px)",
        }}
      />

      {/* Moving scan beam */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(0deg, transparent 0%, rgba(255, 107, 53, 0.05) 50%, transparent 100%)",
            "linear-gradient(180deg, transparent 0%, rgba(255, 107, 53, 0.05) 50%, transparent 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Animated background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-orange) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-green) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-amber) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Corner UI elements */}
      <div className="absolute top-4 left-4 opacity-50">
        <motion.div
          className="text-[var(--brand-orange)] text-xs font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          [CONN: SECURE]
        </motion.div>
      </div>
      <div className="absolute top-4 right-4 opacity-50">
        <motion.div
          className="text-[var(--brand-green)] text-xs font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          [SYS: ONLINE]
        </motion.div>
      </div>
      <div className="absolute bottom-4 left-4 opacity-50">
        <div className="text-white/30 text-xs font-mono">v2.56.0</div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <CyberLogo56 />
          </div>
          <motion.p
            className="text-white/60 text-lg"
            animate={{
              textShadow: [
                "0 0 10px rgba(255, 107, 53, 0)",
                "0 0 20px rgba(255, 107, 53, 0.3)",
                "0 0 10px rgba(255, 107, 53, 0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            The Ultimate Trick-Taking Game
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-8 relative overflow-hidden">
            {/* Corner accents on panel */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--brand-orange)]/50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--brand-orange)]/50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--brand-green)]/50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--brand-green)]/50" />

            <div className="space-y-4 relative">
              <GameButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCreateRoom}
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus size={24} />
                  <span>Create Room</span>
                </div>
              </GameButton>

              {!showJoinInput ? (
                <GameButton
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowJoinInput(true)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={24} />
                    <span>Join Room</span>
                  </div>
                </GameButton>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="Enter room code"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border-2 border-[var(--brand-orange)]/30 text-white placeholder-white/40 focus:outline-none focus:border-[var(--brand-orange)] focus:shadow-[0_0_20px_rgba(255,107,53,0.3)] text-center text-lg tracking-wider transition-all"
                      maxLength={6}
                    />
                    {/* Typing indicator */}
                    <motion.div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--brand-green)] rounded-full"
                      animate={{
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <GameButton
                      variant="ghost"
                      size="md"
                      fullWidth
                      onClick={() => {
                        setShowJoinInput(false);
                        setRoomCode("");
                      }}
                    >
                      Cancel
                    </GameButton>
                    <GameButton
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={handleJoinRoom}
                      disabled={roomCode.length < 4}
                    >
                      Join
                    </GameButton>
                  </div>
                </motion.div>
              )}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/40 text-sm mt-8"
        >
          A partnership trick-taking game for 4 players
        </motion.p>
      </div>
    </div>
  );
}