import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    function tick() {
      const now = Date.now();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      setSeconds(Math.max(0, Math.floor((midnight.getTime() - now) / 1000)));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function DailyQuest({ playerId, certId, apiBase = '' }) {
  const [quest, setQuest] = useState(null);
  const countdown = useCountdown();

  useEffect(() => {
    if (!playerId || !certId) return;
    fetch(`${apiBase}/api/daily-quest/${playerId}/${certId}`)
      .then(r => r.json())
      .then(q => setQuest(q && !q.error ? q : null))
      .catch(() => null);
  }, [playerId, certId, apiBase]);

  if (!quest) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-3 ${
        quest.completed
          ? 'border-green-700 bg-green-950'
          : 'border-orange-700/60 bg-orange-950/40'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Daily Quest</span>
            {quest.completed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-green-400 font-bold"
              >
                ✓ Complete!
              </motion.span>
            )}
          </div>
          <p className="text-sm text-white">{quest.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-500">Resets in</p>
          <p className="text-xs font-mono text-orange-300">{countdown}</p>
        </div>
      </div>

      {/* Reward preview */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span>🎁 2× XP</span>
        <span>·</span>
        <span>80% loot chance</span>
      </div>
    </motion.div>
  );
}
