/**
 * Turn orchestration: the safety-first pipeline for a single chat message.
 *
 *   triage (deterministic)  ->  crisis?  ->  deterministic reply, stop
 *                           ->  elevated? -> deterministic safety check, stop
 *                           ->  otherwise -> model -> output guard -> reply
 *
 * The ordering matters. The model is the last step, never the safety net.
 */

import { detectDomain, detectEmotions, suggestedReplies } from "@/lib/analysis";
import { generateReply } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { crisisReply, elevatedReply } from "@/lib/safety/crisis";
import { guardOutput, shapeReply } from "@/lib/safety/outputGuard";
import { triage } from "@/lib/safety/triage";
import { resourceIdsFor } from "@/lib/helplines";
import type { ChatRequest, ChatResponse, Language } from "@/lib/types";

const FALLBACK: Record<Language, string> = {
  en: "I'm here, but something went wrong on my side and I don't want to answer you badly. Give me one more try — say that again, and please don't close the app if this feels heavy. If you need a person right now, Tele-MANAS on 14416 is free and answered 24x7 in India.",
  hi: "मैं यहीं हूँ, लेकिन मेरी तरफ़ कुछ गड़बड़ हुई और मैं गलत जवाब नहीं देना चाहता/चाहती। एक बार फिर बताइए। अगर अभी किसी इंसान से बात करनी है, तो टेली-मानस 14416 मुफ्त है और 24x7 उपलब्ध है।",
  gu: "હું અહીં જ છું, પણ મારી બાજુ કંઈ ખોટું થયું અને હું ખોટો જવાબ નથી આપવા માંગતો/માંગતી. ફરી એક વાર કહો. જો હમણાં માણસ સાથે વાત કરવી હોય, તો ટેલી-માનસ 14416 મફત છે અને 24x7 ઉપલબ્ધ છે.",
};

function historyForModel(history: { role: "user" | "assistant"; content: string }[]) {
  // Last 8 turns is plenty for continuity and keeps cost and latency low.
  return history.slice(-8);
}

export async function runTurn(input: ChatRequest): Promise<ChatResponse> {
  const language: Language = input.language ?? "en";
  const recentUserTurns = input.history.filter((t) => t.role === "user").map((t) => t.content);
  const result = triage(input.message, recentUserTurns);
  const isMinor = Boolean(input.isMinor) || input.ageBand === "teen";

  // ------------------------------------------------------------------ crisis
  if (result.level === 3) {
    return {
      reply: crisisReply({
        language,
        isMinor,
        kinds: result.kinds,
        hasPlan: result.hasPlan,
        wantsHuman: result.wantsHuman,
      }),
      supportMode: "crisis",
      riskLevel: 3,
      kinds: result.kinds,
      showCrisisPanel: true,
      suggestedReplies: [],
      provider: "safety-layer",
      demo: false,
      deterministic: true,
      resourceIds: resourceIdsFor({ isMinor, kinds: result.kinds, wantsHuman: true }),
    };
  }

  // ---------------------------------------------------------------- elevated
  if (result.level === 2) {
    return {
      reply: elevatedReply({
        language,
        isMinor,
        kinds: result.kinds,
        wantsHuman: result.wantsHuman,
      }),
      supportMode: "elevated",
      riskLevel: 2,
      kinds: result.kinds,
      showCrisisPanel: true,
      suggestedReplies: suggestedReplies(input.need, detectDomain(input.message), detectEmotions(input.message)),
      provider: "safety-layer",
      demo: false,
      deterministic: true,
      resourceIds: resourceIdsFor({ isMinor, kinds: result.kinds, wantsHuman: true }),
    };
  }

  // ------------------------------------------------------------------ normal
  const domain = detectDomain(`${input.message} ${recentUserTurns.slice(-3).join(" ")}`);
  const emotions = detectEmotions(input.message);

  const system = buildSystemPrompt({
    language,
    need: input.need,
    domain,
    emotions,
    ageBand: input.ageBand,
    isMinor,
    memoryEnabled: input.memoryEnabled,
    selfNotes: input.selfNotes ?? [],
    moodScore: input.moodScore ?? null,
  });

  let text: string;
  let providerLabel: string;
  let demo = false;

  try {
    const generated = await generateReply({
      system,
      history: historyForModel(input.history ?? []),
      message: input.message,
      language,
      need: input.need,
      temperature: 0.85,
      maxOutputTokens: 400,
    });
    text = generated.text;
    providerLabel = generated.provider.label;
    demo = generated.provider.demo;
  } catch {
    // generateReply already degrades internally; this is the last-resort guard.
    text = "";
    providerLabel = "fallback";
  }

  const { text: safe } = guardOutput(shapeReply(text ?? ""), language);
  const finalText = safe.trim() || FALLBACK[language];

  // A person asking for human help, or showing level-1 distress, gets resources
  // attached without the crisis panel taking over the screen.
  const wantsHuman = result.wantsHuman || input.need === "human" || result.level === 1;
  const resourceIds = wantsHuman ? resourceIdsFor({ isMinor, kinds: result.kinds, wantsHuman: true }) : [];

  return {
    reply: finalText,
    supportMode: wantsHuman ? "elevated" : "normal",
    riskLevel: result.level,
    kinds: result.kinds,
    showCrisisPanel: wantsHuman,
    suggestedReplies: suggestedReplies(input.need, domain, emotions),
    provider: providerLabel,
    demo,
    deterministic: false,
    resourceIds,
  };
}
