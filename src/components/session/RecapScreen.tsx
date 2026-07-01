"use client";

import Link from "next/link";
import type { Concept } from "@/lib/content";

interface Props {
  certSlug: string;
  score: number;
  lives: number;
  conceptIds: string[];
  concepts: Concept[];
}

export default function RecapScreen({ certSlug, score, lives, conceptIds, concepts }: Props) {
  const conceptTitles = conceptIds
    .map((id) => concepts.find((c) => c.id === id)?.title)
    .filter((title): title is string => Boolean(title));

  const gameOver = lives <= 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <p className="text-4xl mb-2">{gameOver ? "💔" : "🎉"}</p>
        <h1 className="text-xl font-bold text-gray-900">
          {gameOver ? "Session terminée" : "Session terminée !"}
        </h1>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-2xl px-4 py-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{score}</p>
          <p className="text-xs text-gray-400 mt-1">points</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl px-4 py-5 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">
            {"❤️".repeat(Math.max(lives, 0)) || "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">vies restantes</p>
        </div>
      </div>

      {conceptTitles.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Concepts abordés
          </h2>
          <ul className="flex flex-col gap-2">
            {conceptTitles.map((title) => (
              <li
                key={title}
                className="bg-white rounded-xl px-4 py-3 text-sm text-gray-800 shadow-sm"
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Link
          href={`/certif/${certSlug}/play`}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-sm text-center active:bg-blue-700 touch-manipulation"
        >
          Rejouer
        </Link>
        <Link
          href={`/certif/${certSlug}`}
          className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold text-sm text-center active:bg-gray-50 touch-manipulation"
        >
          Retour à la certification
        </Link>
      </div>
    </div>
  );
}
