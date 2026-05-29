import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DIFFICULTY_COLORS = {
  beginner:     'bg-green-900 text-green-300',
  associate:    'bg-yellow-900 text-yellow-300',
  professional: 'bg-orange-900 text-orange-300',
  specialty:    'bg-red-900 text-red-300'
};

export default function CertPicker({ apiBase = '', onSelect }) {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiBase}/api/certifications`)
      .then(r => r.json())
      .then(data => { setCerts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [apiBase]);

  function handlePick(cert) {
    if (cert.totalQuestions < 20) return;
    if (onSelect) onSelect(cert);
    navigate(`/cert/${cert.id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading certifications…
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Choose your quest</h1>
      <p className="text-gray-400 text-sm mb-6">Select a certification to start practising</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certs.map((cert, i) => {
          const comingSoon = cert.totalQuestions < 20;
          return (
            <motion.button
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={comingSoon ? {} : { scale: 1.02 }}
              whileTap={comingSoon ? {} : { scale: 0.98 }}
              onClick={() => handlePick(cert)}
              disabled={comingSoon}
              className={`relative text-left rounded-2xl border p-5 transition-colors ${
                comingSoon
                  ? 'border-gray-800 bg-gray-900/40 cursor-not-allowed opacity-60'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-500 cursor-pointer'
              }`}
              style={comingSoon ? {} : { borderColor: cert.color + '55' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{cert.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{cert.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{cert.provider} · {cert.code}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_COLORS[cert.difficulty] || 'bg-gray-800 text-gray-300'}`}>
                      {cert.difficulty}
                    </span>
                    <span className="text-gray-500 text-xs">{cert.totalQuestions} questions</span>
                  </div>
                </div>
              </div>

              {comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-950/60">
                  <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Coming soon</span>
                </div>
              )}
            </motion.button>
          );
        })}

        {certs.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-12">No certifications found.</p>
        )}
      </div>
    </div>
  );
}
