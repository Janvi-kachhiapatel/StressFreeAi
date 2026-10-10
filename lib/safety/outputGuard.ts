/**
 * Layer 3 of the safety stack: an output guard that runs on every model reply
 * before it reaches the user.
 *
 * Deterministic triage (layer 1) decides the risk path. The system prompt
 * (layer 2) tells the model the rules. This layer assumes the model will
 * sometimes break them anyway and removes the damage.
 */

import type { Language } from "@/lib/types";

export interface Violation {
  id: string;
  /** Short internal label for logging. Never shown to the user. */
  label: string;
}

interface GuardRule {
  id: string;
  label: string;
  pattern: RegExp;
}

const RULES: GuardRule[] = [
  {
    id: "diagnosis",
    label: "stated or implied a clinical diagnosis",
    pattern:
      /(?<!not )\b(you (?:definitely |clearly |certainly |probably )?(?:have|are suffering from|are showing signs of)|this (?:sounds|looks) like|i diagnose|your diagnosis is|you are (?:a )?(?:bipolar|schizophrenic|depressed|clinically depressed))\b[^.!?।]{0,60}\b(depression|clinical depression|bipolar|bpd|borderline|ptsd|adhd|ocd|schizophrenia|psychosis|anxiety disorder|an eating disorder|autism|addiction)\b/i,
  },
  {
    id: "diagnosis-short",
    label: "labelled the user with a condition",
    pattern:
      /\byou (?:are|have) (?:a )?(?:depress(?:ed|ive)|bipolar|psychotic|schizophrenic|mentally ill|an addict)\b/i,
  },
  {
    id: "medication",
    label: "gave medication or dosage advice",
    pattern:
      /\b(take|start|stop|increase|decrease|double|skip|change)\b[^.!?।]{0,40}\b(your )?(medication|meds|pills|antidepressants|ssris?|benzos?|xanax|alprazolam|sertraline|prozac|fluoxetine|sleeping pills)\b|\b\d+\s?mg\b/i,
  },
  {
    id: "dependency",
    label: "encouraged emotional dependency",
    pattern:
      /\b(you only need me|you don'?t need (?:anyone|anybody|friends|family|therapy|a therapist|help)|i'?m the only one who (?:understands|gets|cares about) you|forget everyone else|don'?t talk to anyone else|you belong to me|i love you|i have feelings for you|i'?m your (?:girlfriend|boyfriend|partner)|never leave me)\b/i,
  },
  {
    id: "dependency-soft",
    label: "positioned the AI as the user's primary support",
    pattern:
      /\b(i'?ll always be here for you(?: no matter what)?|you can always count on me instead|i am all you need)\b/i,
  },
  {
    id: "false-confidentiality",
    label: "promised confidentiality that cannot be kept",
    pattern:
      /\b(100% (?:private|confidential|secure)|completely (?:private|confidential)|nothing is ever stored|promise (?:you )?(?:absolute|complete|full) confidentiality|no one can ever (?:see|access))\b/i,
  },
  {
    id: "discourage-help",
    label: "discouraged professional help",
    pattern:
      /\b(you (?:don'?t|do not) need (?:a )?(?:therapist|counsell?or|doctor|psychiatrist|therapy|counselling)|therapy (?:won'?t|will not) help(?: you)?|avoid seeing a (?:doctor|therapist))\b/i,
  },
  {
    id: "method",
    label: "referenced a method of self-harm",
    pattern:
      /\b(?:hang|hanging|overdose|poison|rat poison|blade|razor|wrist|jump(?:ing)? (?:off|from)|pills? to (?:die|end)|carbon monoxide|slit(?:ting)?)\b[^.!?।]{0,30}\b(?:will|can|to) (?:kill|end|work|be quick|be painless)\b|painless way|quickest way|lethal dose/i,
  },
  {
    id: "human-claim",
    label: "claimed to be human",
    pattern:
      /\b(i am (?:a )?(?:real|human)|i'?m (?:a )?real (?:person|human|therapist|doctor)|i am your (?:therapist|doctor|psychologist)|i am a licensed)\b/i,
  },
  {
    id: "certainty",
    label: "offered false certainty about an outcome",
    pattern:
      /\b(i guarantee|100% sure|definitely will (?:pass|get the job|be cured)|you will (?:definitely )?never feel (?:this|that) again)\b/i,
  },
];

const SAFE_SWAP: Record<Language, string> = {
  en: "I can't label what you're going through, and I won't try to — that's for a qualified professional. What I can do is stay with you in it and help you take one small step.",
  hi: "मैं आपकी स्थिति का नाम या निदान नहीं कर सकता/सकती — यह योग्य पेशेवर का काम है। मैं इतना कर सकता/सकती हूँ कि आपके साथ रहूँ और एक छोटा कदम उठाने में मदद करूँ।",
  gu: "હું તમારી સ્થિતિને નામ કે નિદાન આપી શકતો/શકતી નથી — એ લાયક નિષ્ણાતનું કામ છે. હું તમારી સાથે રહીને એક નાનું પગલું ભરવામાં મદદ કરી શકું.",
};

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?।])\s+|\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Removes policy-breaking sentences. A dropped sentence is replaced with a
 * single safe reframe (not repeated, so the reply does not become a wall of
 * disclaimers).
 */
export function guardOutput(
  text: string,
  language: Language,
): { text: string; violations: Violation[] } {
  const violations: Violation[] = [];
  const kept: string[] = [];
  let swapUsed = false;

  for (const sentence of splitSentences(text)) {
    const hit = RULES.find((rule) => rule.pattern.test(sentence));
    if (!hit) {
      kept.push(sentence);
      continue;
    }
    violations.push({ id: hit.id, label: hit.label });
    if (!swapUsed && (hit.id === "diagnosis" || hit.id === "diagnosis-short" || hit.id === "medication")) {
      kept.push(SAFE_SWAP[language] ?? SAFE_SWAP.en);
      swapUsed = true;
    }
  }

  let cleaned = kept.join(" ").trim();
  if (!cleaned) cleaned = SAFE_SWAP[language] ?? SAFE_SWAP.en;

  // Never leave a trailing incomplete fragment after surgery.
  cleaned = cleaned.replace(/\s+/g, " ").replace(/\s([,.!?।])/g, "$1");
  if (!/[.!?।]$/.test(cleaned)) cleaned += ".";

  return { text: cleaned, violations };
}

/** Extra hard stop: assistant text that is empty or absurdly long. */
export function shapeReply(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 1400) return trimmed;
  const cut = trimmed.slice(0, 1400);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf("।"), cut.lastIndexOf("?"));
  return lastStop > 400 ? cut.slice(0, lastStop + 1) : cut;
}
