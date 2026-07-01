"use client";

import type {
  MatchPayload,
  QcmPayload,
  ScenarioPayload,
  SessionAsset,
  SwipePayload,
  FlashcardPayload,
} from "@/lib/content";
import QcmGame from "@/components/games/QcmGame";
import FlashcardGame from "@/components/games/FlashcardGame";
import ScenarioGame from "@/components/games/ScenarioGame";
import SwipeGame from "@/components/games/SwipeGame";
import MatchGame from "@/components/games/MatchGame";

interface Props {
  asset: SessionAsset;
  onAnswer: (wasCorrect: boolean) => void;
  onNext: () => void;
}

// Les composants de jeu ne connaissent que payload/onAnswer/onNext — le plumbing des
// concept_ids est géré par le SessionRunner, un cran au-dessus.
export default function AssetRenderer({ asset, onAnswer, onNext }: Props) {
  switch (asset.game_type) {
    case "qcm":
      return (
        <QcmGame payload={asset.payload as QcmPayload} onAnswer={onAnswer} onNext={onNext} />
      );
    case "flashcard":
      return (
        <FlashcardGame
          payload={asset.payload as FlashcardPayload}
          onAnswer={onAnswer}
          onNext={onNext}
        />
      );
    case "scenario":
      return (
        <ScenarioGame
          payload={asset.payload as ScenarioPayload}
          onAnswer={onAnswer}
          onNext={onNext}
        />
      );
    case "swipe":
      return (
        <SwipeGame payload={asset.payload as SwipePayload} onAnswer={onAnswer} onNext={onNext} />
      );
    case "match":
      return (
        <MatchGame payload={asset.payload as MatchPayload} onAnswer={onAnswer} onNext={onNext} />
      );
  }
}
