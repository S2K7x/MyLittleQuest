"use client";

import { useState } from "react";
import { FEEDBACK } from "@/lib/ui/feedback";

interface QcmPayload {
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
}

interface Props {
  payload: QcmPayload;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

export default function QcmGame({ payload, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleChoice(index: number) {
    if (answered) return;
    setSelected(index);
    onAnswer(index === payload.correct_index);
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <p className="text-base font-medium text-gray-900 leading-snug">
        {payload.question}
      </p>

      <ul className="flex flex-col gap-3">
        {payload.choices.map((choice, i) => {
          let className =
            "w-full text-left px-4 py-4 rounded-2xl border text-sm transition-colors touch-manipulation ";

          if (!answered) {
            className += FEEDBACK.neutralActive;
          } else if (i === payload.correct_index) {
            className += `${FEEDBACK.correct} font-medium`;
          } else if (i === selected) {
            className += FEEDBACK.incorrect;
          } else {
            className += FEEDBACK.neutralDisabled;
          }

          return (
            <li key={i}>
              <button className={className} onClick={() => handleChoice(i)}>
                {choice}
              </button>
            </li>
          );
        })}
      </ul>

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
