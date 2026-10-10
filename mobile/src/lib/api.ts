import { API_BASE } from "@/lib/config";
import type { ChatResponse, ChatTurn, Language, Need } from "@/lib/types";

export interface SendArgs {
  message: string;
  language: Language;
  need: Need | null;
  history: ChatTurn[];
  memoryEnabled: boolean;
  isMinor: boolean;
}

export type SendResult =
  | { ok: true; data: ChatResponse }
  | { ok: false; kind: "rate" | "network" | "server"; message?: string };

/**
 * Posts one turn to the server. The reply is generated there, after the
 * deterministic safety layer has run, so this client can never be the thing that
 * decides whether a message is a crisis.
 */
export async function sendMessage(args: SendArgs): Promise<SendResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: args.message,
        language: args.language,
        need: args.need,
        ageBand: args.isMinor ? "teen" : null,
        isMinor: args.isMinor,
        memoryEnabled: args.memoryEnabled,
        selfNotes: [],
        moodScore: null,
        history: args.history.slice(-8),
      }),
    });
  } catch {
    return { ok: false, kind: "network" };
  }

  if (response.status === 429) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    return { ok: false, kind: "rate", message: data?.message };
  }

  if (!response.ok) return { ok: false, kind: "server" };

  const data = (await response.json()) as ChatResponse;
  return { ok: true, data };
}
