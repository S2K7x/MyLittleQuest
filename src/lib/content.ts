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

const contentDir = path.join(process.cwd(), "content");

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
  const filePath = path.join(contentDir, slug, "assets", "qcm.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as QcmAsset[];
}
