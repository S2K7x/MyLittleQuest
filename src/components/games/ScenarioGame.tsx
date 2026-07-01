"use client";

import { useState } from "react";
import { FEEDBACK } from "@/lib/ui/feedback";

interface ScenarioChoice {
  text: string;
  is_correct: boolean;
  feedback: string;
}

interface ScenarioPayload {
  intro: string;
  choices: ScenarioChoice[];
}

interface Props {
  payload: ScenarioPayload;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

export default function ScenarioGame({ payload, onAnswer, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleChoice(index: number) {
    if (answered) return;
    setSelected(index);
    onAnswer(payload.choices[index].is_correct);
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <p className="text-base font-medium text-gray-900 leading-relaxed">
        {payload.intro}
      </p>

      <ul className="flex flex-col gap-3">
        {payload.choices.map((choice, i) => {
          let className =
            "w-full text-left px-4 py-4 rounded-2xl border text-sm transition-colors touch-manipulation ";

          if (!answered) {
            className += FEEDBACK.neutralActive;
          } else if (i === selected) {
            className += choice.is_correct
              ? `${FEEDBACK.correct} font-medium`
              : FEEDBACK.incorrect;
          } else {
            className += FEEDBACK.neutralDisabled;
          }

          return (
            <li key={i}>
              <button className={className} onClick={() => handleChoice(i)}>
                {choice.text}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div
          className={`rounded-2xl px-4 py-4 text-sm leading-relaxed border ${
            payload.choices[selected].is_correct ? FEEDBACK.correct : FEEDBACK.incorrect
          }`}
        >
          {payload.choices[selected].feedback}
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
