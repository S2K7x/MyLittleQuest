import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RARITY = {
  common: {
    glow: 'shadow-gray-400/40',
    border: 'border-gray-500',
    label: 'COMMON',
    labelColor: 'text-gray-300',
    bg: 'bg-gray-900'
  },
  rare: {
    glow: 'shadow-indigo-500/60',
    border: 'border-indigo-500',
    label: 'RARE',
    labelColor: 'text-indigo-300',
    bg: 'bg-indigo-950'
  },
  epic: {
    glow: 'shadow-purple-500/70',
    border: 'border-purple-500',
    label: 'EPIC',
    labelColor: 'text-purple-300',
    bg: 'bg-purple-950'
  }
};

export default function LootReveal({ loot, onClose }) {
  const [phase, setPhase] = useState('shake'); // shake → open → glow

  if (!loot) return null;
  const style = RARITY[loot.rarity] || RARITY.common;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={e => e.stopPropagation()}
        className={`relative rounded-3xl border-2 p-8 text-center max-w-xs w-full mx-4 shadow-2xl ${style.border} ${style.bg} ${style.glow}`}
      >
        {/* Chest shake → open */}
        <motion.div
          animate={
            phase === 'shake'
              ? { rotate: [-6, 6, -6, 6, -3, 3, 0], scale: [1, 1.05, 1] }
              : { scale: [1, 1.2, 1] }
          }
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => setPhase(p => p === 'shake' ? 'open' : 'glow')}
          className="text-6xl mb-4 select-none"
        >
          {phase === 'shake' ? '📦' : '🎁'}
        </motion.div>

        {/* Item reveal */}
        <AnimatePresence>
          {phase !== 'shake' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${style.labelColor}`}>
                {style.label} DROP
              </p>
              <p className="text-xl font-bold text-white mb-2">{loot.label}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-gray-500 text-xs mt-4">Tap anywhere to collect</p>

        {/* Dismiss button */}
        <button
          onClick={onClose}
          className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm border ${style.border} ${style.labelColor} hover:bg-white/10 transition-colors`}
        >
          Collect
        </button>
      </motion.div>
    </div>
  );
}
