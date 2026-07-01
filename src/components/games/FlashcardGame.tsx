"use client";

import { useState } from "react";

interface FlashcardPayload {
  front: string;
  back: string;
}

interface Props {
  payload: FlashcardPayload;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

export default function FlashcardGame({ payload, onAnswer, onNext }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);

  function handleRate(knew: boolean) {
    if (rated) return;
    setRated(true);
    onAnswer(knew);
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div
        className="relative w-full h-64 cursor-pointer touch-manipulation"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm px-6 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-base font-medium text-gray-900 leading-snug">
              {payload.front}
            </p>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 shadow-sm px-6 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-sm text-blue-900 leading-relaxed">{payload.back}</p>
          </div>
        </div>
      </div>

      {!flipped && (
        <p className="text-center text-xs text-gray-400">
          Tape la carte pour voir la réponse
        </p>
      )}

      {flipped && !rated && (
        <div className="flex gap-3">
          <button
            className="flex-1 py-4 bg-red-50 border border-red-300 text-red-700 rounded-2xl font-semibold text-sm active:bg-red-100 touch-manipulation"
            onClick={() => handleRate(false)}
          >
            Je savais pas
          </button>
          <button
            className="flex-1 py-4 bg-green-50 border border-green-300 text-green-700 rounded-2xl font-semibold text-sm active:bg-green-100 touch-manipulation"
            onClick={() => handleRate(true)}
          >
            Je savais
          </button>
        </div>
      )}

      {rated && (
        <button
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold text-sm active:bg-blue-700 touch-manipulation"
          onClick={onNext}
        >
          Suivant →
        </button>
      )}
    </div>
  );
}
