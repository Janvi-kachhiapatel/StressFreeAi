import { runTurn } from "@/lib/ai/engine";
import { checkRateLimit, clientKey } from "@/lib/rateLimit";
import type { AgeBand, ChatRequest, Language, Need } from "@/lib/types";

const LANGUAGES: Language[] = ["en", "hi", "gu"];
const NEEDS: Need[] = ["vent", "calm", "solve", "plan", "distract", "human"];
const AGE_BANDS: AgeBand[] = ["teen", "young", "adult", "older"];
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_TURNS = 20;

function bad(reason: string, status = 400) {
  return Response.json({ error: reason }, { status });
}

export async function POST(request: Request) {
  const limit = await checkRateLimit(clientKey(request));
  if (!limit.allowed) {
    return Response.json(
      {
        error: "rate-limited",
        message: "You're sending messages very quickly. Take one slow breath, then try again in a moment.",
      },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad("invalid-json");
  }

  const raw = body as Partial<ChatRequest> | null;
  if (!raw || typeof raw.message !== "string" || !raw.message.trim()) {
    return bad("empty-message");
  }
  if (raw.message.length > MAX_MESSAGE_CHARS) {
    return bad("message-too-long");
  }

  const language: Language = LANGUAGES.includes(raw.language as Language)
    ? (raw.language as Language)
    : "en";
  const need: Need | null = NEEDS.includes(raw.need as Need) ? (raw.need as Need) : null;
  const ageBand: AgeBand | null = AGE_BANDS.includes(raw.ageBand as AgeBand)
    ? (raw.ageBand as AgeBand)
    : null;

  const history = Array.isArray(raw.history)
    ? raw.history
        .filter(
          (turn): turn is { role: "user" | "assistant"; content: string } =>
            Boolean(turn) &&
            (turn.role === "user" || turn.role === "assistant") &&
            typeof turn.content === "string",
        )
        .slice(-MAX_HISTORY_TURNS)
        .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  const selfNotes = Array.isArray(raw.selfNotes)
    ? raw.selfNotes.filter((note) => typeof note === "string").slice(0, 5).map((n) => n.slice(0, 160))
    : [];

  const moodScore =
    typeof raw.moodScore === "number" && raw.moodScore >= 1 && raw.moodScore <= 5
      ? raw.moodScore
      : null;

  try {
    const response = await runTurn({
      message: raw.message.trim(),
      language,
      need,
      ageBand,
      isMinor: Boolean(raw.isMinor),
      memoryEnabled: raw.memoryEnabled !== false,
      selfNotes,
      moodScore,
      history,
    });

    return Response.json(response, {
      headers: {
        // Nothing here should ever be cached anywhere.
        "cache-control": "no-store, no-cache, must-revalidate",
        "x-ratelimit-remaining": String(limit.remaining),
      },
    });
  } catch (error) {
    console.error("[chat] turn failed", error);
    return Response.json({ error: "turn-failed" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ error: "use-post" }, { status: 405 });
}
