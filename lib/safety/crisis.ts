/**
 * Deterministic crisis and elevated-risk replies.
 *
 * These do not call a model. When someone may be at risk of suicide or
 * self-harm, the first response must be correct 100% of the time, and a
 * language model cannot promise that. The model is only allowed back into the
 * conversation once immediate safety has been addressed.
 *
 * Safe-messaging rules followed here:
 *  - ask about safety directly and calmly, without alarm
 *  - never mention, describe or normalise a method
 *  - never promise secrecy that cannot be kept
 *  - never say the person is a burden, never moralise, never bargain
 *  - always point to human help and a trusted person nearby
 *  - leave the door open: "I'm still here, we can keep talking"
 */

import type { AgeBand, Language, RiskKind } from "@/lib/types";

interface CrisisContext {
  language: Language;
  isMinor: boolean;
  kinds: RiskKind[];
  hasPlan: boolean;
  wantsHuman: boolean;
}

const KIND_FOCUS: Record<RiskKind, { en: string; hi: string; gu: string }> = {
  suicide: {
    en: "what you just said about not wanting to be alive",
    hi: "आपने जो कहा कि आप जीना नहीं चाहते",
    gu: "તમે કહ્યું કે તમે જીવવા નથી માંગતા",
  },
  "self-harm": {
    en: "the part about hurting yourself",
    hi: "खुद को नुकसान पहुँचाने वाली बात",
    gu: "પોતાને નુકસાન પહોંચાડવાની વાત",
  },
  "harm-to-other": {
    en: "how much anger you're carrying towards someone",
    hi: "किसी के प्रति आपके अंदर का गुस्सा",
    gu: "કોઈની સામે તમારા મનમાંનો ગુસ્સો",
  },
  abuse: {
    en: "that someone is hurting you",
    hi: "कि कोई आपको नुकसान पहुँचा रहा है",
    gu: "કે કોઈ તમને નુકસાન પહોંચાડે છે",
  },
  "medical-emergency": {
    en: "what your body is doing right now",
    hi: "आपके शरीर में जो हो रहा है",
    gu: "તમારા શરીરમાં જે થઈ રહ્યું છે",
  },
  substance: {
    en: "how much you're using to cope",
    hi: "सहने के लिए आप जो ले रहे हैं",
    gu: "સહન કરવા તમે જે લઈ રહ્યા છો",
  },
  eating: {
    en: "what's happening with food and your body",
    hi: "खाने और शरीर के साथ जो हो रहा है",
    gu: "ખાવા અને શરીર સાથે જે થઈ રહ્યું છે",
  },
  psychosis: {
    en: "what you're hearing or sensing",
    hi: "जो आप सुन या महसूस कर रहे हैं",
    gu: "તમે જે સાંભળો છો કે અનુભવો છો",
  },
  exploitation: {
    en: "that someone is threatening you",
    hi: "कि कोई आपको धमका रहा है",
    gu: "કે કોઈ તમને ધમકાવે છે",
  },
};

function focus(ctx: CrisisContext): string {
  const kind = ctx.kinds.find((k) => KIND_FOCUS[k]) ?? "suicide";
  return KIND_FOCUS[kind][ctx.language];
}

const T = {
  en: {
    open: (f: string) =>
      `Thank you for telling me. I'm not going anywhere, and I take ${f} seriously.`,
    question:
      "Before anything else I need to ask you directly, because I care about the answer: are you in danger of hurting yourself right now, or is someone about to hurt you?",
    planWorry:
      "What you've described sounds like more than a passing thought, and that worries me for you.",
    notAlone:
      "You do not have to carry this alone, and you should not have to. Please reach a human being today — not later, today.",
    botLimit:
      "I'm an AI companion. I can stay and talk with you, but I cannot keep you safe. A trained person on a phone line can do what I cannot.",
    callNow: "Call one of these now, or ask someone nearby to call with you:",
    trusted:
      "Is there one person — a parent, friend, warden, hostel mate, teacher, sibling — you could message right now with the words: \"I'm not okay, can you stay with me?\"",
    minors:
      "Because you're under 18, please involve an adult you trust or Childline 1098. You are not in trouble and you are not a burden for asking.",
    away: "that person",
    anger: (away: string) =>
      `Anger this strong usually means something important to you has been hurt. Let's put space between the feeling and any action. Move away from ${away}, put your phone down if it's a fight, and give it 20 minutes. No decisions, no messages, no driving while this is this hot. If you're worried you might act, please call a helpline and tell someone you trust where you are right now.`,
    validate: "Whatever is happening, you are not weak for feeling this.",
    stay: "I'm still here. If you want, tell me what today has been like, or just stay with me on this screen for a minute.",
    check: "Are you safe where you are right now?",
    safetyPlan:
      "If you can, do three small things: move away from anything you could use to hurt yourself, tell one person where you are, and stay somewhere with other people.",
  },
  hi: {
    open: (f: string) =>
      `मुझे बताने के लिए धन्यवाद। मैं यहीं हूँ और ${f} को मैं हल्के में नहीं ले रहा/रही।`,
    question:
      "सबसे पहले मैं सीधे पूछना चाहता/चाहती हूँ, क्योंकि जवाब मेरे लिए मायने रखता है: क्या आज आप खुद को नुकसान पहुँचाने के खतरे में हैं, या कोई आपको नुकसान पहुँचाने वाला है?",
    planWorry: "आपने जो बताया, वह सिर्फ आते-जाते ख्याल जैसा नहीं लगता, और मुझे आपकी चिंता है।",
    notAlone: "यह अकेले उठाना ज़रूरी नहीं है, और ऐसा होना भी नहीं चाहिए। आज ही किसी इंसान से बात कीजिए।",
    botLimit:
      "मैं एक AI साथी हूँ। मैं आपके साथ बात कर सकता/सकती हूँ, लेकिन आपकी सुरक्षा की ज़िम्मेदारी नहीं ले सकता/सकती। फोन पर प्रशिक्षित व्यक्ति वह कर सकता है जो मैं नहीं कर सकता।",
    callNow: "अभी इनमें से किसी एक पर कॉल कीजिए, या पास किसी से साथ में कॉल करवाइए:",
    trusted:
      "क्या कोई एक व्यक्ति है — माता-पिता, दोस्त, वार्डन, होस्टल साथी, शिक्षक, भाई-बहन — जिसे आप अभी लिख सकें: \"मैं ठीक नहीं हूँ, क्या आप मेरे साथ रह सकते हैं?\"",
    minors:
      "आपकी उम्र 18 से कम है, इसलिए किसी भरोसेमंद बड़े या चाइल्डलाइन 1098 से बात कीजिए। आपने मदद मांगी इसका कोई दोष नहीं है।",
    away: "उस व्यक्ति से",
    anger: (away: string) =>
      `इतना गुस्सा अक्सर बताता है कि आपकी कोई बहुत पसंदीदा चीज़ ठेस पहुँची है। भावना और किसी भी कदम के बीच थोड़ी दूरी बनाइए। ${away} दूरी बनाइए, फोन नीचे रखिए, 20 मिनट दीजिए। गुस्से में कोई संदेश या फैसला न कीजिए। अगर डर है कि कुछ कर बैठेंगे, तो हेल्पलाइन पर कॉल कीजिए और किसी भरोसेमंद को बताइए कि आप कहाँ हैं।`,
    validate: "जो भी हो रहा है, ऐसा महसूस करना कमज़ोरी नहीं है।",
    stay: "मैं अब भी यहीं हूँ। चाहें तो बताइए आज का दिन कैसा रहा, या बस एक मिनट मेरे साथ इसी स्क्रीन पर रुकिए।",
    check: "क्या आप अभी जहाँ हैं वहाँ सुरक्षित हैं?",
    safetyPlan:
      "अगर संभव हो तो तीन छोटे काम कीजिए: जिस चीज़ से नुकसान हो सकता है उससे दूर हट जाइए, किसी एक को बताइए कि आप कहाँ हैं, और ऐसी जगह रुकिए जहाँ और लोग हों।",
  },
  gu: {
    open: (f: string) =>
      `મને કહેવા માટે આભાર. હું અહીં જ છું અને ${f} ને હું હળવાશથી લેતો/લેતી નથી.`,
    question:
      "સૌથી પહેલા હું સીધું પૂછું છું, કારણ કે જવાબ મારા માટે મહત્વનો છે: આજે તમે તમને નુકસાન પહોંચાડવાના જોખમમાં છો, અથવા કોઈ તમને નુકસાન પહોંચાડવાનું છે?",
    planWorry: "તમે જે કહ્યું તે સાવ સામાન્ય વિચાર જેવું નથી લાગતું, અને મને તમારી ચિંતા થાય છે.",
    notAlone: "આ એકલા ઉપાડવાની જરૂર નથી, અને એવું થવું જોઈએ પણ નહીં. આજે જ કોઈ માણસ સાથે વાત કરો.",
    botLimit:
      "હું એક AI સાથી છું. હું વાત કરી શકું, પણ તમારી સલામતીની જવાબદારી લઈ શકતો/શકતી નથી. ફોન પરનો તાલીમબદ્ધ વ્યક્તિ એ કરી શકે જે હું ન કરી શકું.",
    callNow: "હમણાં જ આમાંથી કોઈને કૉલ કરો, અથવા નજીકના કોઈને સાથે કૉલ કરાવો:",
    trusted:
      "શું એક પણ વ્યક્તિ છે — માતા-પિતા, મિત્ર, વોર્ડન, હોસ્ટેલ સાથી, શિક્ષક, ભાઈ-બહેન — જેને તમે હમણાં લખી શકો: \"હું ઠીક નથી, શું તમે મારી સાથે રહી શકશો?\"",
    minors:
      "તમારી ઉંમર 18થી ઓછી છે, તેથી વિશ્વાસપાત્ર મોટી વ્યક્તિ અથવા ચાઈલ્ડલાઈન 1098 સાથે વાત કરો. મદદ માંગવામાં કોઈ દોષ નથી.",
    away: "એ વ્યક્તિથી",
    anger: (away: string) =>
      `આટલો ગુસ્સો દર્શાવે છે કે તમારી કોઈ મહત્વની વાત ને ઠેસ પહોંચી છે. લાગણી અને પગલાં વચ્ચે થોડું અંતર રાખો. ${away} અંતર રાખો, ફોન નીચે મૂકો, 20 મિનિટ આપો. ગુસ્સામાં કોઈ સંદેશ કે નિર્ણય ન લો. જો ડર હોય કે કંઈક કરી બેસશો, તો હેલ્પલાઈન પર કૉલ કરો અને વિશ્વાસપાત્ર વ્યક્તિને જણાવો કે તમે ક્યાં છો.`,
    validate: "જે થઈ રહ્યું છે તે મહેસૂસ કરવું નબળાઈ નથી.",
    stay: "હું હજી અહીં જ છું. ઈચ્છો તો આજનો દિવસ કેવો રહ્યો તે જણાવો, અથવા એક મિનિટ આ સ્ક્રીન પર મારી સાથે રહો.",
    check: "તમે અત્યારે જ્યાં છો ત્યાં સુરક્ષિત છો?",
    safetyPlan:
      "જો શક્ય હોય તો ત્રણ નાની વાત કરો: નુકસાન પહોંચાડી શકે તેવી વસ્તુથી દૂર જાઓ, એક વ્યક્તિને કહો કે તમે ક્યાં છો, અને એવી જગ્યાએ રહો જ્યાં બીજા લોકો હોય.",
  },
} as const;

/** Full crisis reply: deterministic, no model involvement. */
export function crisisReply(ctx: CrisisContext): string {
  const t = T[ctx.language] ?? T.en;
  const parts: string[] = [];

  parts.push(t.open(focus(ctx)));
  parts.push(t.validate);
  if (ctx.hasPlan) parts.push(t.planWorry);
  parts.push(t.question);
  parts.push(t.notAlone);
  parts.push(t.botLimit);
  parts.push(t.safetyPlan);
  if (ctx.isMinor) parts.push(t.minors);
  else parts.push(t.trusted);
  parts.push(t.callNow);
  if (ctx.kinds.includes("harm-to-other")) parts.push(t.anger(t.away));
  parts.push(t.stay);

  return parts.filter(Boolean).join("\n\n");
}

/** Level 2: stay in conversation, but run a gentle, direct safety check. */
export function elevatedReply(ctx: Omit<CrisisContext, "hasPlan">): string {
  const t = T[ctx.language] ?? T.en;
  const parts = [
    t.open(focus({ ...ctx, hasPlan: false } as CrisisContext)),
    t.check,
  ];

  // Anger towards someone needs the same distance-from-action guidance as a
  // full crisis, because the risk is an action rather than self-harm.
  if (ctx.kinds.includes("harm-to-other")) parts.push(t.anger(t.away));

  parts.push(t.botLimit, t.callNow);
  if (ctx.isMinor) parts.push(t.minors);
  parts.push(t.stay);
  return parts.join("\n\n");
}

/** Shown once on the safety screen and after any resource hand-off. */
export function limitsStatement(language: Language): string {
  switch (language) {
    case "hi":
      return "स्ट्रेसफ्री AI एक सहानुभूतिपूर्ण साथी है, थेरेपिस्ट या डॉक्टर नहीं। यह निदान नहीं करता, दवा नहीं बताता और मेडिकल रिकॉर्ड नहीं रखता। संकट में हेल्पलाइन या आपातकालीन सेवा से संपर्क करें।";
    case "gu":
      return "સ્ટ્રેસફ્રી AI એક સહાનુભૂતિપૂર્ણ સાથી છે, થેરાપિસ્ટ કે ડોક્ટર નથી. તે નિદાન કરતું નથી, દવા કહેતું નથી અને મેડિકલ રેકોર્ડ રાખતું નથી. જોખમમાં હેલ્પલાઈન કે ઈમરજન્સી સેવાનો સંપર્ક કરો.";
    default:
      return "StressFree AI is a supportive companion, not a therapist, counsellor or doctor. It does not diagnose, prescribe or keep medical records. In a crisis, contact a helpline or emergency services.";
  }
}

export function ageBandLabelForMinor(): string {
  return "Since you told us you're under 18, this app runs in guardian-aware mode: nothing is remembered between sessions, and we always point you to an adult who can help.";
}

export function guardianNotice(language: Language): string {
  switch (language) {
    case "hi":
      return "18 से कम उम्र के लिए: यह ऐप कुछ भी याद नहीं रखता और आपको भरोसेमंद बड़े या चाइल्डलाइन 1098 से जुड़ने के लिए कहता है।";
    case "gu":
      return "18થી ઓછી ઉંમર માટે: આ એપ કંઈ યાદ રાખતી નથી અને તમને વિશ્વાસપાત્ર મોટી વ્યક્તિ કે ચાઈલ્ડલાઈન 1098 સાથે જોડાવા કહે છે.";
    default:
      return "Under 18: this app remembers nothing between sessions and always points you to a trusted adult or Childline 1098.";
  }
}

export function ageBandToneHint(band: AgeBand): string {
  switch (band) {
    case "teen":
      return "The person is a teenager. Use short sentences, no jargon, no lectures. Take school, parents, friendships and online life seriously. Never mirror slang in a way that sounds like an adult pretending to be young.";
    case "young":
      return "The person is roughly 18-25: college or early career. Exams, placements, comparisons, first jobs, relationships and money worries are the common shape of stress.";
    case "adult":
      return "The person is a working adult. Respect their autonomy, be practical about time and money, and do not talk down to them.";
    case "older":
      return "The person may be older. Use plain, calm language, avoid slang, allow for health worries, loneliness and grief.";
  }
}
