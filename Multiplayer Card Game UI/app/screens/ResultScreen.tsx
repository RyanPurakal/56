import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { Trophy, Award, TrendingUp, Home, RotateCcw } from "lucide-react";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { AnimatedScore } from "../components/game/AnimatedScore";

export function ResultScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const results = {
    winner: "Your Team",
    yourTeam: {
      score: 56,
      bid: 32,
      players: ["You", "Maria"],
    },
    opponentTeam: {
      score: 42,
      bid: 28,
      players: ["Alex", "John"],
    },
    contractMade: true,
  };

  const handlePlayAgain = () => {
    navigate(`/room/${roomCode}`);
  };

  const handleReturnToLobby = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden dark">
      {/* Celebration background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-green) 0%, transparent 70%)",
            opacity: 0.2,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-orange) 0%, transparent 70%)",
            opacity: 0.2,
          }}
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Winner announcement */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <Trophy size={64} className="text-[var(--neon-green)]" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-amber)] bg-clip-text text-transparent mb-2">
            Victory!
          </h1>
          <p className="text-xl text-white/80">{results.winner} Wins</p>
        </motion.div>

        {/* Score comparison */}
        <GlassPanel className="p-6 mb-6">
          <div className="space-y-6">
            {/* Your team */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={20} className="text-[var(--neon-green)]" />
                    <h3 className="text-lg font-semibold text-white">Your Team</h3>
                  </div>
                  <p className="text-sm text-white/60">
                    {results.yourTeam.players.join(" & ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[var(--neon-green)]">
                    {results.yourTeam.score}
                  </div>
                  <div className="text-xs text-white/60">Bid: {results.yourTeam.bid}</div>
                </div>
              </div>
              {/* Score bar */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.yourTeam.score / 56) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-amber)] rounded-full"
                />
              </div>
            </motion.div>

            {/* VS divider */}
            <div className="flex items-center justify-center">
              <div className="h-px flex-1 bg-white/20" />
              <span className="px-4 text-white/40 text-sm">VS</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Opponent team */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Opponent Team</h3>
                  <p className="text-sm text-white/60">
                    {results.opponentTeam.players.join(" & ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white/60">
                    {results.opponentTeam.score}
                  </div>
                  <div className="text-xs text-white/60">Bid: {results.opponentTeam.bid}</div>
                </div>
              </div>
              {/* Score bar */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.opponentTeam.score / 56) * 100}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="h-full bg-white/20 rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Contract status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2"
          >
            <TrendingUp size={20} className="text-[var(--neon-green)]" />
            <span className="text-[var(--neon-green)] font-medium">
              {results.contractMade ? "Contract Made!" : "Contract Failed"}
            </span>
          </motion.div>
        </GlassPanel>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <GameButton variant="primary" size="lg" fullWidth onClick={handlePlayAgain}>
            <div className="flex items-center justify-center gap-2">
              <RotateCcw size={20} />
              <span>Play Again</span>
            </div>
          </GameButton>
          <GameButton variant="secondary" size="lg" fullWidth onClick={handleReturnToLobby}>
            <div className="flex items-center justify-center gap-2">
              <Home size={20} />
              <span>Return to Lobby</span>
            </div>
          </GameButton>
        </motion.div>
      </div>
    </div>
  );
}