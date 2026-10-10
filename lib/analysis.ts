/**
 * Lightweight, explainable conversation analysis.
 *
 * These helpers pick coping tools and suggested replies. They are heuristics
 * the user can see and correct ("you mentioned exam pressure - was that right?")
 * and are never presented as a diagnosis or a clinical assessment.
 */

import type { Domain, Need } from "@/lib/types";

const DOMAIN_HINTS: { domain: Domain; words: string[] }[] = [
  {
    domain: "study",
    words: [
      "exam", "exams", "result", "marks", "grade", "gpa", "semester", "jee", "neet", "upsc",
      "board exam", "study", "studies", "assignment", "submission", "placement", "campus",
      "college", "school", "tuition", "faculty", "teacher", "professor", "sir", "madam",
      "viva", "thesis", "backlog", "attendance", "exam stress", "pariksha", "padhai",
      "imtihan", "result aaya", "placement", "sem", "मार्क्स", "पढ़ाई", "परीक्षा", "रिजल्ट",
      "કોલેજ", "પરીક્ષા", "પરિણામ", "ભણવું", "નોકરી",
    ],
  },
  {
    domain: "work",
    words: [
      "job", "boss", "manager", "office", "workload", "shift", "appraisal", "layoff", "fired",
      "internship", "deadline", "overtime", "colleague", "team lead", "startup", "burnout",
      "night shift", "target", "office politics", "नौकरी", "बॉस", "ऑफिस", "કામ", "બોસ", "ઓફિસ",
    ],
  },
  {
    domain: "money",
    words: [
      "money", "loan", "emi", "debt", "fees", "fee", "afford", "rent", "salary", "paison",
      "paisa", "udhaar", "karza", "पैसे", "कर्ज", "फीस", "પૈસા", "લોન", "ફી",
    ],
  },
  {
    domain: "relationship",
    words: [
      "boyfriend", "girlfriend", "breakup", "broke up", "partner", "crush", "rejected",
      "dating", "relationship", "he left", "she left", "boyfriend", "girlfriend",
      "friend stopped", "best friend", "lonely", "alone", "akela", "akeli", "pyar", "prem",
      "अकेला", "अकेली", "ब्रेकअप", "प्यार", "એકલું", "એકલી", "બ્રેકઅપ", "પ્રેમ",
    ],
  },
  {
    domain: "family",
    words: [
      "parents", "mother", "father", "mom", "dad", "papa", "mummy", "family", "marriage",
      "shaadi", "rishta", "in-laws", "sister", "brother", "ghar", "expectations", "compare",
      "तुलना", "माता-पिता", "घर", "शादी", "પરિવાર", "લગ્ન", "મમ્મી", "પપ્પા",
    ],
  },
  {
    domain: "health",
    words: [
      "sleep", "insomnia", "neend", "headache", "weight", "period", "periods", "pcos", "pain",
      "doctor", "hospital", "medicine", "thyroid", "sugar", "बीमार", "नींद", "दर्द", "તબિયત",
      "નીંદ", "દુખાવો",
    ],
  },
  {
    domain: "identity",
    words: [
      "lgbt", "gay", "lesbian", "queer", "trans", "coming out", "religion", "caste",
      "discrimination", "skin colour", "dark skin", "body shaming", "fairness", "जाति", "धर्म",
      "જાતિ", "ધર્મ",
    ],
  },
];

const EMOTION_HINTS: { emotion: string; words: string[] }[] = [
  {
    emotion: "anger",
    words: [
      "angry", "anger", "furious", "rage", "hate him", "hate her", "hate them", "irritated",
      "frustrated", "gussa", "ब्लड", "गुस्सा", "ગુસ્સો", "ચીડ",
    ],
  },
  {
    emotion: "anxiety",
    words: [
      "anxious", "anxiety", "panic", "scared", "fear", "nervous", "overthinking", "worried",
      "tension", "ghabra", "बेचैन", "घबराहट", "टेंशन", "ચિંતા", "ગભરાટ", "ટેન્શન",
    ],
  },
  {
    emotion: "sadness",
    words: [
      "sad", "cry", "crying", "ro raha", "ro rahi", "empty", "hopeless", "worthless", "low",
      "dukhi", "उदास", "रो रहा", "रो रही", "ઉદાસ", "રડું છું",
    ],
  },
  {
    emotion: "shame",
    words: [
      "ashamed", "shame", "guilty", "embarrassed", "failure", "useless", "sharam",
      "शर्म", "શરમ", "નકામું",
    ],
  },
  {
    emotion: "loneliness",
    words: ["lonely", "alone", "no one", "nobody", "isolated", "akela", "अकेला", "એકલું"],
  },
  {
    emotion: "exhaustion",
    words: [
      "tired", "exhausted", "burnout", "burnt out", "can't focus", "cant focus", "no energy",
      "thak", "थका", "थकी", "થાકી",
    ],
  },
];

export function detectDomain(text: string): Domain | null {
  const haystack = text.toLowerCase();
  let best: { domain: Domain; score: number } | null = null;
  for (const group of DOMAIN_HINTS) {
    const score = group.words.reduce((total, word) => (haystack.includes(word) ? total + 1 : total), 0);
    if (score > 0 && (!best || score > best.score)) best = { domain: group.domain, score };
  }
  return best?.domain ?? null;
}

export function detectEmotions(text: string): string[] {
  const haystack = text.toLowerCase();
  return EMOTION_HINTS.filter((group) => group.words.some((word) => haystack.includes(word))).map(
    (group) => group.emotion,
  );
}

/**
 * Suggested follow-up chips. These exist so a person in distress never has to
 * find the words themselves - they can tap.
 */
export function suggestedReplies(need: Need | null, domain: Domain | null, emotions: string[]): string[] {
  const chips: string[] = [];

  if (emotions.includes("anxiety") || emotions.includes("exhaustion")) {
    chips.push("Help me calm down for 2 minutes", "मुझे शांत होने में मदद करो", "મને શાંત થવામાં મદદ કરો");
  }
  if (emotions.includes("anger")) {
    chips.push("I'm too angry to think straight", "मुझे बहुत गुस्सा आ रहा है", "મને ખૂબ ગુસ્સો આવે છે");
  }
  if (domain === "study") {
    chips.push("Make me a 20-minute study plan", "आज का छोटा प्लान बनाओ", "આજનું નાનું પ્લાન બનાવો");
  }
  if (domain === "work") {
    chips.push("I can't switch off from work", "काम का दबाव बहुत है", "કામનું દબાણ ખૂબ છે");
  }
  if (domain === "relationship" || emotions.includes("loneliness")) {
    chips.push("I feel very alone right now", "मुझे बहुत अकेलापन लग रहा है", "મને ખૂબ એકલું લાગે છે");
  }
  if (need === "plan" || need === "solve") {
    chips.push("Help me pick one small next step", "एक छोटा कदम चुनने में मदद करो", "એક નાનું પગલું પસંદ કરવામાં મદદ કરો");
  }
  if (need === "human") {
    chips.push("Show me who I can call", "मुझे कॉल करने के नंबर दिखाओ", "કૉલ કરવાના નંબર બતાવો");
  }
  if (need === "vent") {
    chips.push("I just want to be heard, no advice", "बस सुनना चाहता हूँ, सलाह नहीं", "ફક્ત સાંભળવું છે, સલાહ નહીં");
  }

  const unique = [...new Set(chips)];
  // Keep chips in one language block per row by slicing to a sane count.
  return unique.slice(0, 4);
}
