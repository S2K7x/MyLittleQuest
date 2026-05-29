import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

function flameSize(streak) {
  if (streak >= 30) return 'text-3xl';
  if (streak >= 7)  return 'text-2xl';
  return 'text-xl';
}

export default function StreakDisplay({ player }) {
  const controls = useAnimation();
  const prevStreak = useRef(player?.streak);

  useEffect(() => {
    if (!player) return;
    if (player.streak > (prevStreak.current || 0)) {
      controls.start({ scale: [1, 1.4, 1], transition: { duration: 0.4 } });
    }
    prevStreak.current = player.streak;
  }, [player?.streak]);

  if (!player) return null;

  const streak = player.streak || 0;
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = player.lastPlayedDate;
  const daysSince = lastPlayed
    ? Math.round((new Date(today) - new Date(lastPlayed)) / 86400000)
    : 99;
  const broken = daysSince > 1;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <motion.span animate={controls} className={flameSize(streak)}>
        {broken ? '🩶' : '🔥'}
      </motion.span>
      <span className={`text-sm font-bold ${broken ? 'text-gray-500' : 'text-orange-400'}`}>
        {streak}
      </span>
      {player.streakFreezeCount > 0 && (
        <span className="text-xs text-blue-400">🧊×{player.streakFreezeCount}</span>
      )}
    </div>
  );
}
