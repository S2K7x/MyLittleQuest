import fs from "fs";
import path from "path";

export interface CertificationDomain {
  id: string;
  name: string;
  weight: number;
}

export interface Certification {
  name: string;
  code: string;
  slug: string;
  exam_domains: CertificationDomain[];
  exam_guide_url: string;
  status: "not_started" | "in_progress" | "needs_review" | "complete";
}

export interface QcmPayload {
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
}

export interface QcmAsset {
  id: string;
  game_type: "qcm";
  difficulty: number;
  payload: QcmPayload;
}

export interface FlashcardPayload {
  front: string;
  back: string;
}

export interface ScenarioChoice {
  text: string;
  is_correct: boolean;
  feedback: string;
}

export interface ScenarioPayload {
  intro: string;
  choices: ScenarioChoice[];
}

export interface SwipePayload {
  statement: string;
  is_true: boolean;
  explanation: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchPayload {
  pairs: MatchPair[];
}

export type GameType = "qcm" | "flashcard" | "scenario" | "swipe" | "match";

interface BaseAsset<T extends GameType, P> {
  id: string;
  game_type: T;
  difficulty: number;
  payload: P;
}

export type FlashcardAsset = BaseAsset<"flashcard", FlashcardPayload>;
export type ScenarioAsset = BaseAsset<"scenario", ScenarioPayload>;
export type SwipeAsset = BaseAsset<"swipe", SwipePayload>;
export type MatchAsset = BaseAsset<"match", MatchPayload>;

export type AnyAsset = QcmAsset | FlashcardAsset | ScenarioAsset | SwipeAsset | MatchAsset;

export interface Concept {
  id: string;
  domain: string;
  title: string;
  core_explanation: string;
  difficulty: number;
  source_url: string;
  generated_at: string;
}

export interface AssetConceptLink {
  asset_id: string;
  concept_ids: string[];
}

export interface SessionAsset {
  id: string;
  game_type: GameType;
  difficulty: number;
  payload: QcmPayload | FlashcardPayload | ScenarioPayload | SwipePayload | MatchPayload;
  concept_ids: string[];
}

const contentDir = path.join(process.cwd(), "content");

function readJsonArray<T>(...segments: string[]): T[] {
  const filePath = path.join(contentDir, ...segments);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
}

export function getAllCertifications(): Certification[] {
  if (!fs.existsSync(contentDir)) return [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const filePath = path.join(contentDir, e.name, "certification.json");
      if (!fs.existsSync(filePath)) return [];
      return [JSON.parse(fs.readFileSync(filePath, "utf-8")) as Certification];
    });
}

export function getCertification(slug: string): Certification | null {
  const filePath = path.join(contentDir, slug, "certification.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Certification;
}

export function getQcmAssets(slug: string): QcmAsset[] {
  return readJsonArray<QcmAsset>(slug, "assets", "qcm.json");
}

export function getFlashcardAssets(slug: string): FlashcardAsset[] {
  return readJsonArray<FlashcardAsset>(slug, "assets", "flashcard.json");
}

export function getScenarioAssets(slug: string): ScenarioAsset[] {
  return readJsonArray<ScenarioAsset>(slug, "assets", "scenario.json");
}

export function getSwipeAssets(slug: string): SwipeAsset[] {
  return readJsonArray<SwipeAsset>(slug, "assets", "swipe.json");
}

export function getMatchAssets(slug: string): MatchAsset[] {
  return readJsonArray<MatchAsset>(slug, "assets", "match.json");
}

export function getConcepts(slug: string): Concept[] {
  return readJsonArray<Concept>(slug, "concepts.json");
}

export function getAssetConcepts(slug: string): AssetConceptLink[] {
  return readJsonArray<AssetConceptLink>(slug, "asset_concepts.json");
}

// Agrège les 5 types d'assets et attache les concept_ids liés (via asset_concepts.json) à
// chaque asset — c'est ce que consomme une session de jeu.
export function getAllAssets(slug: string): SessionAsset[] {
  const links = new Map(getAssetConcepts(slug).map((l) => [l.asset_id, l.concept_ids]));
  const all: AnyAsset[] = [
    ...getQcmAssets(slug),
    ...getFlashcardAssets(slug),
    ...getScenarioAssets(slug),
    ...getSwipeAssets(slug),
    ...getMatchAssets(slug),
  ];
  return all.map((a) => ({
    id: a.id,
    game_type: a.game_type,
    difficulty: a.difficulty,
    payload: a.payload,
    concept_ids: links.get(a.id) ?? [],
  }));
}
