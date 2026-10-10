/**
 * Verified help lines. These are the only escalation targets the product ships
 * with, so keep them accurate: re-check every number before each release and
 * remove anything you cannot verify.
 *
 * `verifiedAgainst` records where the number was last confirmed. Numbers change.
 */

export interface Helpline {
  id: string;
  name: string;
  numbers: { display: string; dial: string }[];
  hours: string;
  languages: string;
  who: string;
  url?: string;
  region: "IN" | "GLOBAL";
  /** Government-run services are the safest default to route to. */
  official: boolean;
  /** Where the number was last confirmed. */
  verifiedAgainst: string;
  /** Shown in the UI for numbers that are known to be volatile. */
  note?: string;
}

export const HELPLINES: Helpline[] = [
  {
    id: "tele-manas",
    name: "Tele-MANAS (Government of India)",
    numbers: [
      { display: "14416", dial: "14416" },
      { display: "1800-891-4416", dial: "18008914416" },
    ],
    hours: "24x7",
    languages: "Multiple Indian languages",
    who: "Anyone in India, free, confidential phone support and referral",
    url: "https://dghs.mohfw.gov.in/national-mental-health-programme.php",
    region: "IN",
    official: true,
    verifiedAgainst: "Ministry of Health & Family Welfare / DGHS National Mental Health Programme",
  },
  {
    id: "kiran",
    name: "KIRAN Mental Health Helpline",
    numbers: [{ display: "1800-599-0019", dial: "18005990019" }],
    hours: "24x7",
    languages: "13 languages",
    who: "Anyone in India, free counselling and support",
    region: "IN",
    official: true,
    verifiedAgainst: "Ministry of Social Justice & Empowerment helpline",
  },
  {
    id: "emergency-112",
    name: "Emergency services (all of India)",
    numbers: [{ display: "112", dial: "112" }],
    hours: "24x7",
    languages: "Local languages",
    who: "Immediate danger, medical emergency, police, ambulance",
    region: "IN",
    official: true,
    verifiedAgainst: "National emergency number",
  },
  {
    id: "childline-1098",
    name: "Childline India",
    numbers: [{ display: "1098", dial: "1098" }],
    hours: "24x7",
    languages: "Multiple Indian languages",
    who: "Anyone under 18 in distress, abuse or fear",
    region: "IN",
    official: true,
    verifiedAgainst: "Childline India Foundation / national child helpline",
  },
  {
    id: "women-181",
    name: "Women Helpline (Abhayam)",
    numbers: [{ display: "181", dial: "181" }],
    hours: "24x7",
    languages: "Local languages",
    who: "Women facing violence, threats or abuse in India",
    region: "IN",
    official: true,
    verifiedAgainst: "National women helpline (state-run in most states)",
  },
  {
    id: "cyber-1930",
    name: "National Cyber Crime Helpline",
    numbers: [{ display: "1930", dial: "1930" }],
    hours: "24x7",
    languages: "Multiple Indian languages",
    who: "Sextortion, blackmail, leaked photos, online financial fraud",
    url: "https://cybercrime.gov.in",
    region: "IN",
    official: true,
    verifiedAgainst: "Ministry of Home Affairs / cybercrime.gov.in",
  },
  {
    id: "aasra",
    name: "AASRA (NGO, Mumbai)",
    numbers: [{ display: "+91-98204-66726", dial: "+919820466726" }],
    hours: "24x7",
    languages: "English, Hindi, Marathi",
    who: "Emotional support and suicide prevention in India",
    region: "IN",
    official: false,
    verifiedAgainst: "organisation's published helpline",
    note: "NGO-run; reconnect before launch to confirm it is still active.",
  },
  {
    id: "vandrevala",
    name: "Vandrevala Foundation",
    numbers: [
      { display: "1860-2662-345", dial: "18602662345" },
      { display: "+91-99996-66555", dial: "+919999666555" },
    ],
    hours: "24x7",
    languages: "English, Hindi, Gujarati, Marathi (limited)",
    who: "Free counselling and crisis support in India",
    region: "IN",
    official: false,
    verifiedAgainst: "foundation's published helpline",
    note: "NGO-run; reconnect before launch to confirm it is still active.",
  },
  {
    id: "find-a-helpline",
    name: "Find a helpline (international)",
    numbers: [],
    hours: "Always available (web)",
    languages: "200+ countries",
    who: "Anyone outside India who needs a local crisis line",
    url: "https://findahelpline.com",
    region: "GLOBAL",
    official: false,
    verifiedAgainst: "findahelpline.com directory",
  },
];

export function helplineById(id: string): Helpline | undefined {
  return HELPLINES.find((line) => line.id === id);
}

/** Resource sets used by the different risk paths. */
export const CRISIS_RESOURCE_IDS = ["tele-manas", "kiran", "emergency-112", "find-a-helpline"];

export function resourceIdsFor(opts: {
  isMinor: boolean;
  kinds: string[];
  wantsHuman: boolean;
}): string[] {
  const ids = new Set<string>(["tele-manas", "kiran"]);
  if (opts.isMinor) {
    ids.add("childline-1098");
    ids.delete("tele-manas");
  }
  if (opts.kinds.includes("abuse")) ids.add("women-181");
  if (opts.kinds.includes("exploitation")) ids.add("cyber-1930");
  if (opts.kinds.includes("medical-emergency")) ids.add("emergency-112");
  if (opts.kinds.includes("suicide") || opts.kinds.includes("self-harm")) {
    ids.add("emergency-112");
  }
  ids.add("find-a-helpline");
  return [...ids];
}
