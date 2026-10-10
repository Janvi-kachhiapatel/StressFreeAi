import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChatTurn } from "@/lib/types";

/**
 * Device-local persistence.
 *
 * Same posture as the web app: content lives on the device, and the only thing
 * that travels is the current message plus a few turns sent to the server to
 * generate a reply. When memory is off, nothing is written.
 */
export const StorageKeys = {
  profile: "stressfree.profile.v1",
  messages: "stressfree.messages.v1",
  resources: "stressfree.resources.v1",
} as const;

const MAX_STORED_TURNS = 200;

export async function loadMessages(): Promise<ChatTurn[]> {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.messages);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (turn): turn is ChatTurn =>
        Boolean(turn) &&
        typeof turn === "object" &&
        ((turn as ChatTurn).role === "user" || (turn as ChatTurn).role === "assistant") &&
        typeof (turn as ChatTurn).content === "string",
    );
  } catch {
    return [];
  }
}

export async function saveMessages(turns: ChatTurn[], memoryEnabled: boolean): Promise<void> {
  if (!memoryEnabled) return;
  try {
    await AsyncStorage.setItem(StorageKeys.messages, JSON.stringify(turns.slice(-MAX_STORED_TURNS)));
  } catch {
    // Storage full or unavailable: the chat keeps working in memory.
  }
}

export async function clearMessages(): Promise<void> {
  await AsyncStorage.removeItem(StorageKeys.messages).catch(() => undefined);
}

/** Wipes everything this app stored on the device. */
export async function eraseAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(StorageKeys)).catch(() => undefined);
}
