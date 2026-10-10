/**
 * Mobile copy in English, Hindi and Gujarati.
 *
 * Same rule as the web app: Hindi and Gujarati are typed against the English
 * shape, so a forgotten key is a compile error rather than a half-English screen.
 */

import type { Language, Need } from "@/lib/types";

const en = {
  appName: "StressFree AI",

  tabs: { talk: "Talk", tools: "Calm", safety: "Safety" },

  common: {
    stop: "Stop",
    start: "Start",
    reset: "Start over",
    next: "Next",
    close: "Close",
  },

  onboarding: {
    title: "Before we start",
    intro:
      "Two quick questions, then you can talk. You can change any answer later, and delete everything at any time.",
    languageQuestion: "Which language feels most comfortable?",
    ageQuestion: "Are you under 18?",
    ageYes: "Under 18",
    ageNo: "18 or older",
    minorNote:
      "Under 18: nothing is saved between sessions, and we will always point you to an adult who can help or to Childline 1098.",
    consentLabel:
      "I understand this is an AI companion, not a therapist, and that it cannot keep me safe on its own.",
    consentRequired: "Please tick the box above to continue.",
    start: "Start talking",
  },

  chat: {
    greeting:
      "Hi, I'm StressFree. There's no rush here and nothing you need to say correctly. What's weighing on you most today?",
    placeholder: "Type whatever is there. No need to make sense of it first.",
    send: "Send",
    thinking: "Thinking about what you said",
    newChat: "New conversation",
    needTitle: "What do you need right now?",
    need: {
      vent: "Just listen",
      calm: "Calm down",
      solve: "Solve a problem",
      plan: "Make a plan",
      distract: "Distract me",
      human: "Talk to a human",
    } as Record<Need, string>,
    needChange: "Change what I need",
    tryOne: "You could try saying",
    demoNotice:
      "Demo mode: no model key is set on the server, so replies come from written templates. Safety routing still works fully.",
    errorRate: "You're sending messages very quickly. Take one slow breath, then try again.",
    errorGeneric: "Something went wrong on my side. Please try that message again.",
    errorNetwork: "I couldn't reach the server. Check your connection and try again.",
    eraseHint: "Delete everything in Settings on the Safety tab.",
  },

  crisis: {
    title: "Let's get you real support right now",
    subtitle:
      "I'm an AI. I can stay here with you, but I can't keep you safe. A trained person on a phone line can do what I can't, and it's free.",
    callNow: "Tap to call",
    close: "Keep talking",
    minorsLine: "If you are under 18, Childline 1098 is free and answered 24x7.",
  },

  tools: {
    title: "Calm tools",
    subtitle: "Small things that work in under ten minutes. No cost, no equipment.",
    breathing: "Box breathing",
    breathingNote: "Four counts in, four hold, four out, four hold. Follow the number.",
    breatheIn: "Breathe in",
    hold: "Hold",
    breatheOut: "Breathe out",
    grounding: "5-4-3-2-1 grounding",
    groundingNote: "Name things you can sense right now, to pull attention out of your head.",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
    finish: "Finish",
    done: "Done. Nothing was saved.",
    round: "round",
    openChat: "Prefer to talk it through? Open the chat",
  },

  safety: {
    title: "Safety and limits",
    subtitle: "Read this before a bad day, not during one.",
    limitsTitle: "The limits, stated plainly",
    limits: [
      "Not a therapist, psychologist, psychiatrist or doctor, and not a replacement for one.",
      "It does not diagnose. It cannot tell you whether you have depression or anxiety, and never will.",
      "It does not comment on medication, dosage or medical reports.",
      "It cannot keep you safe on its own. It is software, and software is not a person.",
    ],
    helplinesTitle: "Free human help in India",
    helplinesNote: "Numbers change. If one does not connect, try another, or ask someone nearby to call with you.",
    sourceServer: "Numbers loaded from the server and saved on this device.",
    sourceCache: "Offline: showing the saved copy of the numbers.",
    sourceOffline: "Offline: showing the emergency numbers only. Connect to load the full list.",
    chatCta: "Talk to me first",
    settingsTitle: "Settings on this device",
    language: "Language",
    memory: "Remember chats on this device",
    memoryOn: "On",
    memoryOff: "Off (nothing is saved)",
    eraseTitle: "Erase everything",
    eraseBody: "Deletes chats, saved numbers and settings from this phone. Cannot be undone.",
    eraseButton: "Erase everything",
    confirmErase: "Tap again to confirm",
    erased: "Everything was erased. You will see the intro again.",
  },
};

export type Dict = typeof en;

const hi: Dict = {
  appName: "स्ट्रेसफ्री AI",

  tabs: { talk: "बात", tools: "शांत", safety: "सुरक्षा" },

  common: {
    stop: "रोकें",
    start: "शुरू",
    reset: "फिर से शुरू",
    next: "आगे",
    close: "बंद",
  },

  onboarding: {
    title: "शुरू करने से पहले",
    intro:
      "दो छोटे सवाल, फिर आप बात कर सकते हैं। जवाब कभी भी बदल सकते हैं, और सारा डेटा कभी भी मिटा सकते हैं।",
    languageQuestion: "किस भाषा में सहज महसूस होता है?",
    ageQuestion: "क्या आप 18 से कम हैं?",
    ageYes: "18 से कम",
    ageNo: "18 या ज़्यादा",
    minorNote:
      "18 से कम उम्र: सेशन के बीच कुछ सेव नहीं होता, और हम आपको हमेशा किसी भरोसेमंद बड़े या चाइल्डलाइन 1098 की तरफ भेजेंगे।",
    consentLabel:
      "मैं समझता/समझती हूँ कि यह एक AI साथी है, थेरेपिस्ट नहीं, और अकेले मेरी सुरक्षा की ज़िम्मेदारी नहीं ले सकता।",
    consentRequired: "आगे बढ़ने के लिए ऊपर का बॉक्स टिक कीजिए।",
    start: "बात शुरू कीजिए",
  },

  chat: {
    greeting:
      "मैं स्ट्रेसफ्री हूँ। यहाँ कुछ भी कहने के लिए कोई जल्दी नहीं है। आज मन में सबसे भारी क्या महसूस हो रहा है?",
    placeholder: "जो मन में है वही लिखिए। पहले समझने या सजाने की ज़रूरत नहीं।",
    send: "भेजें",
    thinking: "आपकी बात पर सोच रहा हूँ",
    newChat: "नई बातचीत",
    needTitle: "इस समय आपको क्या चाहिए?",
    need: {
      vent: "सिर्फ कोई सुने",
      calm: "शांत होने में मदद",
      solve: "किसी परेशानी का हल",
      plan: "प्लान बनाने में मदद",
      distract: "ध्यान भटकाने वाला कुछ",
      human: "किसी इंसान से बात",
    } as Record<Need, string>,
    needChange: "मेरी ज़रूरत बदलिए",
    tryOne: "आप यह कह सकते हैं",
    demoNotice:
      "डेमो मोड: सर्वर पर कोई मॉडल key सेट नहीं है, इसलिए जवाब लिखे ढाँचों से बन रहे हैं। सुरक्षा मार्ग पूरी तरह काम करते हैं।",
    errorRate: "आप बहुत तेज़ी से संदेश भेज रहे हैं। एक गहरी साँस लेकर फिर कोशिश कीजिए।",
    errorGeneric: "मेरी तरफ़ कुछ गड़बड़ हुई। कृपया वह संदेश फिर भेजिए।",
    errorNetwork: "सर्वर तक नहीं पहुँच सका। कनेक्शन जाँचकर फिर कोशिश कीजिए।",
    eraseHint: "सब कुछ मिटाने के लिए सुरक्षा टैब में सेटिंग्स देखिए।",
  },

  crisis: {
    title: "चलिए, अभी आपको असली सहायता दिलाएँ",
    subtitle:
      "मैं एक AI हूँ। मैं आपके साथ रह सकता/सकती हूँ, पर आपकी सुरक्षा नहीं दे सकता/सकती। फोन पर प्रशिक्षित व्यक्ति वह कर सकता है जो मैं नहीं कर सकता, और वह मुफ्त है।",
    callNow: "कॉल करने के लिए टैप कीजिए",
    close: "बात जारी रखें",
    minorsLine: "18 से कम उम्र हैं तो चाइल्डलाइन 1098 मुफ्त है और 24x7 उपलब्ध है।",
  },

  tools: {
    title: "शांत होने के तरीके",
    subtitle: "दस मिनट से कम में असर करने वाली छोटी चीज़ें। मुफ्त, बिना किसी सामान के।",
    breathing: "बॉक्स ब्रीदिंग",
    breathingNote: "चार तक सांस लीजिए, चार रोकिए, चार छोड़िए, चार रोकिए। संख्या के साथ चलिए।",
    breatheIn: "सांस लें",
    hold: "रोकें",
    breatheOut: "छोड़ें",
    grounding: "5-4-3-2-1 ग्राउंडिंग",
    groundingNote: "जो अभी महसूस हो रहा है उसे नाम दीजिए, ताकि ध्यान सिर से बाहर आए।",
    steps: [
      "5 चीज़ें जो दिखती हैं",
      "4 चीज़ें जो छू सकते हैं",
      "3 आवाज़ें जो सुनाई देती हैं",
      "2 चीज़ें जिनकी महक आती है",
      "1 चीज़ जिसका स्वाद है",
    ],
    finish: "पूरा",
    done: "हो गया। कुछ भी सेव नहीं हुआ।",
    round: "राउंड",
    openChat: "बात करके निपटाना बेहतर लगे? चैट खोलिए",
  },

  safety: {
    title: "सुरक्षा और सीमाएँ",
    subtitle: "इसे खराब दिन से पहले पढ़िए, खराब दिन में नहीं।",
    limitsTitle: "सीमाएँ, साफ़ शब्दों में",
    limits: [
      "थेरेपिस्ट, मनोवैज्ञानिक, मनोचिकित्सक या डॉक्टर नहीं, और उनकी जगह नहीं ले सकता।",
      "यह निदान नहीं करता। यह नहीं बता सकता कि आपको डिप्रेशन या एंग्ज़ाइटी है, और कभी नहीं बताएगा।",
      "यह दवा, डोज़ या मेडिकल रिपोर्ट पर टिप्पणी नहीं करता।",
      "यह अकेले आपकी सुरक्षा नहीं दे सकता। यह सॉफ़्टवेयर है, और सॉफ़्टवेयर इंसान नहीं होता।",
    ],
    helplinesTitle: "भारत में मुफ्त इंसानी मदद",
    helplinesNote: "नंबर बदलते रहते हैं। एक न लगे तो दूसरा आज़माइए, या पास किसी से साथ में कॉल करवाइए।",
    sourceServer: "नंबर सर्वर से लोड होकर इस डिवाइस पर सेव हैं।",
    sourceCache: "ऑफलाइन: नंबरों की सेव की हुई कॉपी दिख रही है।",
    sourceOffline: "ऑफलाइन: सिर्फ आपातकालीन नंबर दिख रहे हैं। पूरी सूची के लिए कनेक्ट कीजिए।",
    chatCta: "पहले मुझसे बात कीजिए",
    settingsTitle: "इस डिवाइस की सेटिंग्स",
    language: "भाषा",
    memory: "इस डिवाइस पर बातचीत याद रखें",
    memoryOn: "चालू",
    memoryOff: "बंद (कुछ सेव नहीं)",
    eraseTitle: "सब कुछ मिटाइए",
    eraseBody: "इस फोन से चैट, सेव किए नंबर और सेटिंग्स हट जाएँगी। वापस नहीं आएँगी।",
    eraseButton: "सब मिटाइए",
    confirmErase: "पक्का करने के लिए फिर टैप कीजिए",
    erased: "सब कुछ मिट गया। अगली बार फिर शुरुआत दिखेगी।",
  },
};

const gu: Dict = {
  appName: "સ્ટ્રેસફ્રી AI",

  tabs: { talk: "વાત", tools: "શાંત", safety: "સલામતી" },

  common: {
    stop: "બંધ",
    start: "શરૂ",
    reset: "ફરી શરૂ",
    next: "આગળ",
    close: "બંધ કરો",
  },

  onboarding: {
    title: "શરૂ કરતાં પહેલાં",
    intro:
      "બે નાના પ્રશ્નો, પછી તમે વાત કરી શકો. જવાબ ક્યારેય બદલી શકાય છે, અને બધું ક્યારેય ભૂંસી શકાય છે.",
    languageQuestion: "કઈ ભાષામાં સહજ લાગે છે?",
    ageQuestion: "તમે 18થી ઓછી ઉંમરના છો?",
    ageYes: "18થી ઓછી",
    ageNo: "18 કે વધુ",
    minorNote:
      "18થી ઓછી ઉંમર: સેશન વચ્ચે કંઈ સેવ થતું નથી, અને અમે તમને હંમેશા વિશ્વાસપાત્ર મોટી વ્યક્તિ કે ચાઈલ્ડલાઈન 1098 તરફ મોકલીશું.",
    consentLabel:
      "હું સમજું છું કે આ એક AI સાથી છે, થેરાપિસ્ટ નહીં, અને એકલું મારી સલામતીની જવાબદારી લઈ શકતું નથી.",
    consentRequired: "આગળ વધવા ઉપરનું બોક્સ ટિક કરો.",
    start: "વાત શરૂ કરો",
  },

  chat: {
    greeting:
      "હું સ્ટ્રેસફ્રી છું. અહીં કંઈ કહેવામાં જલદી નથી. આજે મનમાં સૌથી ભારે શું લાગે છે?",
    placeholder: "મનમાં જે છે તે લખો. પહેલા સમજવું કે સજાવવું જરૂરી નથી.",
    send: "મોકલો",
    thinking: "તમે કહ્યું તેના વિશે વિચારું છું",
    newChat: "નવી વાત",
    needTitle: "અત્યારે તમને શું જોઈએ?",
    need: {
      vent: "ફક્ત કોઈ સાંભળે",
      calm: "શાંત થવામાં મદદ",
      solve: "કોઈ સમસ્યાનો ઉકેલ",
      plan: "પ્લાન બનાવવામાં મદદ",
      distract: "ધ્યાન ફેરવે તેવું કંઈક",
      human: "માણસ સાથે વાત",
    } as Record<Need, string>,
    needChange: "મારી જરૂરિયાત બદલો",
    tryOne: "તમે આ કહી શકો",
    demoNotice:
      "ડેમો મોડ: સર્વર પર કોઈ મોડેલ key સેટ નથી, તેથી જવાબ લખેલા નમૂનાઓથી બને છે. સલામતી માર્ગ પૂરેપૂરા કામ કરે છે.",
    errorRate: "તમે ખૂબ ઝડપથી સંદેશ મોકલો છો. એક ઊંડો શ્વાસ લઈને ફરી પ્રયત્ન કરો.",
    errorGeneric: "મારી બાજુ કંઈ ખોટું થયું. કૃપા કરીને એ સંદેશ ફરી મોકલો.",
    errorNetwork: "સર્વર સુધી પહોંચી શક્યો નહીં. કનેક્શન તપાસીને ફરી પ્રયત્ન કરો.",
    eraseHint: "બધું ભૂંસવા સલામતી ટેબમાં સેટિંગ્સ જુઓ.",
  },

  crisis: {
    title: "ચાલો, હમણાં તમને સાચી મદદ મળે",
    subtitle:
      "હું એક AI છું. હું તમારી સાથે રહી શકું, પણ સલામતી આપી શકતો/શકતી નથી. ફોન પરનો તાલીમબદ્ધ માણસ એ કરી શકે જે હું ન કરી શકું, અને તે મફત છે.",
    callNow: "કૉલ કરવા ટૅપ કરો",
    close: "વાત ચાલુ રાખો",
    minorsLine: "18થી ઓછી ઉંમર હોય તો ચાઈલ્ડલાઈન 1098 મફત છે અને 24x7 ઉપલબ્ધ છે.",
  },

  tools: {
    title: "શાંત થવાની રીતો",
    subtitle: "દસ મિનિટથી ઓછામાં કામ લાગે તેવી નાની વાતો. મફત, કોઈ સાધન વગર.",
    breathing: "બોક્સ શ્વાસ",
    breathingNote: "ચાર સુધી શ્વાસ લો, ચાર રોકો, ચાર છોડો, ચાર રોકો. સંખ્યા સાથે ચાલો.",
    breatheIn: "શ્વાસ લો",
    hold: "રોકો",
    breatheOut: "છોડો",
    grounding: "5-4-3-2-1 ગ્રાઉન્ડિંગ",
    groundingNote: "અત્યારે જે અનુભવો છો તેને નામ આપો, જેથી ધ્યાન માથામાંથી બહાર આવે.",
    steps: [
      "5 વસ્તુ જે દેખાય છે",
      "4 વસ્તુ જે અડકી શકાય છે",
      "3 અવાજ જે સંભળાય છે",
      "2 વસ્તુ જેની સુગંધ આવે છે",
      "1 વસ્તુ જેનો સ્વાદ છે",
    ],
    finish: "પૂરું",
    done: "થઈ ગયું. કંઈ સેવ થયું નથી.",
    round: "રાઉન્ડ",
    openChat: "વાત કરીને કરવું સારું લાગે? ચેટ ખોલો",
  },

  safety: {
    title: "સલામતી અને મર્યાદા",
    subtitle: "ખરાબ દિવસ પહેલાં વાંચો, ખરાબ દિવસમાં નહીં.",
    limitsTitle: "મર્યાદા, સાફ શબ્દોમાં",
    limits: [
      "થેરાપિસ્ટ, મનોવૈજ્ઞાનિક, મનોચિકિત્સક કે ડૉક્ટર નથી, અને તેમની જગ્યા લઈ શકતું નથી.",
      "તે નિદાન કરતું નથી. તમને ડિપ્રેશન કે ચિંતા છે કે નહીં તે કહી શકતું નથી, અને ક્યારેય નહીં કહે.",
      "તે દવા, ડોઝ કે મેડિકલ રિપોર્ટ પર ટિપ્પણી કરતું નથી.",
      "તે એકલું તમારી સલામતી આપી શકતું નથી. તે સોફ્ટવેર છે, અને સોફ્ટવેર માણસ નથી.",
    ],
    helplinesTitle: "ભારતમાં મફત માનવીય મદદ",
    helplinesNote: "નંબર બદલાતા રહે છે. એક ન લાગે તો બીજો પ્રયત્ન કરો, અથવા નજીકના કોઈને સાથે કૉલ કરાવો.",
    sourceServer: "નંબર સર્વરથી લોડ થઈને આ ડિવાઇસ પર સેવ છે.",
    sourceCache: "ઑફલાઇન: નંબરોની સેવ કરેલી કૉપી દેખાય છે.",
    sourceOffline: "ઑફલાઇન: ફક્ત ઈમરજન્સી નંબર દેખાય છે. પૂરી યાદી માટે કનેક્ટ કરો.",
    chatCta: "પહેલા મારી સાથે વાત કરો",
    settingsTitle: "આ ડિવાઇસની સેટિંગ્સ",
    language: "ભાષા",
    memory: "આ ડિવાઇસ પર વાત યાદ રાખો",
    memoryOn: "ચાલુ",
    memoryOff: "બંધ (કંઈ સેવ નહીં)",
    eraseTitle: "બધું ભૂંસો",
    eraseBody: "આ ફોન પરથી ચેટ, સેવ કરેલા નંબર અને સેટિંગ્સ જતા રહેશે. પાછા નહીં આવે.",
    eraseButton: "બધું ભૂંસો",
    confirmErase: "ખાતરી માટે ફરી ટૅપ કરો",
    erased: "બધું ભૂંસાઈ ગયું. આગલી વારે ફરી શરૂઆત દેખાશે.",
  },
};

export const DICTS: Record<Language, Dict> = { en, hi, gu };

export function t(language: Language): Dict {
  return DICTS[language] ?? DICTS.en;
}
