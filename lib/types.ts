/**
 * Shared domain types for StressFree AI.
 *
 * Design note: the app never infers support needs from gender, caste, religion
 * or any other immutable trait. It adapts to what the person actually says:
 * their stated feeling, intensity, domain of stress, age band and chosen
 * support mode.
 */

export type Language = "en" | "hi" | "gu";

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
];

/** What the person says they want right now (the "What do you need now?" screen). */
export type Need = "vent" | "calm" | "solve" | "plan" | "distract" | "human";

export const NEEDS: Need[] = ["vent", "calm", "solve", "plan", "distract", "human"];

/** Coarse age band. Only used to tune tone and safety routing, never stored with content. */
export type AgeBand = "teen" | "young" | "adult" | "older";

export const AGE_BANDS: AgeBand[] = ["teen", "young", "adult", "older"];

/** The life area the stress seems to be about. Used to pick coping tools, not to diagnose. */
export type Domain =
  | "study"
  | "work"
  | "money"
  | "relationship"
  | "family"
  | "health"
  | "identity"
  | "other";

/** Risk kinds that route to human help. */
export type RiskKind =
  | "self-harm"
  | "suicide"
  | "harm-to-other"
  | "abuse"
  | "medical-emergency"
  | "substance"
  | "eating"
  | "psychosis"
  | "exploitation";

/**
 * 0 = no signal, 1 = watch (distress words), 2 = elevated (needs gentle safety check),
 * 3 = crisis (stop the normal chat, prioritise immediate safety).
 */
export type RiskLevel = 0 | 1 | 2 | 3;

export interface TriageResult {
  level: RiskLevel;
  kinds: RiskKind[];
  /** Stable ids of the lexicon rules that fired, for anonymised safety metrics. */
  signals: string[];
  /** Phrases that lowered the score (idioms like "this exam is killing me"). */
  suppressed: string[];
  /** Person explicitly asked for a human / doctor / counsellor. */
  wantsHuman: boolean;
  /** True when the message expresses a plan, means or timeframe. Raises urgency. */
  hasPlan: boolean;
}

export interface MoodEntry {
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** 1 (very low) to 5 (good). */
  score: number;
  tags: string[];
  note?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone?: string;
}

/** One topic line inside an exam plan. Client-only; never sent to the API. */
export interface StudyTopic {
  id: string;
  text: string;
  done: boolean;
}

/** A local exam plan. Stays in the browser, like the rest of the student tools. */
export interface ExamPlan {
  exam: string;
  /** ISO date string (YYYY-MM-DD) or empty. */
  date: string;
  topics: StudyTopic[];
}

/** One small, same-day goal. Deliberately not a task manager. */
export interface Goal {
  id: string;
  text: string;
  done: boolean;
}

/** Everything the person has chosen, kept on their own device by default. */
export interface UserProfile {
  /** Onboarding consent to use the companion at all. */
  consentedAt: string | null;
  /** Under-18 flow requires a guardian-aware mode with no memory. */
  ageBand: AgeBand | null;
  isMinor: boolean;
  language: Language;
  /** Default support mode used to open a conversation. */
  preferredNeed: Need | null;
  /** Self-declared tendencies the person opted to share (e.g. "I get angry fast"). */
  selfNotes: string[];
  /** When false, nothing is persisted between sessions. */
  memoryEnabled: boolean;
  name?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  /** Present on assistant messages so the UI can show support level + sources. */
  meta?: {
    supportMode: "normal" | "elevated" | "crisis";
    riskLevel: RiskLevel;
    kinds: RiskKind[];
    provider: string;
    demo: boolean;
    crisisResourcesShared?: boolean;
  };
}

export interface ChatRequest {
  message: string;
  language: Language;
  need: Need | null;
  ageBand: AgeBand | null;
  isMinor: boolean;
  /** Prior turns, trimmed by the client. Never includes deleted messages. */
  history: { role: "user" | "assistant"; content: string }[];
  /** Small, user-visible summary the person can switch off ("memory"). */
  memoryEnabled: boolean;
  /** Self-declared tendencies the person chose to share. */
  selfNotes: string[];
  moodScore?: number | null;
}

export interface ChatResponse {
  reply: string;
  supportMode: "normal" | "elevated" | "crisis";
  riskLevel: RiskLevel;
  kinds: RiskKind[];
  /** True when the UI must open the crisis panel with one-tap calling. */
  showCrisisPanel: boolean;
  suggestedReplies: string[];
  provider: string;
  demo: boolean;
  /** True when a deterministic (non-model) crisis reply was used. */
  deterministic: boolean;
  /** Rendered helpline cards the client shows alongside the reply. */
  resourceIds: string[];
}
