"use client";

import { useEffect, useRef, useState } from "react";
import type { Concept, SessionAsset } from "@/lib/content";
import { createSession, endSession, recordAnswer } from "@/lib/db";
import AssetRenderer from "./AssetRenderer";
import RecapScreen from "./RecapScreen";

interface Props {
  certSlug: string;
  assets: SessionAsset[];
  concepts: Concept[];
}

const STARTING_LIVES = 3;

export default function SessionRunner({ certSlug, assets, concepts }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [coveredConceptIds, setCoveredConceptIds] = useState<Set<string>>(new Set());
  const endedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    createSession(certSlug, STARTING_LIVES).then((session) => {
      if (!cancelled) setSessionId(session.session_id);
    });
    return () => {
      cancelled = true;
    };
  }, [certSlug]);

  const finished = currentIndex >= assets.length || lives <= 0;

  useEffect(() => {
    if (finished && sessionId && !endedRef.current) {
      endedRef.current = true;
      endSession(sessionId);
    }
  }, [finished, sessionId]);

  async function handleAnswer(wasCorrect: boolean) {
    if (!sessionId) return;
    const asset = assets[currentIndex];

    setCoveredConceptIds((prev) => {
      const next = new Set(prev);
      asset.concept_ids.forEach((id) => next.add(id));
      return next;
    });

    const { session } = await recordAnswer({
      sessionId,
      conceptIds: asset.concept_ids,
      wasCorrect,
    });

    setScore(session.score);
    setLives(session.lives);
  }

  function handleNext() {
    setCurrentIndex((i) => i + 1);
  }

  if (finished) {
    return (
      <RecapScreen
        certSlug={certSlug}
        score={score}
        lives={lives}
        conceptIds={Array.from(coveredConceptIds)}
        concepts={concepts}
      />
    );
  }

  const current = assets[currentIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          {currentIndex + 1} / {assets.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-gray-900 font-medium">{score} pts</span>
          <span>{"❤️".repeat(Math.max(lives, 0))}</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentIndex / assets.length) * 100}%` }}
        />
      </div>

      <AssetRenderer key={current.id} asset={current} onAnswer={handleAnswer} onNext={handleNext} />
    </div>
  );
}
