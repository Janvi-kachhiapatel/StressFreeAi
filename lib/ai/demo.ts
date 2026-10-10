/**
 * Offline demo responder.
 *
 * Used when no model key is configured, and as the fallback when a remote call
 * fails. It must be good enough that the deployed app never shows an empty or
 * broken reply to someone in distress - a plain apology from a human-shaped
 * blank screen is worse than a simple, warm, deterministic answer.
 *
 * It follows the same method as the real prompt (reflect -> one question ->
 * one small action) but with hand-written templates, so it is predictable and
 * obviously not pretending to be a large model.
 */

import { detectDomain, detectEmotions } from "@/lib/analysis";
import type { Domain, Language, Need } from "@/lib/types";

interface DemoArgs {
  message: string;
  language: Language;
  need?: Need | null;
  history?: { role: "user" | "assistant"; content: string }[];
}

type Group = "study" | "work_money" | "relationship" | "family" | "anger" | "low" | "generic";

interface Template {
  reflect: string;
  question: string;
  action: string;
}

const TEMPLATES: Record<Group, Record<Language, Template>> = {
  study: {
    en: {
      reflect: "Exam and career pressure has a way of sounding like the whole future is decided in one result.",
      question: "Of everything on your plate right now, which single thing is actually due first?",
      action: "Pick one topic, set a timer for 20 minutes, and study only that. Then stop and stand up, even if it went badly.",
    },
    hi: {
      reflect: "परीक्षा और करियर का दबाव ऐसा लगता है जैसे पूरा भविष्य एक रिजल्ट से तय हो रहा है।",
      question: "इस समय सबसे पहले क्या करना ज़रूरी है — बस एक चीज़ बताइए?",
      action: "एक टॉपिक चुनिए, 20 मिनट का टाइमर लगाइए और सिर्फ वही पढ़िए। फिर रुककर खड़े हो जाइए, चाहे पढ़ाई ठीक न भी गई हो।",
    },
    gu: {
      reflect: "પરીક્ષા અને કરિયરનું દબાણ એવું લાગે કે આખું ભવિષ્ય એક પરિણામથી નક્કી થાય છે.",
      question: "અત્યારે પહેલું કામ શું છે — ફક્ત એક વાત કહો?",
      action: "એક વિષય પસંદ કરો, 20 મિનિટનો ટાઈમર મૂકો અને ફક્ત એ જ ભણો. પછી ઊભા થઈ જાઓ, ભણતર સારું ન ગયું હોય તો પણ.",
    },
  },
  work_money: {
    en: {
      reflect: "Work and money stress rarely stays at the office — it follows you into the evening.",
      question: "Is the pressure more about the workload itself, or about not knowing where it's heading?",
      action: "Write down the one thing that is actually yours to move today, and the one thing that is somebody else's call. Do only the first.",
    },
    hi: {
      reflect: "काम और पैसे का तनाव ऑफिस तक सीमित नहीं रहता, वह शाम तक साथ चलता है।",
      question: "दबाव काम की मात्रा से ज़्यादा है, या यह समझ न आने से कि यह कहाँ जा रहा है?",
      action: "एक चीज़ लिखिए जो आज आपके हाथ में है, और एक जो दूसरों के फैसले में है। सिर्फ पहली वाली कीजिए।",
    },
    gu: {
      reflect: "કામ અને પૈસાનો તણાવ ઓફિસ પૂરતો રહેતો નથી, સાંજ સુધી સાથે ચાલે છે.",
      question: "દબાણ કામના જથ્થાથી વધારે છે, કે દિશા ન સમજાવાથી?",
      action: "એક વાત લખો જે આજે તમારા હાથમાં છે, અને એક જે બીજાના નિર્ણયમાં છે. ફક્ત પહેલી કરો.",
    },
  },
  relationship: {
    en: {
      reflect: "When something matters a lot, the missing messages and the silence hurt more than the words did.",
      question: "What part of this is hurting most right now — the being alone, or the not knowing?",
      action: "Before replying to anyone or checking anything again, give it 20 minutes and drink some water. Nothing has to be decided tonight.",
    },
    hi: {
      reflect: "जब कोई चीज़ बहुत मायने रखती है, तो खाली चैट और खामोशी शब्दों से ज़्यादा चुभती है।",
      question: "अभी सबसे ज़्यादा दुख किस बात का है — अकेलापन, या यह समझ न आना कि क्या हो रहा है?",
      action: "किसी को जवाब देने या फिर से चैट देखने से पहले 20 मिनट रुकिए और पानी पीजिए। आज रात कुछ तय करने की ज़रूरत नहीं है।",
    },
    gu: {
      reflect: "જ્યારે કંઈ ખૂબ મહત્વનું હોય, ત્યારે ખાલી ચેટ અને મૌન શબ્દોથી વધારે દુખે છે.",
      question: "અત્યારે સૌથી વધારે દુખ કઈ વાતનું છે — એકલતા, કે સમજ ન પડવું?",
      action: "કોઈને જવાબ આપવા કે ફરી ચેટ જોવા પહેલાં 20 મિનિટ રોકાઓ અને પાણી પીઓ. આજે કંઈ નક્કી કરવાની જરૂર નથી.",
    },
  },
  family: {
    en: {
      reflect: "Pressure from home is heavy in a particular way: you can disagree with it and still want their approval.",
      question: "If you could say one honest sentence to them without any consequence, what would it be?",
      action: "Hold that sentence. You do not have to send it. Tonight, find one person outside the family you can say it to out loud.",
    },
    hi: {
      reflect: "घर का दबाव एक अलग तरह से भारी होता है: आप सहमत न हों, फिर भी उनकी मंज़ूरी चाहिए होती है।",
      question: "अगर कोई नुकसान न होता, तो आप उनसे एक सच्ची बात क्या कहते?",
      action: "वह वाक्य याद रखिए, भेजने की ज़रूरत नहीं। आज किसी एक ऐसे व्यक्ति को खोजिए जो परिवार से बाहर है और उसे बोलकर कहिए।",
    },
    gu: {
      reflect: "ઘરનું દબાણ એક અલગ રીતે ભારે હોય છે: તમે સહમત ન હોવ, તો પણ તેમની મંજૂરી જોઈએ.",
      question: "જો કોઈ નુકસાન ન થાય, તો તમે તેમને એક સાચી વાત શું કહો?",
      action: "એ વાક્ય યાદ રાખો, મોકલવાની જરૂર નથી. આજે પરિવારની બહાર એક વ્યક્તિ શોધો અને બોલીને કહો.",
    },
  },
  anger: {
    en: {
      reflect: "Anger that strong usually means something you care about got stepped on.",
      question: "What did it protect? Underneath the anger, is there something that felt unfair?",
      action: "Leave the room, put the phone face down, and take 10 slow breaths with a longer breath out. No messages and no decisions while it's this hot.",
    },
    hi: {
      reflect: "इतना गुस्सा आमतौर पर इस बात का संकेत है कि आपकी कोई पसंदीदा चीज़ ठेस पहुँची है।",
      question: "इस गुस्से के नीचे क्या है — कहीं कुछ गलत लगा?",
      action: "कमरे से निकल जाइए, फोन उल्टा रखिए और 10 धीमी सांसें लीजिए, बाहर छोड़ना लंबा रखिए। इतने गुस्से में कोई संदेश या फैसला नहीं।",
    },
    gu: {
      reflect: "આટલો ગુસ્સો સામાન્ય રીતે કહે છે કે તમારી કોઈ વાતને ઠેસ પહોંચી છે.",
      question: "આ ગુસ્સા નીચે શું છે — કંઈક અન્યાય જેવું લાગ્યું?",
      action: "રૂમમાંથી નીકળો, ફોન ઊંધો મૂકો અને 10 ધીમા શ્વાસ લો, બહાર છોડવું લાંબું રાખો. આટલા ગુસ્સામાં સંદેશ કે નિર્ણય નહીં.",
    },
  },
  low: {
    en: {
      reflect: "Days like this are heavy, and it is not a character flaw that you are finding it hard.",
      question: "Is this more tiredness, or more hopelessness? They need different things.",
      action: "One small thing, in the next 10 minutes: open a window, wash your face, or step outside. Then come back and tell me if it changed anything.",
    },
    hi: {
      reflect: "ऐसे दिन भारी होते हैं, और मुश्किल लगना कोई कमज़ोरी नहीं है।",
      question: "यह ज़्यादा थकान है या ज़्यादा निराशा? दोनों को अलग चीज़ चाहिए।",
      action: "अगले 10 मिनट में एक छोटा काम: खिड़की खोलिए, मुँह धोइए या बाहर निकल जाइए। फिर बताइए कुछ बदला या नहीं।",
    },
    gu: {
      reflect: "આવા દિવસો ભારે હોય છે, અને મુશ્કેલ લાગવું નબળાઈ નથી.",
      question: "આ વધારે થાક છે કે વધારે નિરાશા? બંનેને અલગ વસ્તુ જોઈએ.",
      action: "આગળની 10 મિનિટમાં એક નાનું કામ: બારી ખોલો, મોં ધોઈ લો કે બહાર નીકળો. પછી કહો કે કંઈ બદલાયું કે નહીં.",
    },
  },
  generic: {
    en: {
      reflect: "Thanks for putting that into words — that is often the hardest part.",
      question: "What would make today slightly more bearable, even a little?",
      action: "Tell me one thing you want to get off your chest, and we can go from there. No structure needed.",
    },
    hi: {
      reflect: "इसे शब्दों में कहने के लिए धन्यवाद — सबसे मुश्किल हिस्सा अक्सर यही होता है।",
      question: "आज को थोड़ा हल्का बनाने के लिए क्या मदद करेगा?",
      action: "जो भी मन में है, एक बात कहिए। कोई क्रम या तरीका ज़रूरी नहीं है।",
    },
    gu: {
      reflect: "આને શબ્દોમાં કહેવા માટે આભાર — સૌથી અઘરો ભાગ સામાન્ય રીતે આ જ હોય છે.",
      question: "આજને થોડું હળવું કરવા શું મદદ કરશે?",
      action: "મનમાં જે છે તે એક વાત કહો. કોઈ ક્રમ કે રીત જરૂરી નથી.",
    },
  },
};

const NEED_OVERRIDE: Partial<Record<Need, Record<Language, string>>> = {
  vent: {
    en: "I won't jump to solutions. Just keep going - I'm listening.",
    hi: "मैं तुरंत सलाह देने नहीं लगूँगा/लगूँगी। आप बताते जाइए, मैं सुन रहा/रही हूँ।",
    gu: "હું તરત સલાહ આપવા નહીં લાગું. તમે કહેતા જાઓ, હું સાંભળું છું.",
  },
  calm: {
    en: "Let's slow this down first. Breathe in for four, out for six, and do it four times. I'll wait.",
    hi: "पहले इसे धीमा करते हैं। चार तक सांस लीजिए, छह तक छोड़िए, चार बार। मैं रुका/रुकी हूँ।",
    gu: "પહેલા આ ધીમું કરીએ. ચાર સુધી શ્વાસ લો, છ સુધી છોડો, ચાર વાર. હું રાહ જોઉં છું.",
  },
  human: {
    en: "Human help is worth taking here: Tele-MANAS on 14416 is free and answered 24x7 in India.",
    hi: "यहाँ किसी इंसान की मदद लेना फायदेमंद है: टेली-मानस 14416 मुफ्त है और भारत में 24x7 उपलब्ध है।",
    gu: "અહીં માણસની મદદ લેવી યોગ્ય છે: ટેલી-માનસ 14416 મફત છે અને ભારતમાં 24x7 ઉપલબ્ધ છે.",
  },
};

function groupFor(message: string, need?: Need | null): Group {
  const emotions = detectEmotions(message);
  if (emotions.includes("anger")) return "anger";
  const domain: Domain | null = detectDomain(message);
  switch (domain) {
    case "study":
      return "study";
    case "work":
    case "money":
      return "work_money";
    case "relationship":
      return "relationship";
    case "family":
      return "family";
    case "health":
    case "identity":
      return "low";
    default:
      break;
  }
  if (
    emotions.includes("sadness") ||
    emotions.includes("anxiety") ||
    emotions.includes("exhaustion") ||
    emotions.includes("shame") ||
    emotions.includes("loneliness")
  ) {
    return need === "calm" ? "low" : "low";
  }
  return "generic";
}

export function demoReply(args: DemoArgs): string {
  const language: Language = args.language ?? "en";
  const group = groupFor(args.message, args.need);
  const template = TEMPLATES[group][language] ?? TEMPLATES[group].en;
  const continuing = (args.history?.length ?? 0) >= 4;

  const parts: string[] = [];
  if (continuing) {
    parts.push(
      language === "hi"
        ? "मैं आपके साथ हूँ।"
        : language === "gu"
          ? "હું તમારી સાથે છું."
          : "I'm still with you.",
    );
  }

  const override = args.need ? NEED_OVERRIDE[args.need]?.[language] : undefined;
  parts.push(template.reflect);
  if (override) parts.push(override);
  parts.push(template.question);
  parts.push(template.action);

  return parts.join("\n\n");
}

export function demoNotice(language: Language): string {
  switch (language) {
    case "hi":
      return "डेमो मोड: कोई मॉडल API key सेट नहीं है, इसलिए जवाब पहले से लिखे ढाँचों से बन रहे हैं। सेटअप में GEMINI_API_KEY जोड़ते ही असली AI चालू हो जाएगा।";
    case "gu":
      return "ડેમો મોડ: કોઈ મોડેલ API key સેટ નથી, તેથી જવાબ પહેલેથી લખેલા નમૂનાઓથી બને છે. GEMINI_API_KEY ઉમેરતાં જ સાચું AI ચાલુ થશે.";
    default:
      return "Demo mode: no model API key is set, so replies come from hand-written templates. Add GEMINI_API_KEY and the real model turns on automatically.";
  }
}
