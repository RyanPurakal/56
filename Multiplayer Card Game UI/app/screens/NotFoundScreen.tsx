// Catch-all 404 screen: shown for any unmatched route; navigates back to the lobby on button click.
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Home, AlertCircle } from "lucide-react";
import { GameButton } from "../components/game/GameButton";

export function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <AlertCircle size={64} className="text-[var(--brand-orange)] mx-auto mb-4" />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-amber)] bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-white/60 mb-8">Page not found</p>
        <GameButton variant="primary" size="lg" onClick={() => navigate("/")}>
          <div className="flex items-center gap-2">
            <Home size={20} />
            <span>Back to Lobby</span>
          </div>
        </GameButton>
      </motion.div>
    </div>
  );
}