/**
 * UI copy in English, Hindi and Gujarati.
 *
 * Hindi and Gujarati are typed against the English shape, so a missing key is a
 * compile error - a half-translated screen is worse than an untranslated one.
 *
 * The model replies in the user's chosen language separately (see lib/ai/prompt.ts).
 */

import type { Language } from "@/lib/types";

const en = {
  appName: "StressFree AI",
  tagline: "A companion for heavy days. Not a therapist, and honest about it.",
  promiseTitle: "Pause, understand what you feel, take one small step.",
  promiseBody:
    "StressFree AI listens, helps you name what is going on, suggests one thing you can actually do in the next ten minutes, and points you to real human help when that is what you need.",

  nav: { chat: "Talk", tools: "Calm tools", student: "Student mode", safety: "Safety", privacy: "Privacy" },

  common: {
    back: "Back",
    next: "Next",
    start: "Start talking",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    delete: "Delete",
    optional: "optional",
  },

  onboarding: {
    welcome: "Before we start",
    intro:
      "Three quick questions, then you can talk. You can change any answer later, and you can delete everything at any time.",
    whatItIs: "What this is",
    whatItIsList: [
      "Someone to talk to at 2am, without judgment",
      "Tools that work in ten minutes: breathing, grounding, one small task",
      "A signpost to free human help when things are serious",
    ],
    whatItIsNot: "What this is not",
    whatItIsNotList: [
      "Not a therapist, doctor or counsellor",
      "It cannot diagnose anything or advise on medicine",
      "It remembers nothing unless you leave memory on",
      "It is an AI. It is not a person, and it will tell you so if you ask",
    ],
    ageQuestion: "Roughly how old are you? This only changes the tone we use.",
    ageTeen: "Under 18",
    ageYoung: "18 to 25",
    ageAdult: "26 to 45",
    ageOlder: "Above 45",
    minorNotice:
      "Under 18: nothing is saved between sessions, and we will always point you to an adult who can help or to Childline 1098. A parent or guardian should ideally be part of your support, not kept out of it.",
    languageQuestion: "Which language feels most comfortable?",
    needQuestion: "When you talk to me, what do you usually want?",
    needVent: "Someone to just listen",
    needCalm: "Help calming down",
    needSolve: "Help with a problem",
    needPlan: "Help making a plan",
    needDistract: "Something to distract me",
    needHuman: "A human to talk to",
    consentLabel:
      "I understand this is an AI companion, not a therapist, and that it cannot keep me safe on its own.",
    consentRequired: "Please tick the box above to continue.",
    memoryQuestion: "Remember my chats on this device?",
    memoryOn: "Yes, keep them here",
    memoryOff: "No, keep nothing",
    memoryNote:
      "Chats stay in this browser. The text of your current message goes to the AI model to get a reply, and is not stored on our servers.",
    finish: "Start",
  },

  chat: {
    placeholder: "Type whatever is there. No need to make sense of it first.",
    send: "Send",
    thinking: "Thinking about what you said",
    newChat: "Start a new conversation",
    demoBadge: "Demo mode - template replies",
    liveBadge: "Connected",
    quickTools: "Quick tools",
    tryOne: "You could try saying",
    needPickerTitle: "What do you need right now?",
    needChange: "Change what I need",
    limitedDemo:
      "Demo mode is on: replies come from written templates, not a live model. The calm tools and safety routing below all work fully.",
  },

  crisis: {
    title: "Let's get you real support right now",
    subtitle:
      "I'm an AI. I can stay here with you, but I can't keep you safe. A trained person on a phone line can do what I can't, and it's free.",
    callNow: "Tap to call",
    checkQuestion: "Are you in immediate danger right now, or with someone who scares you?",
    checkYes: "Yes, right now",
    checkNo: "No, not right now",
    checkYesReply:
      "Then call 112 or go somewhere with other people and call from there. Please do it before you reply to me. I'll be here after.",
    checkNoReply:
      "Thank you for telling me. Let's use the next few minutes well, and keep one number handy in case it changes.",
    openTools: "Open a calming exercise with me",
    close: "Keep talking",
    minorsLine: "If you are under 18, Childline 1098 is free and answered 24x7.",
  },

  tools: {
    title: "Calm tools",
    subtitle: "Small things that work in under ten minutes. No cost, no equipment.",
    breathing: "Box breathing",
    breathingNote: "Four counts in, four hold, four out, four hold. Follow the ring.",
    start: "Start",
    stop: "Stop",
    cycle: "round",
    grounding: "5-4-3-2-1 grounding",
    groundingNote: "Name things you can sense right now, to pull your attention out of your head.",
    see: "5 things you can see",
    touch: "4 things you can touch",
    hear: "3 things you can hear",
    smell: "2 things you can smell",
    taste: "1 thing you can taste",
    journal: "One-line journal",
    journalNote: "One line is enough. Nobody reads this but you.",
    journalPrompt: "The truest thing about today is...",
    journalSaved: "Saved on this device",
    walk: "Ten-minute walk",
    walkNote:
      "Out of the room, phone in pocket, no scrolling. Walk for ten minutes and come back and tell me if anything moved.",
    study: "Twenty-minute reset",
    studyNote:
      "One topic. Twenty minutes on, five off. Write the topic down before you start, so the timer is not the decision.",
    reset: "Start over",
  },

  mood: {
    title: "Mood check-in",
    how: "How is today, roughly?",
    terrible: "Very heavy",
    low: "Low",
    okay: "Okay",
    good: "Good",
    great: "Good day",
    tags: "Anything behind it?",
    tagStudy: "Studies",
    tagWork: "Work",
    tagMoney: "Money",
    tagPeople: "People",
    tagBody: "Sleep or body",
    tagFamily: "Family",
    tagNothing: "Nothing specific",
    note: "Anything you want to note",
    save: "Save check-in",
    saved: "Saved",
    trend: "Last two weeks",
    empty: "No check-ins yet.",
    average: "Average",
  },

  circle: {
    title: "Support circle",
    subtitle:
      "People you could actually message. Names stay on this device and are never sent to the AI.",
    name: "Name",
    relation: "Who they are",
    phone: "Phone",
    add: "Add person",
    remove: "Remove",
    messageTitle: "A message you can send",
    template:
      "I'm having a really hard time right now. I'm not asking you to fix it. Can you just stay with me for a bit, on call or here?",
    copy: "Copy message",
    empty: "No one saved yet. Adding one person now is easier than finding them during a bad night.",
  },

  privacy: {
    title: "Privacy and your data",
    subtitle: "Plain-language version. No legal fog.",
    stored: "What is stored right now",
    storedMessages: "Chat messages",
    storedMoods: "Mood check-ins",
    storedContacts: "Saved contacts",
    onDevice: "on this device",
    memory: "Memory between sessions",
    memoryOnLabel: "On",
    memoryOffLabel: "Off (nothing is saved)",
    exportTitle: "Export everything",
    exportBody: "Download a JSON file with all of it, to keep or to move elsewhere.",
    exportButton: "Download my data",
    deleteChats: "Delete the conversation",
    deleteChatsBody: "Removes chat history and mood check-ins from this device. Cannot be undone.",
    deleteChatsButton: "Delete chats",
    eraseAll: "Erase everything",
    eraseAllBody: "Removes chats, moods, saved contacts and your settings. Cannot be undone.",
    eraseAllButton: "Erase everything",
    confirmDelete: "Tap again to confirm",
    limits: "What we cannot promise",
    limitsList: [
      "We cannot recover deleted data - it only ever lived in your browser",
      "The message you send is transmitted to the AI provider to generate a reply",
      "A shared or family device can see this history, so use erase if that matters",
      "We cannot keep you safe. In a crisis, call a helpline or 112.",
    ],
  },

  safety: {
    title: "Safety, limits and human help",
    subtitle:
      "This page exists so nobody has to guess what this app can and cannot do. Read it before a bad day, not during one.",
    limitsTitle: "The limits, stated plainly",
    limitsBody: [
      "StressFree AI is not a therapist, psychologist, psychiatrist or doctor, and it does not replace one.",
      "It does not diagnose. It cannot tell you whether you have depression, anxiety or anything else, and it never will.",
      "It does not prescribe or comment on medication, dosage, or medical reports.",
      "It cannot keep you safe on its own. It is software, and software is not a person.",
      "It will never ask you to rely on it instead of the people in your life. If it ever does, that is a bug - please report it.",
      "It remembers nothing if you switch memory off, and everything it does store stays in your browser.",
    ],
    howTitle: "What happens when risk appears",
    howSteps: [
      "A separate safety layer reads messages for signs of suicide, self-harm, violence, abuse or medical danger. This runs before the AI and cannot be talked around.",
      "If you seem to be at risk, normal chat stops and you get a direct, plain response plus one-tap calling for helplines.",
      "Nothing is hidden from you: the app tells you when it has switched modes.",
      "If you are in immediate danger with no one around, call 112.",
    ],
    helplinesTitle: "Free human help in India",
    helplinesNote:
      "Numbers change. If one does not connect, try another, or ask someone nearby to call with you.",
    globalTitle: "Outside India",
    globalNote: "Find your country's crisis line at findahelpline.com.",
    reportTitle: "Report a harmful reply",
    reportBody:
      "If the AI said something wrong, dismissive, diagnostic or unsafe, tell us. Screenshot the message and email it, without any personal details you do not want to share.",
  },

  student: {
    title: "Student mode",
    subtitle:
      "For exam, career and faculty pressure. It is built to make the next twenty minutes easier, not to plan your whole life.",
    privacyNote:
      "Everything on this page stays on this device. Nothing is uploaded, there is no account, and no AI model is called.",
    planTitle: "Exam plan",
    planNote:
      "Count the days, then let the plan pick one topic per block. You are not behind - you are a person with a finite day.",
    examLabel: "Exam or paper",
    examPlaceholder: "e.g. Physics paper 1",
    dateLabel: "Exam date",
    daysLeftMany: "days left",
    daysLeftOne: "day left",
    examPassed: "That date has passed. Change it, or let it go.",
    topicsLabel: "Topics you still have to touch",
    topicPlaceholder: "One topic that fits in 20 minutes",
    addTopic: "Add",
    noTopics: "No topics yet. Start with the smallest one - the one you can actually open.",
    startWith: "Start with",
    nothingLeft: "Every topic has a tick. Close the book and go and eat something.",
    clearPlan: "Clear the plan",
    focusTitle: "Twenty-minute focus",
    focusNote: "Write the topic down first, so deciding is finished before the timer starts.",
    focusPlaceholder: "This block is only about...",
    focusStart: "Start 20 minutes",
    focusStop: "Stop",
    focusPhaseWork: "Focus",
    focusPhaseBreak: "Break",
    focusBreakNote: "Five minutes off. Stand up, drink water, do not open a feed.",
    focusBlocks: "blocks done",
    focusNeedTopic: "Write the topic on one line first, then start.",
    goalsTitle: "Three small things today",
    goalsNote: "Small enough to do on a bad day. This is a floor, not a to-do list.",
    goalsPlaceholder: "Something you can finish today",
    goalsAdd: "Add",
    goalsDone: "done",
    goalsEmpty: "Nothing added yet. One small thing counts.",
    goalsLimit: "Three is the limit on purpose.",
    careerTitle: "Career pressure",
    careerNote:
      "Most of this pressure is other people's fear about your future, handed to you as if it were a fact. Here is how to hold it without pretending it does not matter.",
    careerItems: [
      {
        heading: "Separate the decision from the fear",
        body: "Write the actual question - which course, which job - and then write what is genuinely unknown about it. Panic usually shrinks once it has a shape.",
      },
      {
        heading: "Answer the comparison",
        body: "\"Their son is already earning.\" You can say: \"I am glad for him. My path is slower because I chose one I can stay in.\" Rehearse it once out loud, so you are not inventing it in the moment.",
      },
      {
        heading: "One decision, not all of them",
        body: "You only have to make the next real choice, for the next six months. The rest can stay open without that being failure.",
      },
    ],
    careerScriptTitle: "Things you can actually say",
    careerScripts: [
      "\"I know you are worried. I am taking it seriously. Let me show you what I am doing this month, and then let's talk in a few weeks.\"",
      "\"I am not asking you to stop worrying. I am asking you to say it once, and then let me work.\"",
      "\"Comparing me to someone else does not make me work faster. It makes it harder to sit down. Please stop.\"",
    ],
    facultyTitle: "When a teacher is unfair or angry",
    facultyNote:
      "You cannot control someone else's temper. You can control what you do next - and doing part of it in writing protects you.",
    facultySteps: [
      "Do not argue in front of the class. Nothing good comes from it. Wait until the room is empty, or until tomorrow.",
      "Write down what happened the same day: the date, what was said, who was there. A written record changes what you can do next.",
      "Ask in writing. A short, polite email asking what to improve is harder to dismiss than a verbal request, and it leaves a trail.",
      "Take someone with you if you have to meet them: a classmate waiting outside, or a parent on the phone after.",
    ],
    facultyEmailTitle: "An email you can copy",
    facultyEmail:
      "Subject: A question about <the test / the assignment> in <subject>\n\nRespected Sir/Madam,\n\nI am <name>, a student of <class or semester>. I wanted to ask about <the marks for the last test / the deadline>. Could you please tell me what I should do to improve, or when I could meet you for five minutes after class?\n\nThank you,\n<name>",
    copy: "Copy",
    copied: "Copied",
    heavyTitle: "If a person, not a subject, is the problem",
    heavyBody:
      "Ragging, harassment, a threat, or a teacher who uses their power on you sexually is not a study problem, and no script is the answer. It is not your fault. Tell someone you trust, and call a helpline - this is exactly what they are for.",
    heavyHelplines: "Free, 24x7, in India",
    heavyChat: "Talk it through with me",
    heavySafety: "Read the safety page",
  },
};

export type Dict = typeof en;

const hi: Dict = {
  appName: "स्ट्रेसफ्री AI",
  tagline: "भारी दिनों का साथी। थेरेपिस्ट नहीं, और इसे छिपाता भी नहीं।",
  promiseTitle: "रुकिए, जो महसूस हो रहा है उसे समझिए, एक छोटा कदम उठाइए।",
  promiseBody:
    "स्ट्रेसफ्री AI सुनता है, आपकी बात को नाम देने में मदद करता है, अगले दस मिनट में करने लायक एक काम बताता है, और जब ज़रूरत हो तो असली इंसानी मदद तक पहुँचाता है।",

  nav: { chat: "बात कीजिए", tools: "शांत होने के तरीके", student: "स्टूडेंट मोड", safety: "सुरक्षा", privacy: "निजता" },

  common: {
    back: "पीछे",
    next: "आगे",
    start: "बात शुरू कीजिए",
    cancel: "रद्द",
    save: "सेव",
    close: "बंद",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    delete: "हटाइए",
    optional: "वैकल्पिक",
  },

  onboarding: {
    welcome: "शुरू करने से पहले",
    intro:
      "तीन छोटे सवाल, फिर आप बात कर सकते हैं। जवाब कभी भी बदल सकते हैं और सारा डेटा कभी भी मिटा सकते हैं।",
    whatItIs: "यह क्या है",
    whatItIsList: [
      "रात दो बजे भी बिना जज किए सुनने वाला साथी",
      "दस मिनट में असर करने वाले तरीके: सांस, ग्राउंडिंग, एक छोटा काम",
      "गंभीर स्थिति में मुफ्त इंसानी मदद तक रास्ता",
    ],
    whatItIsNot: "यह क्या नहीं है",
    whatItIsNotList: [
      "थेरेपिस्ट, डॉक्टर या काउंसलर नहीं",
      "कोई निदान नहीं कर सकता, दवा पर सलाह नहीं दे सकता",
      "अगर मेमोरी बंद है तो कुछ याद नहीं रखता",
      "यह एक AI है, इंसान नहीं। पूछेंगे तो यह साफ़ बताएगा",
    ],
    ageQuestion: "आपकी उम्र लगभग क्या है? इससे बस बात करने का तरीका बदलता है।",
    ageTeen: "18 से कम",
    ageYoung: "18 से 25",
    ageAdult: "26 से 45",
    ageOlder: "45 से ऊपर",
    minorNotice:
      "18 से कम उम्र: सेशन के बीच कुछ सेव नहीं होता, और हम आपको हमेशा किसी भरोसेमंद बड़े या चाइल्डलाइन 1098 की तरफ भेजेंगे। माता-पिता या अभिभावक को इससे बाहर रखने की ज़रूरत नहीं, उन्हें साथ रखना बेहतर है।",
    languageQuestion: "किस भाषा में सहज महसूस होता है?",
    needQuestion: "जब आप मुझसे बात करें, आमतौर पर क्या चाहते हैं?",
    needVent: "सिर्फ कोई सुने",
    needCalm: "शांत होने में मदद",
    needSolve: "किसी परेशानी का हल",
    needPlan: "प्लान बनाने में मदद",
    needDistract: "ध्यान भटकाने वाला कुछ",
    needHuman: "किसी इंसान से बात",
    consentLabel:
      "मैं समझता/समझती हूँ कि यह एक AI साथी है, थेरेपिस्ट नहीं, और अकेले मेरी सुरक्षा की ज़िम्मेदारी नहीं ले सकता।",
    consentRequired: "आगे बढ़ने के लिए ऊपर का बॉक्स टिक कीजिए।",
    memoryQuestion: "इस डिवाइस पर मेरी बातचीत याद रखें?",
    memoryOn: "हाँ, यहीं रखिए",
    memoryOff: "नहीं, कुछ न रखिए",
    memoryNote:
      "बातचीत इसी ब्राउज़र में रहती है। जवाब बनाने के लिए आपके वर्तमान संदेश का टेक्स्ट AI मॉडल तक जाता है, हमारे सर्वर पर सेव नहीं होता।",
    finish: "शुरू करें",
  },

  chat: {
    placeholder: "जो मन में है वही लिखिए। पहले समझने या सजाने की ज़रूरत नहीं।",
    send: "भेजें",
    thinking: "आपकी बात पर सोच रहा हूँ",
    newChat: "नई बातचीत शुरू करें",
    demoBadge: "डेमो मोड - तैयार जवाब",
    liveBadge: "जुड़ा हुआ",
    quickTools: "जल्दी उपलब्ध साधन",
    tryOne: "आप यह कह सकते हैं",
    needPickerTitle: "इस समय आपको क्या चाहिए?",
    needChange: "मेरी ज़रूरत बदलिए",
    limitedDemo:
      "डेमो मोड चालू है: जवाब लिखे हुए ढाँचों से बन रहे हैं, असली मॉडल से नहीं। नीचे दिए शांत करने वाले साधन और सुरक्षा मार्ग पूरी तरह काम करते हैं।",
  },

  crisis: {
    title: "चलिए, अभी आपको असली सहायता दिलाएँ",
    subtitle:
      "मैं एक AI हूँ। मैं आपके साथ रह सकता/सकती हूँ, पर आपकी सुरक्षा नहीं दे सकता/सकती। फोन पर प्रशिक्षित व्यक्ति वह कर सकता है जो मैं नहीं कर सकता, और वह मुफ्त है।",
    callNow: "कॉल करने के लिए टैप कीजिए",
    checkQuestion: "क्या आप अभी तुरंत खतरे में हैं, या ऐसे किसी के साथ हैं जिससे डर लगता है?",
    checkYes: "हाँ, अभी",
    checkNo: "नहीं, अभी नहीं",
    checkYesReply:
      "तो 112 पर कॉल कीजिए या किसी ऐसी जगह जाइए जहाँ लोग हों और वहीं से कॉल कीजिए। मुझे जवाब देने से पहले यह कीजिए। मैं बाद में भी यहीं रहूँगा/रहूँगी।",
    checkNoReply:
      "बताने के लिए धन्यवाद। अगले कुछ मिनट अच्छे से इस्तेमाल करें, और एक नंबर पास रखिए अगर हालत बदले।",
    openTools: "मेरे साथ एक शांत करने वाला अभ्यास कीजिए",
    close: "बात जारी रखें",
    minorsLine: "18 से कम उम्र हैं तो चाइल्डलाइन 1098 मुफ्त है और 24x7 उपलब्ध है।",
  },

  tools: {
    title: "शांत होने के तरीके",
    subtitle: "दस मिनट से कम में असर करने वाली छोटी चीज़ें। मुफ्त, बिना किसी सामान के।",
    breathing: "बॉक्स ब्रीदिंग",
    breathingNote: "चार तक सांस लीजिए, चार रोकिए, चार छोड़िए, चार रोकिए। गोले के साथ चलिए।",
    start: "शुरू",
    stop: "रोकें",
    cycle: "राउंड",
    grounding: "5-4-3-2-1 ग्राउंडिंग",
    groundingNote: "जो अभी महसूस हो रहा है उसे नाम दीजिए, ताकि ध्यान सिर से बाहर आए।",
    see: "5 चीज़ें जो दिखती हैं",
    touch: "4 चीज़ें जो छू सकते हैं",
    hear: "3 आवाज़ें जो सुनाई देती हैं",
    smell: "2 चीज़ें जिनकी महक आती है",
    taste: "1 चीज़ जिसका स्वाद है",
    journal: "एक लाइन की डायरी",
    journalNote: "एक लाइन काफी है। इसे आपके अलावा कोई नहीं पढ़ता।",
    journalPrompt: "आज की सबसे सच्ची बात है...",
    journalSaved: "इस डिवाइस पर सेव हुआ",
    walk: "दस मिनट की सैर",
    walkNote:
      "कमरे से बाहर, फोन जेब में, स्क्रॉल नहीं। दस मिनट चलिए और लौटकर बताइए कि कुछ बदला या नहीं।",
    study: "बीस मिनट का रीसेट",
    studyNote:
      "एक टॉपिक। बीस मिनट पढ़ाई, पाँच मिनट ब्रेक। शुरू करने से पहले टॉपिक लिख लीजिए, ताकि टाइमर को फैसला न करना पड़े।",
    reset: "फिर से शुरू",
  },

  mood: {
    title: "मूड चेक-इन",
    how: "आज कैसा है?",
    terrible: "बहुत भारी",
    low: "कम",
    okay: "ठीक",
    good: "अच्छा",
    great: "अच्छा दिन",
    tags: "इसके पीछे कुछ है?",
    tagStudy: "पढ़ाई",
    tagWork: "काम",
    tagMoney: "पैसे",
    tagPeople: "लोग",
    tagBody: "नींद या शरीर",
    tagFamily: "परिवार",
    tagNothing: "कुछ खास नहीं",
    note: "कुछ लिखना चाहें तो",
    save: "चेक-इन सेव करें",
    saved: "सेव हो गया",
    trend: "पिछले दो हफ्ते",
    empty: "अभी कोई चेक-इन नहीं।",
    average: "औसत",
  },

  circle: {
    title: "सपोर्ट सर्कल",
    subtitle: "वे लोग जिन्हें आप सचमुच मैसेज कर सकते हैं। नाम इसी डिवाइस पर रहते हैं, AI तक नहीं जाते।",
    name: "नाम",
    relation: "कौन हैं",
    phone: "फोन",
    add: "व्यक्ति जोड़ें",
    remove: "हटाएँ",
    messageTitle: "भेजने लायक संदेश",
    template:
      "मैं अभी बहुत मुश्किल दौर से गुज़र रहा/रही हूँ। मैं यह नहीं कह रहा/रही कि तुम इसे ठीक करो। ज़रा देर मेरे साथ रह सकते हो, कॉल पर या यहीं?",
    copy: "संदेश कॉपी करें",
    empty:
      "अभी कोई सेव नहीं है। अभी एक व्यक्ति जोड़ लेना, खराब रात में ढूँढने से आसान है।",
  },

  privacy: {
    title: "निजता और आपका डेटा",
    subtitle: "सीधी भाषा में। कानूनी धुँध नहीं।",
    stored: "इस समय क्या सेव है",
    storedMessages: "चैट संदेश",
    storedMoods: "मूड चेक-इन",
    storedContacts: "सेव किए संपर्क",
    onDevice: "इस डिवाइस पर",
    memory: "सेशन के बीच याद रखना",
    memoryOnLabel: "चालू",
    memoryOffLabel: "बंद (कुछ सेव नहीं)",
    exportTitle: "सब कुछ निर्यात करें",
    exportBody: "पूरा डेटा JSON फ़ाइल में डाउनलोड कीजिए, रखने या कहीं ले जाने के लिए।",
    exportButton: "मेरा डेटा डाउनलोड करें",
    deleteChats: "बातचीत हटाइए",
    deleteChatsBody: "इस डिवाइस से चैट इतिहास और मूड चेक-इन हट जाएँगे। वापस नहीं आएँगे।",
    deleteChatsButton: "चैट हटाइए",
    eraseAll: "सब कुछ मिटाइए",
    eraseAllBody: "चैट, मूड, संपर्क और सेटिंग्स हट जाएँगी। वापस नहीं आएँगी।",
    eraseAllButton: "सब मिटाइए",
    confirmDelete: "पक्का करने के लिए फिर टैप कीजिए",
    limits: "जो हम वादा नहीं कर सकते",
    limitsList: [
      "हटाया गया डेटा वापस नहीं लाया जा सकता - वह सिर्फ आपके ब्राउज़र में था",
      "जवाब बनाने के लिए आपका संदेश AI प्रोवाइडर तक भेजा जाता है",
      "साझा या पारिवारिक डिवाइस पर यह इतिहास दिख सकता है, इसलिए ज़रूरत हो तो मिटा दीजिए",
      "हम आपकी सुरक्षा नहीं दे सकते। संकट में हेल्पलाइन या 112 पर कॉल कीजिए।",
    ],
  },

  safety: {
    title: "सुरक्षा, सीमाएँ और इंसानी मदद",
    subtitle:
      "यह पेज इसलिए है कि किसी को अंदाज़ा न लगाना पड़े कि यह ऐप क्या कर सकता है और क्या नहीं। इसे खराब दिन से पहले पढ़िए, खराब दिन में नहीं।",
    limitsTitle: "सीमाएँ, साफ़ शब्दों में",
    limitsBody: [
      "स्ट्रेसफ्री AI थेरेपिस्ट, मनोवैज्ञानिक, मनोचिकित्सक या डॉक्टर नहीं है, और उनकी जगह नहीं ले सकता।",
      "यह निदान नहीं करता। यह नहीं बता सकता कि आपको डिप्रेशन, एंग्ज़ाइटी या कुछ और है, और कभी नहीं बताएगा।",
      "यह दवा, डोज़ या मेडिकल रिपोर्ट पर टिप्पणी नहीं करता।",
      "यह अकेले आपकी सुरक्षा नहीं दे सकता। यह सॉफ़्टवेयर है, और सॉफ़्टवेयर इंसान नहीं होता।",
      "यह कभी नहीं कहेगा कि आप अपने लोगों की जगह इस पर निर्भर रहें। अगर कहे, तो वह बग है - हमें बताइए।",
      "मेमोरी बंद करने पर कुछ याद नहीं रहता, और जो सेव होता है वह आपके ब्राउज़र में ही रहता है।",
    ],
    howTitle: "खतरे का संकेत मिलने पर क्या होता है",
    howSteps: [
      "एक अलग सुरक्षा परत संदेशों में आत्महत्या, खुद को नुकसान, हिंसा, दुर्व्यवहार या मेडिकल आपात स्थिति के संकेत पढ़ती है। यह AI से पहले चलती है और इसे बहकाया नहीं जा सकता।",
      "खतरे की संभावना हो तो सामान्य बातचीत रुक जाती है और आपको सीधा, साफ़ जवाब और एक टैप पर हेल्पलाइन कॉल मिलता है।",
      "आपसे कुछ छिपाया नहीं जाता: मोड बदलने पर ऐप बताता है।",
      "अगर आप तुरंत खतरे में हैं और कोई पास नहीं है, तो 112 पर कॉल कीजिए।",
    ],
    helplinesTitle: "भारत में मुफ्त इंसानी मदद",
    helplinesNote: "नंबर बदलते रहते हैं। एक न लगे तो दूसरा आज़माइए, या पास किसी से साथ में कॉल करवाइए।",
    globalTitle: "भारत के बाहर",
    globalNote: "अपने देश की क्राइसिस लाइन findahelpline.com पर देखिए।",
    reportTitle: "गलत जवाब की शिकायत",
    reportBody:
      "अगर AI ने कुछ गलत, उपेक्षापूर्ण, निदान जैसा या असुरक्षित कहा हो, तो बताइए। संदेश का स्क्रीनशॉट लेकर ईमेल कीजिए, बिना वे व्यक्तिगत जानकारियाँ दिए जो आप साझा नहीं करना चाहते।",
  },

  student: {
    title: "स्टूडेंट मोड",
    subtitle:
      "परीक्षा, करियर और शिक्षकों के दबाव के लिए। यह अगले बीस मिनट आसान बनाने के लिए है, पूरी ज़िंदगी का प्लान बनाने के लिए नहीं।",
    privacyNote:
      "इस पेज की हर चीज़ इसी डिवाइस पर रहती है। कुछ भी अपलोड नहीं होता, कोई अकाउंट नहीं है, और कोई AI मॉडल नहीं बुलाया जाता।",
    planTitle: "परीक्षा का प्लान",
    planNote:
      "दिन गिन लीजिए, फिर हर ब्लॉक में प्लान से एक टॉपिक चुनिए। आप पीछे नहीं हैं - आप एक इंसान हैं जिसके पास सीमित दिन है।",
    examLabel: "परीक्षा या पेपर",
    examPlaceholder: "जैसे भौतिकी पेपर 1",
    dateLabel: "परीक्षा की तारीख",
    daysLeftMany: "दिन बाकी",
    daysLeftOne: "दिन बाकी",
    examPassed: "वह तारीख निकल गई। बदल दीजिए, या छोड़ दीजिए।",
    topicsLabel: "वे टॉपिक जिन्हें अभी छूना है",
    topicPlaceholder: "कोई एक टॉपिक जो 20 मिनट में आ जाए",
    addTopic: "जोड़ें",
    noTopics: "अभी कोई टॉपिक नहीं। सबसे छोटे से शुरू कीजिए - जिसे आप सचमुच खोल सकें।",
    startWith: "यहाँ से शुरू कीजिए",
    nothingLeft: "हर टॉपिक पर टिक लग गया। किताब बंद कीजिए और कुछ खा लीजिए।",
    clearPlan: "प्लान हटाइए",
    focusTitle: "बीस मिनट का फोकस",
    focusNote: "पहले टॉपिक लिख लीजिए, ताकि टाइमर शुरू होने से पहले फैसला हो जाए।",
    focusPlaceholder: "यह ब्लॉक सिर्फ इसी के बारे में है...",
    focusStart: "20 मिनट शुरू करें",
    focusStop: "रोकें",
    focusPhaseWork: "फोकस",
    focusPhaseBreak: "ब्रेक",
    focusBreakNote: "पाँच मिनट का ब्रेक। खड़े हो जाइए, पानी पीजिए, फीड मत खोलिए।",
    focusBlocks: "ब्लॉक पूरे",
    focusNeedTopic: "पहले एक लाइन में टॉपिक लिखिए, फिर शुरू कीजिए।",
    goalsTitle: "आज के तीन छोटे काम",
    goalsNote: "इतने छोटे कि खराब दिन में भी हो जाएँ। यह न्यूनतम है, कोई लंबी सूची नहीं।",
    goalsPlaceholder: "कोई काम जो आज पूरा हो सके",
    goalsAdd: "जोड़ें",
    goalsDone: "पूरे",
    goalsEmpty: "अभी कुछ नहीं जोड़ा। एक छोटा काम भी मायने रखता है।",
    goalsLimit: "तीन की सीमा जानबूझकर है।",
    careerTitle: "करियर का दबाव",
    careerNote:
      "यह दबाव ज़्यादातर आपके भविष्य को लेकर दूसरों का डर है, जो आपको तथ्य की तरह थमा दिया जाता है। इसे संभालने का तरीका यह है, बिना यह दिखाए कि यह मायने नहीं रखता।",
    careerItems: [
      {
        heading: "फैसले को डर से अलग कीजिए",
        body: "असली सवाल लिखिए - कौन सा कोर्स, कौन सी नौकरी - और फिर लिखिए कि उसमें सचमुच क्या अज्ञात है। घबराहट अक्सर आकार मिलते ही छोटी हो जाती है।",
      },
      {
        heading: "तुलना का जवाब दीजिए",
        body: "\"उनका लड़का तो कमाने लगा।\" आप कह सकते हैं: \"मुझे उसके लिए खुशी है। मेरा रास्ता धीमा है क्योंकि मैंने ऐसा चुना है जिसमें मैं टिक सकूँ।\" इसे एक बार ज़ोर से बोलकर देखिए, ताकि वह पल में बनाना न पड़े।",
      },
      {
        heading: "एक फैसला, सारे नहीं",
        body: "आपको बस अगला असली फैसला लेना है, अगले छह महीनों के लिए। बाकी खुले रह सकते हैं, और वह असफलता नहीं है।",
      },
    ],
    careerScriptTitle: "जो आप सचमुच कह सकते हैं",
    careerScripts: [
      "\"मुझे पता है आपको चिंता है। मैं इसे हल्के में नहीं ले रहा/रही। इस महीने मैं क्या कर रहा/रही हूँ वह दिखाता/दिखाती हूँ, फिर कुछ हफ्तों बाद बात करेंगे।\"",
      "\"मैं यह नहीं कह रहा/रही कि आप चिंता छोड़ दीजिए। मैं बस इतना कह रहा/रही हूँ कि एक बार कह दीजिए, फिर मुझे काम करने दीजिए।\"",
      "\"मुझे किसी और से तुलना करने से मैं तेज़ नहीं होता/होती। इससे बैठना और मुश्किल होता है। कृपया बंद कीजिए।\"",
    ],
    facultyTitle: "जब शिक्षक अन्याय करें या गुस्सा दिखाएँ",
    facultyNote:
      "किसी और का गुस्सा आपके हाथ में नहीं है। अगला कदम आपके हाथ में है - और ज़रा-सा काम लिखित में करने से आप सुरक्षित रहते हैं।",
    facultySteps: [
      "पूरी क्लास के सामने बहस मत कीजिए। उससे कुछ अच्छा नहीं होता। कमरा खाली होने का या कल का इंतज़ार कीजिए।",
      "जो हुआ वह उसी दिन लिख लीजिए: तारीख, क्या कहा गया, कौन मौजूद था। लिखित रिकॉर्ड से आगे के विकल्प बदल जाते हैं।",
      "लिखित में पूछिए। सुधार के बारे में छोटा, विनम्र ईमेल मौखिक अनुरोध से ज़्यादा असर करता है, और उसका रिकॉर्ड रहता है।",
      "मिलने जाना पड़े तो किसी को साथ रखिए: बाहर खड़ा कोई सहपाठी, या बाद में फोन पर माता-पिता।",
    ],
    facultyEmailTitle: "कॉपी करने लायक ईमेल",
    facultyEmail:
      "विषय: <विषय> में <टेस्ट / असाइनमेंट> के बारे में एक सवाल\n\nमाननीय सर/मैडम,\n\nमैं <नाम> हूँ, <कक्षा या सेमेस्टर> का/की छात्र/छात्रा। मैं <पिछले टेस्ट के अंक / समय-सीमा> के बारे में पूछना चाहता/चाहती था/थी। क्या आप बता सकेंगे कि सुधार के लिए मुझे क्या करना चाहिए, या कक्षा के बाद पाँच मिनट कब मिल सकते हैं?\n\nधन्यवाद,\n<नाम>",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    heavyTitle: "अगर परेशानी किसी विषय की नहीं, किसी इंसान की है",
    heavyBody:
      "रैगिंग, उत्पीड़न, धमकी, या कोई शिक्षक जो अपनी ताकत का इस्तेमाल आपके साथ यौन रूप से करे - यह पढ़ाई का सवाल नहीं है, और इसका जवाब कोई स्क्रिप्ट नहीं है। यह आपकी गलती नहीं है। किसी भरोसेमंद इंसान को बताइए, और हेल्पलाइन पर कॉल कीजिए - ये ठीक इसी के लिए हैं।",
    heavyHelplines: "भारत में मुफ्त, 24x7",
    heavyChat: "मेरे साथ इस पर बात कीजिए",
    heavySafety: "सुरक्षा पेज पढ़िए",
  },
};

const gu: Dict = {
  appName: "સ્ટ્રેસફ્રી AI",
  tagline: "ભારે દિવસોનો સાથી. થેરાપિસ્ટ નહીં, અને એ છુપાવતું નથી.",
  promiseTitle: "અટકો, જે અનુભવો છો તે સમજો, એક નાનું પગલું ભરો.",
  promiseBody:
    "સ્ટ્રેસફ્રી AI સાંભળે છે, તમારી વાતને નામ આપવામાં મદદ કરે છે, આગળની દસ મિનિટમાં કરી શકાય તેવું એક કામ કહે છે, અને જરૂર પડે ત્યારે સાચી માનવીય મદદ સુધી પહોંચાડે છે.",

  nav: { chat: "વાત કરો", tools: "શાંત થવાની રીતો", student: "સ્ટુડન્ટ મોડ", safety: "સલામતી", privacy: "ગોપનીયતા" },

  common: {
    back: "પાછળ",
    next: "આગળ",
    start: "વાત શરૂ કરો",
    cancel: "રદ કરો",
    save: "સેવ",
    close: "બંધ",
    copy: "કૉપી",
    copied: "કૉપી થયું",
    delete: "કાઢી નાખો",
    optional: "વૈકલ્પિક",
  },

  onboarding: {
    welcome: "શરૂ કરતાં પહેલાં",
    intro:
      "ત્રણ નાના પ્રશ્નો, પછી તમે વાત કરી શકો. જવાબ ક્યારેય બદલી શકાય છે અને બધું ક્યારેય ભૂંસી શકાય છે.",
    whatItIs: "આ શું છે",
    whatItIsList: [
      "રાત્રે બે વાગ્યે પણ ન્યાય કર્યા વગર સાંભળતો સાથી",
      "દસ મિનિટમાં કામ લાગે તેવી રીતો: શ્વાસ, ગ્રાઉન્ડિંગ, એક નાનું કામ",
      "ગંભીર સ્થિતિમાં મફત માનવીય મદદ સુધીનો રસ્તો",
    ],
    whatItIsNot: "આ શું નથી",
    whatItIsNotList: [
      "થેરાપિસ્ટ, ડૉક્ટર કે કાઉન્સેલર નથી",
      "કોઈ નિદાન કરી શકતું નથી, દવા અંગે સલાહ આપી શકતું નથી",
      "મેમરી બંધ હોય તો કંઈ યાદ રાખતું નથી",
      "આ એક AI છે, માણસ નહીં. પૂછશો તો સાફ કહેશે",
    ],
    ageQuestion: "તમારી ઉંમર લગભગ કેટલી છે? એથી ફક્ત વાત કરવાની રીત બદલાય છે.",
    ageTeen: "18થી ઓછી",
    ageYoung: "18 થી 25",
    ageAdult: "26 થી 45",
    ageOlder: "45થી વધુ",
    minorNotice:
      "18થી ઓછી ઉંમર: સેશન વચ્ચે કંઈ સેવ થતું નથી, અને અમે તમને હંમેશા વિશ્વાસપાત્ર મોટી વ્યક્તિ કે ચાઈલ્ડલાઈન 1098 તરફ મોકલીશું. વાલીને આની બહાર રાખવાની જરૂર નથી.",
    languageQuestion: "કઈ ભાષામાં સહજ લાગે છે?",
    needQuestion: "મારી સાથે વાત કરતી વખતે સામાન્ય રીતે તમે શું ઇચ્છો છો?",
    needVent: "ફક્ત કોઈ સાંભળે",
    needCalm: "શાંત થવામાં મદદ",
    needSolve: "કોઈ સમસ્યાનો ઉકેલ",
    needPlan: "પ્લાન બનાવવામાં મદદ",
    needDistract: "ધ્યાન ફેરવે તેવું કંઈક",
    needHuman: "માણસ સાથે વાત",
    consentLabel:
      "હું સમજું છું કે આ એક AI સાથી છે, થેરાપિસ્ટ નહીં, અને એકલું મારી સલામતીની જવાબદારી લઈ શકતું નથી.",
    consentRequired: "આગળ વધવા ઉપરનું બોક્સ ટિક કરો.",
    memoryQuestion: "આ ડિવાઇસ પર મારી વાત યાદ રાખવી?",
    memoryOn: "હા, અહીં રાખો",
    memoryOff: "ના, કંઈ ન રાખો",
    memoryNote:
      "વાત આ બ્રાઉઝરમાં જ રહે છે. જવાબ બનાવવા તમારા વર્તમાન સંદેશનું ટેક્સ્ટ AI મોડેલ સુધી જાય છે, અમારા સર્વર પર સેવ થતું નથી.",
    finish: "શરૂ કરો",
  },

  chat: {
    placeholder: "મનમાં જે છે તે લખો. પહેલા સમજવું કે સજાવવું જરૂરી નથી.",
    send: "મોકલો",
    thinking: "તમે કહ્યું તેના વિશે વિચારું છું",
    newChat: "નવી વાત શરૂ કરો",
    demoBadge: "ડેમો મોડ - તૈયાર જવાબ",
    liveBadge: "જોડાયેલું",
    quickTools: "ઝડપી સાધનો",
    tryOne: "તમે આ કહી શકો",
    needPickerTitle: "અત્યારે તમને શું જોઈએ?",
    needChange: "મારી જરૂરિયાત બદલો",
    limitedDemo:
      "ડેમો મોડ ચાલુ છે: જવાબ લખેલા નમૂનાઓથી બને છે, સાચા મોડેલથી નહીં. નીચેનાં શાંત કરવાનાં સાધનો અને સલામતી માર્ગ પૂરેપૂરા કામ કરે છે.",
  },

  crisis: {
    title: "ચાલો, હમણાં તમને સાચી મદદ મળે",
    subtitle:
      "હું એક AI છું. હું તમારી સાથે રહી શકું, પણ સલામતી આપી શકતો/શકતી નથી. ફોન પરનો તાલીમબદ્ધ માણસ એ કરી શકે જે હું ન કરી શકું, અને તે મફત છે.",
    callNow: "કૉલ કરવા ટૅપ કરો",
    checkQuestion: "તમે અત્યારે તાત્કાલિક જોખમમાં છો, અથવા ડર લાગે તેવા કોઈની સાથે છો?",
    checkYes: "હા, હમણાં",
    checkNo: "ના, હમણાં નહીં",
    checkYesReply:
      "તો 112 પર કૉલ કરો કે બીજા લોકો હોય તેવી જગ્યાએ જઈને ત્યાંથી કૉલ કરો. મને જવાબ આપતા પહેલાં આ કરો. હું પછી પણ અહીં જ હોઈશ.",
    checkNoReply:
      "કહેવા માટે આભાર. આગળની કેટલીક મિનિટ સારી રીતે વાપરીએ, અને એક નંબર હાથવગો રાખો.",
    openTools: "મારી સાથે એક શાંત કરવાનો અભ્યાસ કરો",
    close: "વાત ચાલુ રાખો",
    minorsLine: "18થી ઓછી ઉંમર હોય તો ચાઈલ્ડલાઈન 1098 મફત છે અને 24x7 ઉપલબ્ધ છે.",
  },

  tools: {
    title: "શાંત થવાની રીતો",
    subtitle: "દસ મિનિટથી ઓછામાં કામ લાગે તેવી નાની વાતો. મફત, કોઈ સાધન વગર.",
    breathing: "બોક્સ શ્વાસ",
    breathingNote: "ચાર સુધી શ્વાસ લો, ચાર રોકો, ચાર છોડો, ચાર રોકો. વર્તુળ સાથે ચાલો.",
    start: "શરૂ",
    stop: "બંધ",
    cycle: "રાઉન્ડ",
    grounding: "5-4-3-2-1 ગ્રાઉન્ડિંગ",
    groundingNote: "અત્યારે જે અનુભવો છો તેને નામ આપો, જેથી ધ્યાન માથામાંથી બહાર આવે.",
    see: "5 વસ્તુ જે દેખાય છે",
    touch: "4 વસ્તુ જે અડકી શકાય છે",
    hear: "3 અવાજ જે સંભળાય છે",
    smell: "2 વસ્તુ જેની સુગંધ આવે છે",
    taste: "1 વસ્તુ જેનો સ્વાદ છે",
    journal: "એક લાઈનની ડાયરી",
    journalNote: "એક લાઈન પૂરતી છે. તમારા સિવાય કોઈ વાંચતું નથી.",
    journalPrompt: "આજની સાચી વાત છે...",
    journalSaved: "આ ડિવાઇસ પર સેવ થયું",
    walk: "દસ મિનિટની ચાલ",
    walkNote:
      "રૂમની બહાર, ફોન ખિસ્સામાં, સ્ક્રોલ નહીં. દસ મિનિટ ચાલો અને પાછા આવીને કહો કે કંઈ બદલાયું કે નહીં.",
    study: "વીસ મિનિટનું રીસેટ",
    studyNote:
      "એક વિષય. વીસ મિનિટ ભણવું, પાંચ મિનિટ વિરામ. શરૂ કરતાં પહેલાં વિષય લખો, જેથી ટાઈમરે નિર્ણય ન લેવો પડે.",
    reset: "ફરી શરૂ કરો",
  },

  mood: {
    title: "મૂડ ચેક-ઇન",
    how: "આજે કેવું છે?",
    terrible: "ખૂબ ભારે",
    low: "ઓછું",
    okay: "ઠીક",
    good: "સારું",
    great: "સારો દિવસ",
    tags: "પાછળ કંઈ છે?",
    tagStudy: "ભણતર",
    tagWork: "કામ",
    tagMoney: "પૈસા",
    tagPeople: "લોકો",
    tagBody: "નીંદ કે શરીર",
    tagFamily: "પરિવાર",
    tagNothing: "કંઈ ખાસ નહીં",
    note: "કંઈ લખવું હોય તો",
    save: "ચેક-ઇન સેવ કરો",
    saved: "સેવ થયું",
    trend: "છેલ્લા બે અઠવાડિયા",
    empty: "હજી કોઈ ચેક-ઇન નથી.",
    average: "સરેરાશ",
  },

  circle: {
    title: "સપોર્ટ સર્કલ",
    subtitle: "તમે ખરેખર સંદેશ મોકલી શકો તેવા લોકો. નામ આ ડિવાઇસ પર જ રહે છે, AI સુધી જતા નથી.",
    name: "નામ",
    relation: "કોણ છે",
    phone: "ફોન",
    add: "વ્યક્તિ ઉમેરો",
    remove: "કાઢો",
    messageTitle: "મોકલી શકાય તેવો સંદેશ",
    template:
      "હું અત્યારે ખૂબ અઘરા સમયમાંથી પસાર થઈ રહ્યો/રહી છું. હું કહેતો/કહેતી નથી કે તું આ ઠીક કર. થોડી વાર મારી સાથે રહી શકે, કૉલ પર કે અહીં?",
    copy: "સંદેશ કૉપી કરો",
    empty: "હજી કોઈ સેવ નથી. અત્યારે એક વ્યક્તિ ઉમેરવી, ખરાબ રાત્રિએ શોધવા કરતાં સહેલી છે.",
  },

  privacy: {
    title: "ગોપનીયતા અને તમારો ડેટા",
    subtitle: "સીધી ભાષામાં. કાનૂની ધુમ્મસ નહીં.",
    stored: "અત્યારે શું સેવ છે",
    storedMessages: "ચેટ સંદેશ",
    storedMoods: "મૂડ ચેક-ઇન",
    storedContacts: "સેવ કરેલા સંપર્ક",
    onDevice: "આ ડિવાઇસ પર",
    memory: "સેશન વચ્ચે યાદ રાખવું",
    memoryOnLabel: "ચાલુ",
    memoryOffLabel: "બંધ (કંઈ સેવ નહીં)",
    exportTitle: "બધું એક્સપોર્ટ કરો",
    exportBody: "આખો ડેટા JSON ફાઇલમાં ડાઉનલોડ કરો, રાખવા કે બીજે લઈ જવા.",
    exportButton: "મારો ડેટા ડાઉનલોડ કરો",
    deleteChats: "વાત કાઢી નાખો",
    deleteChatsBody: "આ ડિવાઇસ પરથી ચેટ ઇતિહાસ અને મૂડ ચેક-ઇન જતા રહેશે. પાછા નહીં આવે.",
    deleteChatsButton: "ચેટ કાઢો",
    eraseAll: "બધું ભૂંસો",
    eraseAllBody: "ચેટ, મૂડ, સંપર્ક અને સેટિંગ્સ જતા રહેશે. પાછા નહીં આવે.",
    eraseAllButton: "બધું ભૂંસો",
    confirmDelete: "ખાતરી માટે ફરી ટૅપ કરો",
    limits: "જેનું વચન આપી શકતા નથી",
    limitsList: [
      "કાઢેલો ડેટા પાછો લાવી શકાતો નથી - તે ફક્ત તમારા બ્રાઉઝરમાં હતો",
      "જવાબ બનાવવા તમારો સંદેશ AI પ્રોવાઇડર સુધી મોકલાય છે",
      "શેર કે પારિવારિક ડિવાઇસ પર આ ઇતિહાસ દેખાઈ શકે, જરૂર હોય તો ભૂંસી નાખો",
      "અમે તમારી સલામતી આપી શકતા નથી. જોખમમાં હેલ્પલાઈન કે 112 પર કૉલ કરો.",
    ],
  },

  safety: {
    title: "સલામતી, મર્યાદા અને માનવીય મદદ",
    subtitle:
      "આ પેજ એટલા માટે છે કે કોઈને અંદાજ ન લગાવવો પડે કે આ એપ શું કરી શકે છે અને શું નહીં. ખરાબ દિવસ પહેલાં વાંચો, ખરાબ દિવસમાં નહીં.",
    limitsTitle: "મર્યાદા, સાફ શબ્દોમાં",
    limitsBody: [
      "સ્ટ્રેસફ્રી AI થેરાપિસ્ટ, મનોવૈજ્ઞાનિક, મનોચિકિત્સક કે ડૉક્ટર નથી, અને તેમની જગ્યા લઈ શકતું નથી.",
      "તે નિદાન કરતું નથી. તમને ડિપ્રેશન, ચિંતા કે બીજું કંઈ છે કે નહીં તે કહી શકતું નથી, અને ક્યારેય નહીં કહે.",
      "તે દવા, ડોઝ કે મેડિકલ રિપોર્ટ પર ટિપ્પણી કરતું નથી.",
      "તે એકલું તમારી સલામતી આપી શકતું નથી. તે સોફ્ટવેર છે, અને સોફ્ટવેર માણસ નથી.",
      "તે ક્યારેય નહીં કહે કે તમારા લોકોની જગ્યાએ તેના પર આધાર રાખો. કહે તો તે બગ છે - અમને જણાવો.",
      "મેમરી બંધ કરો તો કંઈ યાદ રહેતું નથી, અને જે સેવ થાય તે તમારા બ્રાઉઝરમાં જ રહે છે.",
    ],
    howTitle: "જોખમ દેખાય ત્યારે શું થાય છે",
    howSteps: [
      "એક અલગ સલામતી સ્તર સંદેશોમાં આત્મહત્યા, પોતાને નુકસાન, હિંસા, દુર્વ્યવહાર કે મેડિકલ ઈમરજન્સીનાં સંકેત વાંચે છે. તે AI પહેલાં ચાલે છે અને તેને ફોસલાવી શકાતું નથી.",
      "જોખમની શક્યતા હોય તો સામાન્ય વાત અટકે છે અને તમને સીધો, સરળ જવાબ અને એક ટૅપે હેલ્પલાઈન કૉલ મળે છે.",
      "તમારાથી કંઈ છુપાવાતું નથી: મોડ બદલાય ત્યારે એપ જણાવે છે.",
      "તમે તાત્કાલિક જોખમમાં હોવ અને કોઈ નજીક ન હોય, તો 112 પર કૉલ કરો.",
    ],
    helplinesTitle: "ભારતમાં મફત માનવીય મદદ",
    helplinesNote: "નંબર બદલાતા રહે છે. એક ન લાગે તો બીજો પ્રયત્ન કરો, અથવા નજીકના કોઈને સાથે કૉલ કરાવો.",
    globalTitle: "ભારતની બહાર",
    globalNote: "તમારા દેશની ક્રાઈસિસ લાઈન findahelpline.com પર જુઓ.",
    reportTitle: "હાનિકારક જવાબની ફરિયાદ",
    reportBody:
      "AI એ કંઈ ખોટું, ઉપેક્ષાભર્યું, નિદાન જેવું કે અસુરક્ષિત કહ્યું હોય તો જણાવો. સંદેશનો સ્ક્રીનશોટ લઈને ઈમેલ કરો, તમે શેર ન કરવા માંગતા હો તે માહિતી વગર.",
  },

  student: {
    title: "સ્ટુડન્ટ મોડ",
    subtitle:
      "પરીક્ષા, કરિયર અને શિક્ષકોના દબાણ માટે. આ આગળની વીસ મિનિટ સહેલી કરવા માટે છે, આખું જીવન ગોઠવવા માટે નહીં.",
    privacyNote:
      "આ પેજની દરેક વસ્તુ આ ડિવાઇસ પર જ રહે છે. કંઈ પણ અપલોડ થતું નથી, કોઈ એકાઉન્ટ નથી, અને કોઈ AI મોડેલ બોલાવાતું નથી.",
    planTitle: "પરીક્ષાનો પ્લાન",
    planNote:
      "દિવસ ગણી લો, પછી દરેક બ્લોકમાં પ્લાનમાંથી એક વિષય પસંદ કરો. તમે પાછળ નથી - તમે એક માણસ છો જેની પાસે મર્યાદિત દિવસ છે.",
    examLabel: "પરીક્ષા કે પેપર",
    examPlaceholder: "જેમ કે ભૌતિકવિજ્ઞાન પેપર 1",
    dateLabel: "પરીક્ષાની તારીખ",
    daysLeftMany: "દિવસ બાકી",
    daysLeftOne: "દિવસ બાકી",
    examPassed: "એ તારીખ નીકળી ગઈ. બદલો, અથવા જવા દો.",
    topicsLabel: "જે વિષયો હજી અડવાના છે",
    topicPlaceholder: "એક વિષય જે 20 મિનિટમાં આવી જાય",
    addTopic: "ઉમેરો",
    noTopics: "હજી કોઈ વિષય નથી. સૌથી નાનાથી શરૂ કરો - જે તમે ખરેખર ખોલી શકો.",
    startWith: "અહીંથી શરૂ કરો",
    nothingLeft: "દરેક વિષય પર ટિક થઈ ગઈ. પુસ્તક બંધ કરો અને જઈને કંઈ ખાઓ.",
    clearPlan: "પ્લાન કાઢી નાખો",
    focusTitle: "વીસ મિનિટનું ફોકસ",
    focusNote: "પહેલા વિષય લખી લો, જેથી ટાઈમર શરૂ થાય તે પહેલાં નિર્ણય થઈ જાય.",
    focusPlaceholder: "આ બ્લોક ફક્ત આના વિશે છે...",
    focusStart: "20 મિનિટ શરૂ કરો",
    focusStop: "બંધ કરો",
    focusPhaseWork: "ફોકસ",
    focusPhaseBreak: "વિરામ",
    focusBreakNote: "પાંચ મિનિટનો વિરામ. ઊભા થાઓ, પાણી પીઓ, ફીડ ન ખોલો.",
    focusBlocks: "બ્લોક પૂરા",
    focusNeedTopic: "પહેલા એક લાઈનમાં વિષય લખો, પછી શરૂ કરો.",
    goalsTitle: "આજના ત્રણ નાના કામ",
    goalsNote: "એટલા નાના કે ખરાબ દિવસે પણ થઈ જાય. આ ન્યૂનતમ છે, લાંબી યાદી નહીં.",
    goalsPlaceholder: "એક કામ જે આજે પૂરું થઈ શકે",
    goalsAdd: "ઉમેરો",
    goalsDone: "પૂરા",
    goalsEmpty: "હજી કંઈ ઉમેર્યું નથી. એક નાનું કામ પણ મહત્વનું છે.",
    goalsLimit: "ત્રણની મર્યાદા જાણી જોઈને છે.",
    careerTitle: "કરિયરનું દબાણ",
    careerNote:
      "આ દબાણ મોટે ભાગે તમારા ભવિષ્ય વિશે બીજાનો ડર છે, જે તમને હકીકત તરીકે પકડાવી દેવાય છે. એને સંભાળવાની રીત આ છે, એવું દર્શાવ્યા વગર કે એ મહત્વનું નથી.",
    careerItems: [
      {
        heading: "નિર્ણયને ડરથી અલગ કરો",
        body: "સાચો સવાલ લખો - કયો કોર્સ, કઈ નોકરી - અને પછી લખો કે એમાં ખરેખર શું અજાણ છે. ગભરાટને આકાર મળે એટલે સામાન્ય રીતે નાનો થઈ જાય છે.",
      },
      {
        heading: "તુલનાનો જવાબ આપો",
        body: "\"એમનો દીકરો તો કમાવા લાગ્યો.\" તમે કહી શકો: \"મને એના માટે આનંદ છે. મારો રસ્તો ધીમો છે કારણ કે મેં એવો પસંદ કર્યો જેમાં હું ટકી શકું.\" એક વાર મોટેથી બોલી જુઓ, જેથી એ ક્ષણે બનાવવો ન પડે.",
      },
      {
        heading: "એક નિર્ણય, બધા નહીં",
        body: "તમારે ફક્ત આગળનો સાચો નિર્ણય લેવાનો છે, આગળના છ મહિના માટે. બાકી ખુલ્લું રહી શકે, અને એ નિષ્ફળતા નથી.",
      },
    ],
    careerScriptTitle: "તમે ખરેખર શું કહી શકો",
    careerScripts: [
      "\"મને ખબર છે તમને ચિંતા છે. હું આને હળવાશથી લેતો/લેતી નથી. આ મહિને હું શું કરું છું તે બતાવું, પછી થોડા અઠવાડિયે વાત કરીએ.\"",
      "\"હું એમ નથી કહેતો/કહેતી કે તમે ચિંતા છોડી દો. હું ફક્ત એટલું કહું છું કે એક વાર કહી દો, પછી મને કામ કરવા દો.\"",
      "\"મને કોઈની સાથે સરખાવવાથી હું ઝડપી થતો/થતી નથી. એથી બેસવું વધારે અઘરું થાય છે. કૃપા કરીને બંધ કરો.\"",
    ],
    facultyTitle: "જ્યારે શિક્ષક અન્યાય કરે કે ગુસ્સે થાય",
    facultyNote:
      "બીજાનો ગુસ્સો તમારા હાથમાં નથી. આગળનું પગલું તમારા હાથમાં છે - અને થોડું કામ લખિતમાં કરવાથી તમે સુરક્ષિત રહો છો.",
    facultySteps: [
      "આખા વર્ગ સામે દલીલ ન કરો. એનાથી સારું કંઈ થતું નથી. રૂમ ખાલી થાય ત્યાં સુધી કે આવતીકાલ સુધી રાહ જુઓ.",
      "જે થયું તે એ જ દિવસે લખી લો: તારીખ, શું કહેવાયું, કોણ હાજર હતું. લખિત નોંધ આગળના વિકલ્પો બદલી નાખે છે.",
      "લખિતમાં પૂછો. સુધારણા અંગેનો નાનો, નમ્ર ઈમેલ મૌખિક વિનંતીથી વધારે અસર કરે છે, અને તેનો રેકોર્ડ રહે છે.",
      "મળવા જવું પડે તો કોઈને સાથે રાખો: બહાર ઊભો સહપાઠી, કે પછી ફોન પર વાલી.",
    ],
    facultyEmailTitle: "કૉપી કરી શકાય તેવો ઈમેલ",
    facultyEmail:
      "વિષય: <વિષય>માં <ટેસ્ટ / સોંપણી> અંગે એક સવાલ\n\nઆદરણીય સર/મેડમ,\n\nહું <નામ> છું, <વર્ગ કે સેમેસ્ટર>નો/ની વિદ્યાર્થી/વિદ્યાર્થિની. હું <છેલ્લા ટેસ્ટના ગુણ / સમયમર્યાદા> અંગે પૂછવા માંગતો/માંગતી હતો/હતી. સુધારણા માટે મારે શું કરવું જોઈએ, અથવા વર્ગ પછી પાંચ મિનિટ ક્યારે મળી શકે, તે કૃપા કરીને જણાવશો?\n\nઆભાર,\n<નામ>",
    copy: "કૉપી",
    copied: "કૉપી થયું",
    heavyTitle: "જો તકલીફ કોઈ વિષયની નહીં, કોઈ માણસની હોય",
    heavyBody:
      "રેગિંગ, ઉત્પીડન, ધમકી, અથવા કોઈ શિક્ષક જે પોતાની શક્તિનો ઉપયોગ તમારી સાથે જાતીય રીતે કરે - આ ભણતરનો સવાલ નથી, અને એનો જવાબ કોઈ સ્ક્રિપ્ટ નથી. આ તમારી ભૂલ નથી. વિશ્વાસપાત્ર કોઈને કહો, અને હેલ્પલાઈન પર કૉલ કરો - આ બરાબર એના માટે જ છે.",
    heavyHelplines: "ભારતમાં મફત, 24x7",
    heavyChat: "મારી સાથે આની વાત કરો",
    heavySafety: "સલામતી પેજ વાંચો",
  },
};

export const DICTS: Record<Language, Dict> = { en, hi, gu };

export function t(language: Language): Dict {
  return DICTS[language] ?? DICTS.en;
}
