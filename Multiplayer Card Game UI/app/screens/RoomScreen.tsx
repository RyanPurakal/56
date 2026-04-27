// Pre-game waiting room: shows seat occupancy and a copyable room code; player joins are simulated
// with timeouts — no real WebSocket connection in this reference build.
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { PlayerSeat, PlayerData } from "../components/game/PlayerSeat";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { Logo56 } from "../components/game/Logo56";
import { FloatingParticles } from "../components/game/FloatingParticles";

export function RoomScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<(PlayerData | null)[]>([
    { id: "1", name: "You", isReady: true },
    null,
    null,
    null,
  ]);

  // Simulate players joining
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[1] = { id: "2", name: "Player 2", isReady: true };
        return newPlayers;
      });
    }, 2000);

    const timer2 = setTimeout(() => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[2] = { id: "3", name: "Player 3", isReady: true };
        return newPlayers;
      });
    }, 4000);

    const timer3 = setTimeout(() => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        newPlayers[3] = { id: "4", name: "Player 4", isReady: true };
        return newPlayers;
      });
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      // Try to use the Clipboard API first
      await navigator.clipboard.writeText(roomCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback method for browsers/contexts that don't support Clipboard API
      try {
        const textArea = document.createElement("textarea");
        textArea.value = roomCode || "";
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (fallbackErr) {
        console.error("Failed to copy:", fallbackErr);
        // Optionally show an error message to the user
      }
    }
  };

  const handleStartGame = () => {
    // Add a brief delay with visual feedback before transition
    const startButton = document.querySelector('[data-start-game]');
    if (startButton) {
      startButton.classList.add('scale-95');
    }
    
    setTimeout(() => {
      navigate(`/game/${roomCode}`);
    }, 200);
  };

  const activePlayers = players.filter((p) => p !== null);
  const allReady = activePlayers.length === 4 && activePlayers.every((p) => p?.isReady);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden dark">
      {/* Floating particles */}
      <FloatingParticles count={15} />
      
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-orange) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Lobby</span>
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl text-white/80 mb-2">Room Code</h2>
            <motion.button
              onClick={handleCopyCode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
            >
              <span className="text-4xl font-bold tracking-wider bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-amber)] bg-clip-text text-transparent">
                {roomCode}
              </span>
              {copied ? (
                <Check size={24} className="text-[var(--neon-green)]" />
              ) : (
                <Copy size={24} className="text-white/60" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Player grid - arranged like a card table */}
        <GlassPanel className="p-8 mb-8">
          <div className="relative h-[400px]">
            {/* Top player */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <PlayerSeat
                player={players[2] || undefined}
                position="top"
                isEmpty={!players[2]}
              />
            </div>

            {/* Left player */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <PlayerSeat
                player={players[1] || undefined}
                position="left"
                isEmpty={!players[1]}
              />
            </div>

            {/* Right player */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <PlayerSeat
                player={players[3] || undefined}
                position="right"
                isEmpty={!players[3]}
              />
            </div>

            {/* Bottom player (you) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <PlayerSeat player={players[0] || undefined} position="bottom" />
            </div>

            {/* Center table visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-[var(--brand-orange)]/10 to-[var(--brand-green)]/10 border-2 border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-white/20 mb-1">
                  {activePlayers.length}/4
                </div>
                <div className="text-sm text-white/40">Players</div>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Status and actions */}
        <div className="space-y-4">
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-center text-white/60"
          >
            {allReady ? "All players ready!" : `Waiting for ${4 - activePlayers.length} more player${4 - activePlayers.length !== 1 ? 's' : ''}...`}
          </motion.p>

          <GameButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartGame}
            disabled={!allReady}
            data-start-game
          >
            Start Game
          </GameButton>
        </div>
      </div>
    </div>
  );
}