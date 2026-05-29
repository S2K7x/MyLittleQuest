import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function MissionBoard({ certId: certIdProp, playerId, apiBase = '' }) {
  const params = useParams();
  const certId = certIdProp || params.certId;
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);

  function loadMissions() {
    if (!certId || !playerId) return;
    fetch(`${apiBase}/api/missions/${playerId}/${certId}`)
      .then(r => r.json())
      .then(data => { setMissions(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadMissions(); }, [certId, playerId, apiBase]);

  async function handleClaim(mission) {
    setClaiming(mission.id);
    try {
      const res = await fetch(`${apiBase}/api/missions/${playerId}/${mission.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certId })
      });
      if (res.ok) loadMissions();
    } finally {
      setClaiming(null);
    }
  }

  const completed = missions.filter(m => m.completed).length;

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-gray-400">Loading missions…</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Missions</h2>
        <span className="text-sm text-gray-400">{completed}/{missions.length} complete</span>
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
          animate={{ width: `${missions.length > 0 ? (completed / missions.length) * 100 : 0}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        <AnimatePresence>
          {missions.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border p-4 ${
                mission.claimed
                  ? 'border-gray-800 bg-gray-900/30 opacity-60'
                  : mission.completed
                  ? 'border-yellow-700/60 bg-yellow-950/30'
                  : 'border-gray-700 bg-gray-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{mission.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{mission.title}</p>
                    {mission.claimed && <span className="text-xs text-gray-500">✓ Claimed</span>}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{mission.description}</p>

                  {/* Progress bar */}
                  <div className="mt-2 space-y-1">
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${mission.completed ? 'bg-yellow-500' : 'bg-blue-600'}`}
                        animate={{ width: `${Math.min(100, mission.target > 0 ? (mission.progress / mission.target) * 100 : 0)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {mission.conditionType === 'module_accuracy'
                        ? `${mission.progress}% / ${mission.target}% accuracy`
                        : `${mission.progress} / ${mission.target}`}
                    </p>
                  </div>
                </div>

                {/* Reward + claim */}
                <div className="shrink-0 text-right space-y-1">
                  <p className="text-xs text-yellow-400 font-semibold">+{mission.reward?.xp} XP</p>
                  {mission.completed && !mission.claimed ? (
                    <motion.button
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      onClick={() => handleClaim(mission)}
                      disabled={claiming === mission.id}
                      className="text-xs bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60 rounded-lg px-2 py-1 font-semibold transition-colors"
                    >
                      {claiming === mission.id ? '…' : 'Claim'}
                    </motion.button>
                  ) : mission.claimed ? (
                    <span className="text-xs text-gray-600">🏅</span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {missions.length === 0 && (
          <p className="text-center text-gray-500 py-8">No missions for this certification yet.</p>
        )}
      </div>
    </div>
  );
}
