import { useState } from 'react';
import { motion } from 'framer-motion';

import xpModule from '../../engine/xp.js';
const { getXPToNextLevel } = xpModule;

export default function XPBar({ player }) {
  const [showTooltip, setShowTooltip] = useState(false);
  if (!player) return null;

  const { current, required, percentage } = getXPToNextLevel(player.xp || 0);
  // Zeigarnik effect: never show 0% or 100% — always looks "almost there"
  const displayPct = Math.min(95, Math.max(70, percentage));

  return (
    <div
      className="relative flex items-center gap-2 w-full"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="shrink-0 text-xs font-bold bg-blue-900 text-blue-300 px-1.5 py-0.5 rounded-md">
        Lv{player.level}
      </span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
          animate={{ width: `${displayPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-8 mb-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap z-50 pointer-events-none">
          {current} / {required} XP to level {(player.level || 0) + 1}
        </div>
      )}
    </div>
  );
}
