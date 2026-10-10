/**
 * Layer 1 of the safety stack: a deterministic, multilingual risk triage.
 *
 * This runs on the server BEFORE any model call and cannot be talked out of by
 * prompt injection, because it is plain pattern matching. It is deliberately
 * recall-oriented: a false "elevated" costs the user a gentle check-in, a false
 * negative can cost a life.
 *
 * It is NOT a clinical instrument and must not be presented as one. Its only
 * job is to decide whether the product should (a) keep chatting, (b) offer a
 * gentle safety check, or (c) stop normal chat and route to human help.
 */

import type { RiskKind, RiskLevel, TriageResult } from "@/lib/types";

interface Rule {
  id: string;
  kind: RiskKind;
  /** 1-10. >=9 alone triggers crisis, 5-8 triggers elevated, 1-4 triggers watch. */
  weight: number;
  /** Latin / Hinglish phrases (matched case-insensitively). */
  roman?: string[];
  /** Devanagari phrases. */
  hi?: string[];
  /** Gujarati-script phrases. */
  gu?: string[];
  /** True when the phrase indicates a plan, means or timeframe (raises urgency). */
  plan?: boolean;
}

/**
 * Phrases that look alarming but are usually idioms. They subtract score.
 * Kept narrow on purpose - "killing me" next to exam words is an idiom, whereas
 * "killing myself" is a rule above and never suppressed.
 */
const BENIGN_PATTERNS: { id: string; roman?: string[]; hi?: string[]; gu?: string[] }[] = [
  { id: "benign-dying-to", roman: ["dying to", "died laughing", "dead tired", "dying of laughter"] },
  { id: "benign-killing-me", roman: ["killing me", "kills me", "kill me now", "this is death"] },
  { id: "benign-slang", roman: ["slay", "go die", "kill it", "dead serious", "literally dead"] },
  { id: "benign-media", roman: ["suicide squad", "suicide prevention day", "i read about suicide"] },
  { id: "benign-third-person", roman: ["my friend wants to", "he wants to die", "she wants to die"] },
];

const RULES: Rule[] = [
  // ---------------------------------------------------------------- suicide
  {
    id: "su-plan",
    kind: "suicide",
    weight: 10,
    plan: true,
    roman: [
      "i have a plan to end",
      "i will kill myself tonight",
      "i am going to kill myself",
      "i'm going to kill myself",
      "i am going to end my life",
      "i'm going to end my life",
      "i will end my life",
      "i will hang myself",
      "i am going to hang myself",
      "i will jump off",
      "i am going to jump",
      "i took the pills",
      "i have taken the pills",
      "i overdosed",
      "i am writing my note",
      "my suicide note",
      "this is my last message",
      "goodbye forever",
      "saying goodbye for good",
    ],
    hi: [
      "आत्महत्या करूंगा",
      "आत्महत्या करूँगा",
      "आत्महत्या करने जा रहा",
      "अपनी जान दे दूंगा",
      "आज रात मर जाऊंगा",
      "फांसी लगा",
      "जहर खा",
      "जहर ले",
      "गोलियां खा",
      "आखिरी संदेश",
    ],
    gu: [
      "આત્મહત્યા કરીશ",
      "આત્મહત્યા કરવા જાઉં",
      "જાન આપી દઈશ",
      "આજ રાતે મરી જઈશ",
      "જીવન ટૂંકાવી",
      "ઝેર પી",
    ],
  },
  {
    id: "su-ideation",
    kind: "suicide",
    weight: 9,
    roman: [
      "kill myself",
      "killing myself",
      "kms",
      "end my life",
      "end it all",
      "want to die",
      "wanna die",
      "want 2 die",
      "wish i was dead",
      "wish i were dead",
      "better off dead",
      "better off without me",
      "no reason to live",
      "nothing to live for",
      "don't want to live",
      "dont want to live",
      "don't want to be alive",
      "cant go on",
      "can't go on",
      "cannot go on",
      "no longer want to be here",
      "don't want to wake up",
      "dont want to wake up",
      "put me out of my misery",
      "take my own life",
      "committing suicide",
      "commit suicide",
      "suicidal",
      "suicide",
      "atmahatya",
      "khudkhushi",
      "marna chahta",
      "marna chahti",
      "marna chahta hoon",
      "mar jaunga",
      "mar jaogi",
      "mar jana chahta",
      "jaan de dunga",
      "jaan de doon",
      "jeena nahi chahta",
      "jeena nahi chahti",
      "jeena nahin",
      "nahi rehna mujhe",
      "mujhe nahi rehna",
      "marna hai mujhe",
      "jivan khatam",
    ],
    hi: [
      "मरना चाहता",
      "मरना चाहती",
      "मर जाऊं",
      "मर जाऊँ",
      "मर जाऊंगा",
      "आत्महत्या",
      "खुदकुशी",
      "खुदकुशी कर",
      "जीना नहीं चाहता",
      "जीना नहीं चाहती",
      "जीना नहीं है",
      "मुझे नहीं रहना",
      "जान दे दूं",
      "जान दे दूंगा",
      "जिंदगी खत्म",
      "सब खत्म कर",
    ],
    gu: [
      "મરવું છે",
      "મરી જવું છે",
      "મારે મરવું",
      "આત્મહત્યા",
      "ખુદકુશી",
      "જીવવું નથી",
      "મને નથી જીવવું",
      "જીવન ખતમ",
      "મરી જઈશ",
      "જાન આપી દેવી",
    ],
  },
  {
    id: "sh-behaviour",
    kind: "self-harm",
    weight: 9,
    roman: [
      "cut myself",
      "cutting myself",
      "cut my wrist",
      "cutting my wrist",
      "hurt myself",
      "hurting myself",
      "harm myself",
      "self harm",
      "self-harm",
      "burn myself",
      "burning myself",
      "hit myself",
      "banging my head",
      "punish myself",
      "khud ko kaat",
      "khud ko nuksan",
      "khud ko maar",
      "apne aap ko kaat",
    ],
    hi: [
      "खुद को काट",
      "खुद को नुकसान",
      "खुद को मार",
      "अपने आप को काट",
      "नस काट",
      "हाथ काट",
    ],
    gu: ["જાતને કાપી", "જાતને નુકસાન", "હાથ કાપી", "જાતને મારી"],
  },
  {
    id: "su-means",
    kind: "suicide",
    weight: 10,
    plan: true,
    roman: [
      "bought a rope",
      "have a rope",
      "have the rope",
      "got the rope",
      "the rope is ready",
      "rope ready",
      "bought sleeping pills",
      "collecting pills",
      "have the pills",
      "got the pills",
      "have a knife",
      "have the knife",
      "got a knife",
      "have a gun",
      "have the gun",
      "found a high place",
      "on the terrace now",
      "on the roof now",
      "standing on the bridge",
      "at the railway track",
      "i have the poison",
      "have the poison",
      "how many pills to",
      "how to end it painlessly",
      "painless way to die",
      "quickest way to die",
    ],
    hi: [
      "रस्सी ले लिया",
      "रस्सी तैयार",
      "नींद की गोलियां",
      "छत पर हूं",
      "पटरी पर हूं",
      "जहर ले लिया",
      "गोलियां ले ली",
    ],
    gu: [
      "દોરડું લીધું",
      "દોરડું તૈયાર",
      "નીંદની ગોળીઓ",
      "છત પર છું",
      "ઝેર લીધું",
      "ગોળી લીધી",
    ],
  },
  {
    // Deliberately below the crisis threshold (6 = elevated). On its own this
    // phrasing is ambiguous - "I'm going to do it tonight" could be coursework -
    // so it triggers a direct safety check rather than taking over the screen.
    // Combined with any means phrase above, the score reaches crisis anyway.
    id: "su-vague-plan",
    kind: "suicide",
    weight: 6,
    roman: [
      "going to do it tonight",
      "going to do it today",
      "will do it tonight",
      "tonight is the night",
      "decided to do it tonight",
      "no one will find me",
      "i won't be here tomorrow",
    ],
    hi: ["आज रात कर दूंगा", "आज ही कर दूंगा"],
    gu: ["આજ રાતે કરી દઈશ", "આજે જ કરી દઈશ"],
  },

  // ------------------------------------------------------- harm to others
  {
    id: "harm-other",
    kind: "harm-to-other",
    weight: 8,
    roman: [
      "kill him",
      "kill her",
      "kill them",
      "i will stab",
      "going to stab",
      "shoot him",
      "shoot her",
      "make them pay",
      "i want revenge",
      "i will destroy him",
      "i will destroy her",
      "mar dunga",
      "mar dalunga",
      "khatam kar dunga",
      "jaan se maar",
    ],
    hi: ["मार डालूंगा", "मार डालूँगा", "जान से मार", "खत्म कर दूंगा", "बदला लूंगा"],
    gu: ["મારી નાખીશ", "કતલ કરીશ", "બદલો લઈશ", "ખતમ કરી દઈશ"],
  },

  // ---------------------------------------------------------------- abuse
  {
    id: "abuse-violence",
    kind: "abuse",
    weight: 7,
    roman: [
      "he hits me",
      "she hits me",
      "hits me",
      "beats me",
      "beating me",
      "slapped me",
      "pushed me down the stairs",
      "he threatens me",
      "she threatens me",
      "threatens to kill me",
      "abusing me",
      "abused me",
      "domestic violence",
      "molested",
      "molesting",
      "raped",
      "sexual assault",
      "he touched me",
      "inappropriately touched",
      "forced me to",
      "won't let me leave the house",
      "wont let me leave the house",
      "maar raha hai",
      "maar rahi hai",
      "peetta hai",
      "peetti hai",
      "galat kaam",
      "balatkar",
      "chhedkhani",
      "maar mare che",
      "mar mare chhe",
    ],
    hi: [
      "मारता है",
      "मारती है",
      "पीटता है",
      "पीटती है",
      "बलात्कार",
      "छेड़छाड़",
      "जबरदस्ती",
      "धमकी दे रहा",
      "घर से निकलने नहीं",
    ],
    gu: [
      "મારે છે",
      "માર મારે છે",
      "મારી નાખવાની ધમકી",
      "બળાત્કાર",
      "જબરદસ્તી",
      "ઘરમાંથી નીકળવા નથી",
    ],
  },
  {
    id: "exploitation",
    kind: "exploitation",
    weight: 6,
    roman: [
      "blackmailing me",
      "blackmail me with photos",
      "leaked my photos",
      "my nudes",
      "sextortion",
      "sending my pictures",
      "asking for money or he will share",
      "someone is asking me for pictures",
      "groomed me",
      "trapped me in a video call",
    ],
    hi: ["ब्लैकमेल", "फोटो वायरल", "अश्लील फोटो", "जबरन वसूली"],
    gu: ["બ્લેકમેલ", "ફોટા વાયરલ", "અશ્લીલ ફોટા"],
  },

  // ------------------------------------------------------- medical / body
  {
    id: "medical",
    kind: "medical-emergency",
    weight: 6,
    roman: [
      "chest pain",
      "can't breathe",
      "cant breathe",
      "cannot breathe",
      "heavy bleeding",
      "bleeding a lot",
      "unconscious",
      "fainted",
      "having a seizure",
      "severe pain in my chest",
      "heart is racing and i am scared",
      "saans nahi aa rahi",
      "chhati me dard",
      "behosh",
      "khoon beh raha",
    ],
    hi: ["सांस नहीं आ रही", "छाती में दर्द", "बेहोश", "खून बह रहा", "दौरा पड़"],
    gu: ["શ્વાસ નથી આવતો", "છાતીમાં દુખાવો", "બેહોશ", "લોહી વહે છે", "માંદું પડ્યું"],
  },
  {
    id: "substance",
    kind: "substance",
    weight: 4,
    roman: [
      "drinking too much",
      "drunk every night",
      "want to get high",
      "took drugs",
      "popping pills",
      "can't stop drinking",
      "cant stop drinking",
      "nashe",
      "sharaab",
      "drugs le raha",
    ],
    hi: ["नशा", "शराब पी रहा", "ड्रग्स ले रहा", "गोलियां खा रहा"],
    gu: ["નશો", "દારૂ પી રહ્યો", "ગોળી ખાઈ રહ્યો"],
  },
  {
    id: "eating",
    kind: "eating",
    weight: 5,
    roman: [
      "not eating anything",
      "stopped eating",
      "starving myself",
      "making myself throw up",
      "purging",
      "hate my body so much",
      "want to be thin at any cost",
      "khaana nahi kha raha",
      "khaana nahi kha rahi",
      "bhookha reh raha",
    ],
    hi: ["खाना नहीं खा रहा", "खाना नहीं खा रही", "भूखा रह रहा", "उल्टी कर रहा"],
    gu: ["ખાવું નથી", "ભૂખ્યો રહું છું", "ઉલટી કરું છું"],
  },
  {
    id: "psychosis-signal",
    kind: "psychosis",
    weight: 5,
    roman: [
      "hearing voices",
      "voices telling me",
      "someone is watching me",
      "people are following me",
      "being controlled by",
      "chips in my head",
      "awaz aa rahi hai",
      "koi dekh raha hai mujhe",
      "log mere peeche hain",
    ],
    hi: ["आवाज़ें आ रही", "कोई देख रहा है मुझे", "लोग मेरे पीछे", "काबू में कर रहे"],
    gu: ["અવાજ સંભળાય છે", "કોઈ જોઈ રહ્યું છે", "લોકો મારી પાછળ"],
  },

  // -------------------------------------------------------------- distress
  {
    id: "distress-high",
    kind: "self-harm",
    weight: 2,
    roman: [
      "i can't take it anymore",
      "i cant take it anymore",
      "i am broken",
      "i feel worthless",
      "i am worthless",
      "nobody cares if i live",
      "no one would notice",
      "i hate myself",
      "i am a burden",
      "i'm a burden",
      "i can't do this anymore",
      "i cant do this anymore",
      "i am hopeless",
      "totally hopeless",
      "bahut takleef",
      "main tut gaya",
      "main tut gayi",
      "kisi ko farak nahi padega",
      "mujhse nahi ho pa raha",
      "majja nathi aavtu",
      "hu thaki gayo",
    ],
    hi: [
      "मुझसे नहीं हो रहा",
      "मैं टूट गया",
      "मैं टूट गई",
      "मुझे अपने आप से नफरत",
      "कोई फर्क नहीं पड़ेगा",
      "उम्मीद नहीं बची",
      "बहुत तकलीफ",
    ],
    gu: ["મજા નથી આવતી", "હું થાકી ગયો", "હું થાકી ગઈ", "ખૂબ તકલીફ", "આશા નથી"],
  },
];

const HUMAN_REQUEST_PATTERNS = [
  "talk to a human",
  "talk to human",
  "speak to a human",
  "real person",
  "real counsellor",
  "real therapist",
  "see a therapist",
  "need a therapist",
  "need a counsellor",
  "need a counselor",
  "book a session",
  "talk to a doctor",
  "kisi se baat karni hai",
  "insaan se baat",
  "counsellor se baat",
  "counselor",
  "therapy chahiye",
  "doctor se baat",
];

function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Matches a phrase with ASCII word boundaries when the phrase is Latin, and a
 * plain substring test otherwise (JS `\b` does not treat Devanagari or Gujarati
 * letters as word characters, so boundaries would never fire there).
 */
function containsPhrase(haystack: string, phrase: string): boolean {
  const needle = normalise(phrase);
  if (!needle) return false;
  if (/^[\x20-\x7E]+$/.test(needle)) {
    const pattern = new RegExp(`(?<![a-z0-9])${escapeRegex(needle)}(?![a-z0-9])`, "i");
    return pattern.test(haystack);
  }
  return haystack.includes(needle);
}

function phrases(rule: Rule): string[] {
  return [...(rule.roman ?? []), ...(rule.hi ?? []), ...(rule.gu ?? [])];
}

/**
 * Runs the deterministic triage. Also scans the last few user turns, because
 * risk is often disclosed across a conversation rather than in one message.
 */
export function triage(message: string, recentUserTurns: string[] = []): TriageResult {
  const current = normalise(message);
  const window = [current, ...recentUserTurns.slice(-4).map(normalise)].join(" \u0001 ");

  const signals: string[] = [];
  const kinds = new Set<RiskKind>();
  const suppressed: string[] = [];
  let score = 0;
  let hasPlan = false;

  for (const rule of RULES) {
    if (phrases(rule).some((phrase) => containsPhrase(current, phrase))) {
      signals.push(rule.id);
      kinds.add(rule.kind);
      score = Math.max(score, rule.weight);
      if (rule.plan) hasPlan = true;
    }
  }

  // A disclosure in an earlier turn keeps the conversation in elevated mode even
  // if the newest message is calm.
  if (signals.length === 0) {
    for (const rule of RULES) {
      if (phrases(rule).some((phrase) => window.includes(normalise(phrase)))) {
        signals.push(`${rule.id}:recent`);
        kinds.add(rule.kind);
        score = Math.max(score, Math.max(1, rule.weight - 3));
        if (rule.plan) hasPlan = true;
      }
    }
  }

  const benignHits = BENIGN_PATTERNS.filter((rule) =>
    [...(rule.roman ?? []), ...(rule.hi ?? []), ...(rule.gu ?? [])].some((phrase) =>
      containsPhrase(current, phrase),
    ),
  ).map((rule) => rule.id);

  // Idioms only soften low-confidence signals. Anything at 9+ (suicide, self-harm)
  // is never suppressed by a benign phrase in the same message.
  if (benignHits.length > 0 && score > 0 && score < 9) {
    suppressed.push(...benignHits);
    score = Math.max(0, score - 3);
  }

  const wantsHuman = HUMAN_REQUEST_PATTERNS.some((phrase) => containsPhrase(current, phrase));
  if (wantsHuman) score = Math.max(score, 1);

  let level: RiskLevel = 0;
  if (score >= 9) level = 3;
  else if (score >= 5) level = 2;
  else if (score >= 1) level = 1;

  // Explicit plan or means always escalates one step.
  if (hasPlan && level < 3) level = 3;

  return {
    level,
    kinds: [...kinds],
    signals,
    suppressed,
    wantsHuman,
    hasPlan,
  };
}

/** Cheap client-safe copy of the crisis check, used to open the panel instantly. */
export function quickCrisisCheck(message: string): boolean {
  return triage(message).level >= 2;
}
