import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as db from './db/supabase.js';
import CertPicker from '../../shared/components/CertPicker/CertPicker.jsx';
import ModuleMap from '../../shared/components/ModuleMap/ModuleMap.jsx';
import QuestionCard from '../../shared/components/QuestionCard/QuestionCard.jsx';
import XPBar from '../../shared/components/XPBar/XPBar.jsx';
import StreakDisplay from '../../shared/components/StreakDisplay/StreakDisplay.jsx';
import LootReveal from '../../shared/components/LootReveal/LootReveal.jsx';
import DailyQuest from '../../shared/components/DailyQuest/DailyQuest.jsx';
import MissionBoard from '../../shared/components/MissionBoard/MissionBoard.jsx';

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
db.init(supabaseClient);

export default function App() {
  const [player, setPlayer] = useState(null);
  const [cert, setCert] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [loot, setLoot] = useState(null);
  const [view, setView] = useState('picker');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data }) => {
      const uid = data?.user?.id;
      if (!uid) return;
      setUserId(uid);
      db.getPlayer(uid).then(setPlayer).catch(() => null);
    });
  }, []);

  function handleCertSelect(selectedCert, certQuestions) {
    setCert(selectedCert);
    setQuestions(certQuestions);
    setCurrentQ(certQuestions[Math.floor(Math.random() * certQuestions.length)]);
    setView('play');
  }

  async function handleAnswer(questionId, correct, timeMs) {
    if (!userId) return;
    const result = await db.saveAnswer(userId, cert.id, questionId, correct, timeMs);
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + result.xpEarned,
      level: result.newLevel
    }));
    if (result.loot) setLoot(result.loot);
    const remaining = questions.filter(q => q.id !== questionId);
    if (remaining.length > 0) {
      setCurrentQ(remaining[Math.floor(Math.random() * remaining.length)]);
    }
  }

  if (!userId) {
    return (
      <div className="auth-wall">
        <h1>MyLittleQuest</h1>
        <button onClick={() => supabaseClient.auth.signInWithOAuth({ provider: 'google' })}>
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!player) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <header className="app-header">
        <XPBar player={player} />
        <StreakDisplay player={player} />
      </header>

      {view === 'picker' && (
        <CertPicker onSelect={handleCertSelect} />
      )}

      {view === 'map' && cert && (
        <ModuleMap cert={cert} onBack={() => setView('picker')} onPlay={() => setView('play')} />
      )}

      {view === 'play' && currentQ && (
        <QuestionCard
          question={currentQ}
          onAnswer={handleAnswer}
          onShowMap={() => setView('map')}
        />
      )}

      {view === 'board' && cert && (
        <MissionBoard certId={cert.id} playerId={userId} db={db} />
      )}

      {loot && (
        <LootReveal loot={loot} onClose={() => setLoot(null)} />
      )}

      {cert && view === 'play' && (
        <DailyQuest playerId={userId} certId={cert.id} db={db} />
      )}

      <nav className="bottom-nav">
        <button onClick={() => setView('picker')}>Certs</button>
        {cert && <button onClick={() => setView('map')}>Map</button>}
        {cert && <button onClick={() => setView('play')}>Play</button>}
        {cert && <button onClick={() => setView('board')}>Board</button>}
      </nav>
    </div>
  );
}
