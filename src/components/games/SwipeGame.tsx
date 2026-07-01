"use client";

import { useRef, useState } from "react";
import { FEEDBACK } from "@/lib/ui/feedback";

interface SwipePayload {
  statement: string;
  is_true: boolean;
  explanation: string;
}

interface Props {
  payload: SwipePayload;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

const SWIPE_THRESHOLD = 80;

export default function SwipeGame({ payload, onAnswer, onNext }: Props) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [guess, setGuess] = useState<boolean | null>(null);
  const startX = useRef(0);
  const answered = guess !== null;

  function handleGuess(guessedTrue: boolean) {
    if (answered) return;
    setDragX(0);
    setDragging(false);
    setGuess(guessedTrue);
    onAnswer(guessedTrue === payload.is_true);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (answered) return;
    startX.current = e.clientX;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging || answered) return;
    setDragX(e.clientX - startX.current);
  }

  function onPointerUp() {
    if (!dragging || answered) return;
    setDragging(false);
    if (dragX > SWIPE_THRESHOLD) handleGuess(true);
    else if (dragX < -SWIPE_THRESHOLD) handleGuess(false);
    else setDragX(0);
  }

  const wasCorrect = answered && guess === payload.is_true;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div
        className={`relative rounded-2xl border px-6 py-10 text-center select-none touch-none transition-colors ${
          !answered ? FEEDBACK.neutralActive : wasCorrect ? FEEDBACK.correct : FEEDBACK.incorrect
        }`}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`,
          transition: dragging ? "none" : "transform 250ms ease-out",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <p className="text-base font-medium text-gray-900 leading-snug">
          {payload.statement}
        </p>
      </div>

      {!answered && (
        <p className="text-center text-xs text-gray-400">
          Glisse à droite pour "Vrai", à gauche pour "Faux"
        </p>
      )}

      {!answered && (
        <div className="flex gap-3">
          <button
            className="flex-1 py-4 bg-red-50 border border-red-300 text-red-700 rounded-2xl font-semibold text-sm active:bg-red-100 touch-manipulation"
            onClick={() => handleGuess(false)}
          >
            Faux
          </button>
          <button
            className="flex-1 py-4 bg-green-50 border border-green-300 text-green-700 rounded-2xl font-semibold text-sm active:bg-green-100 touch-manipulation"
            onClick={() => handleGuess(true)}
          >
            Vrai
          </button>
        </div>
      )}

      {answered && (
        <div className="rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-600 leading-relaxed">
          {payload.explanation}
        </div>
      )}

      {answered && (
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
