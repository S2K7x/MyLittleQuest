import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMER_SECONDS = 30;
const LABELS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ question, onAnswer, onShowMap }) {
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [xpFloat, setXpFloat] = useState(false);
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);
  const answerRef = useRef(false);

  useEffect(() => {
    setSelected([]);
    setRevealed(false);
    setShowExplain(false);
    setTimeLeft(TIMER_SECONDS);
    setXpFloat(false);
    answerRef.current = false;
    startRef.current = Date.now();
  }, [question?.id]);

  // Countdown timer
  useEffect(() => {
    if (revealed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answerRef.current) submitAnswer([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question?.id, revealed]);

  const submitAnswer = useCallback((sel) => {
    if (answerRef.current) return;
    answerRef.current = true;
    clearInterval(timerRef.current);
    const timeMs = Date.now() - startRef.current;
    const correctIndices = [...(question.correct || [])].sort((a, b) => a - b);
    const selectedSorted = [...sel].sort((a, b) => a - b);
    const isCorrect = JSON.stringify(selectedSorted) === JSON.stringify(correctIndices);
    setRevealed(true);
    setShowExplain(true);
    if (isCorrect) setXpFloat(true);
    setTimeout(() => onAnswer(question.id, isCorrect, timeMs), 3000);
  }, [question, onAnswer]);

  // Keyboard support
  useEffect(() => {
    function handleKey(e) {
      if (revealed) {
        if (e.key === 'Enter') submitAnswer(selected);
        return;
      }
      const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx === undefined || idx >= (question?.options?.length || 0)) return;
      if (question?.type === 'multiple') {
        setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
      } else {
        setSelected([idx]);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [question?.id, revealed, selected, submitAnswer]);

  if (!question) return null;

  const isMultiple = question.type === 'multiple';
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-500';

  function toggleOption(idx) {
    if (revealed) return;
    if (isMultiple) {
      setSelected(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    } else {
      setSelected([idx]);
    }
  }

  function getOptionClass(idx) {
    const base = 'w-full text-left rounded-xl border p-3 flex items-start gap-3 transition-colors text-sm';
    if (!revealed) {
      return selected.includes(idx)
        ? `${base} border-blue-500 bg-blue-900/30`
        : `${base} border-gray-700 bg-gray-900 hover:border-gray-500 cursor-pointer`;
    }
    if (question.correct.includes(idx)) return `${base} border-emerald-500 bg-emerald-900/20`;
    if (selected.includes(idx)) return `${base} border-red-500 bg-red-900/20`;
    return `${base} border-gray-800 bg-gray-900/50 opacity-60`;
  }

  const isCorrectAnswer = revealed && JSON.stringify([...selected].sort((a,b)=>a-b)) === JSON.stringify([...(question.correct||[])].sort((a,b)=>a-b));

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Timer bar */}
      <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${timerColor}`}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 truncate">{question.domain}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            question.difficulty === 1 ? 'bg-green-900/60 text-green-400'
            : question.difficulty === 2 ? 'bg-yellow-900/60 text-yellow-400'
            : 'bg-red-900/60 text-red-400'
          }`}>d{question.difficulty}</span>
          <span className="text-gray-500">{timeLeft}s</span>
          <button onClick={onShowMap} className="text-gray-500 hover:text-white transition-colors ml-1">Map</button>
        </div>
      </div>

      {/* Question */}
      <p className="text-base font-medium leading-relaxed">{question.question}</p>
      {isMultiple && <p className="text-xs text-yellow-400">Select all that apply</p>}

      {/* Options */}
      <div className="space-y-2 relative">
        {question.options.map((opt, idx) => (
          <button key={idx} className={getOptionClass(idx)} onClick={() => toggleOption(idx)}>
            <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              selected.includes(idx) && !revealed ? 'bg-blue-600 text-white'
              : revealed && question.correct.includes(idx) ? 'bg-emerald-600 text-white'
              : revealed && selected.includes(idx) ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400'
            }`}>
              {LABELS[idx]}
            </span>
            <span className="flex-1">{opt}</span>
          </button>
        ))}

        {/* XP float animation */}
        <AnimatePresence>
          {xpFloat && (
            <motion.div
              key="xp-float"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute right-2 top-0 text-emerald-400 font-bold text-sm pointer-events-none"
            >
              +XP ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit / result */}
      {!revealed ? (
        <button
          disabled={selected.length === 0}
          onClick={() => submitAnswer(selected)}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-3 font-semibold text-sm transition-colors"
        >
          Confirm
        </button>
      ) : (
        <div className={`rounded-xl border p-3 text-sm ${isCorrectAnswer ? 'border-emerald-700 bg-emerald-950' : 'border-red-800 bg-red-950'}`}>
          <p className={`font-bold mb-1 ${isCorrectAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrectAnswer ? '✓ Correct!' : '✗ Wrong'}
          </p>

          {/* Explanation accordion */}
          <AnimatePresence initial={false}>
            {showExplain && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="text-gray-300 leading-relaxed">{question.explanation}</p>
                {question.examTip && (
                  <p className="mt-2 bg-yellow-900/30 border border-yellow-700/40 rounded-lg px-3 py-2 text-yellow-300 text-xs">
                    💡 {question.examTip}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-gray-500 text-xs mt-2">Auto-advancing in 3s… <kbd className="text-gray-600">Enter</kbd> to skip</p>
        </div>
      )}
    </div>
  );
}
