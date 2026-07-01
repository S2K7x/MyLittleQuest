"use client";

import { useMemo, useState } from "react";
import { FEEDBACK } from "@/lib/ui/feedback";

interface MatchPair {
  left: string;
  right: string;
}

interface MatchPayload {
  pairs: MatchPair[];
}

interface Props {
  payload: MatchPayload;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MatchGame({ payload, onAnswer, onNext }: Props) {
  const rightItems = useMemo(() => shuffle(payload.pairs.map((p) => p.right)), [payload]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ left: string; right: string } | null>(null);

  const allResolved = resolved.size === payload.pairs.length;

  function handleLeftTap(left: string) {
    if (resolved.has(left) || wrongFlash) return;
    setSelectedLeft(left);
  }

  function handleRightTap(right: string) {
    if (wrongFlash) return;
    if (!selectedLeft) return;

    const pair = payload.pairs.find((p) => p.left === selectedLeft);
    const isMatch = pair?.right === right;

    onAnswer(isMatch);

    if (isMatch) {
      setResolved((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
    } else {
      setWrongFlash({ left: selectedLeft, right });
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedLeft(null);
      }, 500);
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <p className="text-xs text-gray-400 text-center">
        Associe chaque élément à gauche à sa correspondance à droite
      </p>

      <div className="grid grid-cols-2 gap-3">
        <ul className="flex flex-col gap-2">
          {payload.pairs.map((pair) => {
            const isResolved = resolved.has(pair.left);
            const isSelected = selectedLeft === pair.left;
            const isWrong = wrongFlash?.left === pair.left;

            let className =
              "px-3 py-3 rounded-xl border text-sm text-left transition-all duration-300 touch-manipulation ";

            if (isResolved) {
              className += "opacity-0 scale-95 h-0 py-0 overflow-hidden border-transparent";
            } else if (isWrong) {
              className += FEEDBACK.incorrect;
            } else if (isSelected) {
              className += "bg-blue-50 border-blue-400 text-blue-800 font-medium";
            } else {
              className += FEEDBACK.neutralActive;
            }

            return (
              <li key={pair.left}>
                <button className={className} onClick={() => handleLeftTap(pair.left)}>
                  {pair.left}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="flex flex-col gap-2">
          {rightItems.map((right) => {
            const pair = payload.pairs.find((p) => p.right === right)!;
            const isResolved = resolved.has(pair.left);
            const isWrong = wrongFlash?.right === right;

            let className =
              "px-3 py-3 rounded-xl border text-sm text-left transition-all duration-300 touch-manipulation ";

            if (isResolved) {
              className += "opacity-0 scale-95 h-0 py-0 overflow-hidden border-transparent";
            } else if (isWrong) {
              className += FEEDBACK.incorrect;
            } else {
              className += FEEDBACK.neutralActive;
            }

            return (
              <li key={right}>
                <button className={className} onClick={() => handleRightTap(right)}>
                  {right}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {allResolved && (
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
