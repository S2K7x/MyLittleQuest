"use client";

import { useState } from "react";

interface QcmPayload {
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
}

interface Props {
  payload: QcmPayload;
  onNext?: () => void;
}

export default function QcmGame({ payload, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleChoice(index: number) {
    if (answered) return;
    setSelected(index);
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-medium text-gray-900 leading-snug">
        {payload.question}
      </p>

      <ul className="flex flex-col gap-3">
        {payload.choices.map((choice, i) => {
          let className =
            "w-full text-left px-4 py-4 rounded-2xl border text-sm transition-colors touch-manipulation ";

          if (!answered) {
            className += "bg-white border-gray-200 active:bg-gray-50";
          } else if (i === payload.correct_index) {
            className +=
              "bg-green-50 border-green-400 text-green-800 font-medium";
          } else if (i === selected) {
            className += "bg-red-50 border-red-400 text-red-800";
          } else {
            className += "bg-white border-gray-100 text-gray-300";
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

      {answered && onNext && (
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
