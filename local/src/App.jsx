import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { useLocalPlayer, useUpdatePlayer, PLAYER_ID } from './hooks/useLocalPlayer.js';
import CertPicker from '@components/CertPicker/CertPicker.jsx';
import ModuleMap from '@components/ModuleMap/ModuleMap.jsx';
import QuestionCard from '@components/QuestionCard/QuestionCard.jsx';
import XPBar from '@components/XPBar/XPBar.jsx';
import StreakDisplay from '@components/StreakDisplay/StreakDisplay.jsx';
import LootReveal from '@components/LootReveal/LootReveal.jsx';
import MissionBoard from '@components/MissionBoard/MissionBoard.jsx';

// ─────────────────────────────────────────────────────────
// Name setup modal
// ─────────────────────────────────────────────────────────
function NameModal({ onSave }) {
  const [value, setValue] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h2 className="text-xl font-bold mb-2">Welcome to MyLittleQuest</h2>
        <p className="text-gray-400 mb-6 text-sm">What should we call you?</p>
        <input
          autoFocus
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-blue-500 mb-4"
          placeholder="Your hero name…"
          value={value}
          maxLength={24}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onSave(value.trim()); }}
        />
        <button
          disabled={!value.trim()}
          onClick={() => onSave(value.trim())}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg py-3 font-semibold transition-colors"
        >
          Start Quest →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Play screen — QuestionCard game loop
// ─────────────────────────────────────────────────────────
function PlayScreen({ onLoot }) {
  const { certId, moduleId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [excludeIds, setExcludeIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setExcludeIds([]);
    const params = new URLSearchParams({ limit: '1', playerId: PLAYER_ID });
    if (moduleId && moduleId !== 'all') params.set('moduleId', moduleId);
    fetch(`/api/certifications/${certId}/questions?${params}`)
      .then(r => r.json())
      .then(qs => {
        if (qs.length > 0) setCurrentQ(qs[0]);
        setLoading(false);
      });
  }, [certId, moduleId]);

  async function handleAnswer(questionId, correct, timeMs) {
    const res = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: PLAYER_ID,
        certId,
        questionId,
        moduleId: currentQ?.moduleId || 0,
        correct,
        timeMs
      })
    });
    const result = await res.json();
    if (result.loot) onLoot(result.loot);

    // fetch next question, excluding already-seen ones
    const nextExclude = [...excludeIds, questionId];
    setExcludeIds(nextExclude);
    const params = new URLSearchParams({
      limit: '1',
      playerId: PLAYER_ID,
      excludeIds: nextExclude.join(',')
    });
    if (moduleId && moduleId !== 'all') params.set('moduleId', moduleId);
    const nextRes = await fetch(`/api/certifications/${certId}/questions?${params}`);
    const nextQs = await nextRes.json();
    setCurrentQ(nextQs.length > 0 ? nextQs[0] : null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading questions…
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
        <div className="text-4xl">🎉</div>
        <p className="text-lg font-semibold">All questions answered!</p>
        <p className="text-gray-400 text-sm">Come back after the daily content update for more.</p>
        <button
          onClick={() => navigate(`/cert/${certId}`)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Back to Map
        </button>
      </div>
    );
  }

  return (
    <QuestionCard
      question={currentQ}
      onAnswer={handleAnswer}
      onShowMap={() => navigate(`/cert/${certId}`)}
    />
  );
}

// ─────────────────────────────────────────────────────────
// Profile screen
// ─────────────────────────────────────────────────────────
function ProfileScreen({ player }) {
  if (!player) return null;
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-gray-900 rounded-xl p-4 space-y-2">
        <p className="text-lg font-semibold">{player.name}</p>
        <p className="text-gray-400 text-sm">Level {player.level} · {player.xp} XP total</p>
        <p className="text-gray-400 text-sm">🔥 {player.streak} day streak</p>
        {player.streakFreezeCount > 0 && (
          <p className="text-blue-400 text-sm">🧊 {player.streakFreezeCount} streak freeze(s)</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────
export default function App() {
  const { data: player, isLoading } = useLocalPlayer();
  const { mutate: updatePlayer } = useUpdatePlayer();
  const [loot, setLoot] = useState(null);
  const [online, setOnline] = useState(true);
  const onlineRef = useRef(online);
  onlineRef.current = online;

  // Offline indicator
  useEffect(() => {
    function check() {
      fetch('/health', { signal: AbortSignal.timeout(3000) })
        .then(r => r.ok ? setOnline(true) : setOnline(false))
        .catch(() => setOnline(false));
    }
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);

  const showNameModal = player && player.name === 'CloudHero';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-4 py-2 flex items-center gap-3">
        <Link to="/" className="text-sm font-bold text-white tracking-tight shrink-0">
          ⚔️ Quest
        </Link>
        <div className="flex-1 min-w-0">
          {player && <XPBar player={player} />}
        </div>
        {player && <StreakDisplay player={player} />}
        <span
          title={online ? 'Server online' : 'Server offline'}
          className={`w-2 h-2 rounded-full shrink-0 ${online ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<CertPicker apiBase="" onSelect={() => {}} />} />
          <Route path="/cert/:certId" element={
            <ModuleMap playerId={PLAYER_ID} apiBase="" />
          } />
          <Route path="/play/:certId/:moduleId" element={
            <PlayScreen onLoot={setLoot} />
          } />
          <Route path="/missions/:certId" element={
            <MissionsBoardScreen />
          } />
          <Route path="/profile" element={<ProfileScreen player={player} />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-gray-950/90 backdrop-blur border-t border-gray-800 flex safe-bottom">
        <NavLink to="/" icon="🏠" label="Home" />
        <NavLink to="/profile" icon="👤" label="Profile" />
      </nav>

      {/* Overlays */}
      {showNameModal && (
        <NameModal onSave={name => updatePlayer({ name })} />
      )}
      {loot && (
        <LootReveal loot={loot} onClose={() => setLoot(null)} />
      )}
    </div>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex-1 flex flex-col items-center justify-center py-3 text-gray-400 hover:text-white transition-colors text-xs gap-1"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function MissionsBoardScreen() {
  const { certId } = useParams();
  return <MissionBoard certId={certId} playerId={PLAYER_ID} apiBase="" />;
}
