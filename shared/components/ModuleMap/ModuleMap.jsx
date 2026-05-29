import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import XPBar from '../XPBar/XPBar.jsx';
import StreakDisplay from '../StreakDisplay/StreakDisplay.jsx';
import DailyQuest from '../DailyQuest/DailyQuest.jsx';

function AccuracyBadge({ accuracy, answered }) {
  if (answered === 0) return <span className="text-xs text-gray-600">No answers yet</span>;
  const color = accuracy >= 80 ? 'text-green-400' : accuracy >= 60 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`text-xs font-semibold ${color}`}>{accuracy}% accuracy</span>;
}

export default function ModuleMap({ playerId, apiBase = '' }) {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [certStats, setCertStats] = useState(null);
  const [certProgress, setCertProgress] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!certId) return;
    Promise.all([
      fetch(`${apiBase}/api/certifications`).then(r => r.json()),
      fetch(`${apiBase}/api/certifications/${certId}/stats`).then(r => r.json()),
      fetch(`${apiBase}/api/player/${playerId}`).then(r => r.json())
    ]).then(([certs, stats, p]) => {
      setCert(certs.find(c => c.id === certId) || null);
      setCertStats(stats);
      setPlayer(p);
    });

    fetch(`${apiBase}/api/certifications/${certId}/stats`).then(r => r.json()).then(setCertStats);

    // player progress for byModule breakdown
    fetch(`${apiBase}/api/player/${playerId}`).then(r => r.json()).then(setPlayer);

    // get cert progress from missions data (reuse stats endpoint for module totals)
    // we use the questions endpoint stats + leaderboard for accuracy
    // Actually we need progress — let's use the missions endpoint which computes it
  }, [certId, playerId, apiBase]);

  useEffect(() => {
    if (!certId || !playerId) return;
    // Fetch missions to get byModule progress baked in
    fetch(`${apiBase}/api/missions/${playerId}/${certId}`)
      .then(r => r.json())
      .catch(() => null); // missions also calls getCertProgress internally

    // Use the stats + a player progress endpoint
    // The server exposes GET /api/certifications/:certId/stats for total by module
    // For per-player progress we call the leaderboard (has XP but not module breakdown)
    // The cleanest is to fetch directly; server currently only exposes getCertProgress via missions
    // So we approximate: use stats for totals, store as "available"
  }, [certId, playerId, apiBase]);

  if (!cert) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading…
      </div>
    );
  }

  const modules = cert.modules || [];
  const statsByModule = certStats ? certStats.byModule : {};

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Cert header */}
      <div
        className="rounded-2xl p-4 border"
        style={{ borderColor: cert.color + '44', background: cert.color + '11' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{cert.icon}</span>
          <div>
            <h1 className="font-bold text-lg" style={{ color: cert.color }}>{cert.name}</h1>
            <p className="text-gray-400 text-xs">{cert.code} · Pass {cert.passingScore}/{cert.passingScoreMax} · {cert.durationMinutes} min</p>
          </div>
        </div>
        {player && (
          <div className="flex items-center gap-4">
            <div className="flex-1"><XPBar player={player} /></div>
            <StreakDisplay player={player} />
          </div>
        )}
      </div>

      {/* Daily quest */}
      <DailyQuest playerId={playerId} certId={certId} apiBase={apiBase} />

      {/* Modules */}
      <div className="space-y-3">
        {modules.map((mod, idx) => {
          const available = statsByModule[mod.id] || 0;
          const isLocked = false; // first module always open; unlock logic can be added later

          return (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              whileHover={isLocked ? {} : { scale: 1.01 }}
              whileTap={isLocked ? {} : { scale: 0.99 }}
              disabled={isLocked}
              onClick={() => !isLocked && navigate(`/play/${certId}/${mod.id}`)}
              className={`w-full text-left rounded-xl border p-4 transition-colors ${
                isLocked
                  ? 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-500 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">M{mod.id}</span>
                    <span className="font-semibold text-sm truncate">{mod.name}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{available} questions available</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{mod.weight}%</span>
                  {isLocked
                    ? <span className="text-gray-600 text-sm">🔒</span>
                    : <span className="text-blue-400 text-xs">Play →</span>
                  }
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Play all button */}
      <button
        onClick={() => navigate(`/play/${certId}/all`)}
        className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-semibold text-sm transition-colors"
      >
        Practice All Modules
      </button>

      {/* Missions link */}
      <button
        onClick={() => navigate(`/missions/${certId}`)}
        className="w-full border border-gray-700 hover:border-gray-500 rounded-xl py-3 font-semibold text-sm text-gray-300 transition-colors"
      >
        🏆 View Missions
      </button>
    </div>
  );
}
