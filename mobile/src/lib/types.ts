/**
 * Types the mobile client shares with the server API.
 *
 * These are a deliberate mirror of lib/types.ts in the web app, restricted to
 * what the app actually sends and reads. The server is the source of truth: it
 * validates everything again, so a stale client can never widen what is accepted.
 */

export type Language = "en" | "hi" | "gu";

export const LANGUAGES: { code: Language; native: string }[] = [
  { code: "en", native: "English" },
  { code: "hi", native: "हिन्दी" },
  { code: "gu", native: "ગુજરાતી" },
];

export type Need = "vent" | "calm" | "solve" | "plan" | "distract" | "human";

export const NEEDS: Need[] = ["vent", "calm", "solve", "plan", "distract", "human"];

export type AgeBand = "teen" | "young" | "adult" | "older";

export interface ChatResponse {
  reply: string;
  supportMode: "normal" | "elevated" | "crisis";
  riskLevel: number;
  kinds: string[];
  showCrisisPanel: boolean;
  suggestedReplies: string[];
  provider: string;
  demo: boolean;
  deterministic: boolean;
  resourceIds: string[];
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface Helpline {
  id: string;
  name: string;
  numbers: { display: string; dial: string }[];
  hours: string;
  languages: string;
  who: string;
  url?: string;
  region: "IN" | "GLOBAL";
  official: boolean;
  note?: string;
}

export interface Profile {
  consentedAt: string | null;
  language: Language;
  isMinor: boolean;
  memoryEnabled: boolean;
}
