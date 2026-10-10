import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "@/lib/config";
import { StorageKeys } from "@/lib/storage";
import type { Helpline } from "@/lib/types";

/**
 * Helplines come from the server (GET /api/resources), so the mobile app and the
 * web app can never disagree about a number. The result is cached, and if there
 * is no network at all we fall back to the three numbers that must always work.
 *
 * That fallback is intentionally tiny. A stale list of fourteen numbers is a
 * liability; three numbers that are burned into a screen are not.
 */

const CACHE_KEY = StorageKeys.resources;

export const EMERGENCY_FALLBACK: Helpline[] = [
  {
    id: "tele-manas",
    name: "Tele-MANAS (Government of India)",
    numbers: [
      { display: "14416", dial: "14416" },
      { display: "1800-891-4416", dial: "18008914416" },
    ],
    hours: "24x7",
    languages: "Multiple Indian languages",
    who: "Anyone in India, free support and referral",
    region: "IN",
    official: true,
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
  },
];

export type ResourceSource = "server" | "cache" | "offline";

export interface ResourceResult {
  helplines: Helpline[];
  source: ResourceSource;
}

export async function loadHelplines(): Promise<ResourceResult> {
  try {
    const response = await fetch(`${API_BASE}/api/resources`);
    if (response.ok) {
      const data = (await response.json()) as { helplines?: Helpline[] };
      if (Array.isArray(data.helplines) && data.helplines.length > 0) {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data.helplines)).catch(() => undefined);
        return { helplines: data.helplines, source: "server" };
      }
    }
  } catch {
    // Offline, or the server is down: fall through to the cache.
  }

  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { helplines: parsed as Helpline[], source: "cache" };
      }
    }
  } catch {
    // Corrupt cache: fall through to the fallback.
  }

  return { helplines: EMERGENCY_FALLBACK, source: "offline" };
}

/** Maps the ids the server returns onto the loaded helpline objects. */
export function helplinesForIds(ids: string[], all: Helpline[]): Helpline[] {
  if (ids.length === 0) return [];
  const byId = new Map(all.map((line) => [line.id, line]));
  const found = ids.map((id) => byId.get(id)).filter((line): line is Helpline => Boolean(line));
  return found.length > 0 ? found : all.slice(0, 3);
}
