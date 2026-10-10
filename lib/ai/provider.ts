/**
 * Provider adapter.
 *
 * The app talks to exactly one function, `generateReply`, so swapping model
 * vendors never touches product code. Three backends are chosen automatically
 * from the environment:
 *
 *   1. Gemini             - GEMINI_API_KEY
 *   2. OpenAI-compatible  - OPENAI_API_KEY (+ optional OPENAI_BASE_URL, so the
 *                           same path also serves Groq, Together, OpenRouter,
 *                           Ollama, vLLM and friends)
 *   3. Offline demo       - no key at all. A deterministic, warm responder so
 *                           the deployed app still works for a first look.
 *
 * API keys are read server-side only. They are never sent to the browser.
 */

import { demoReply } from "@/lib/ai/demo";
import type { Language, Need } from "@/lib/types";

export type ProviderId = "gemini" | "openai" | "demo";

export interface ProviderInfo {
  id: ProviderId;
  label: string;
  model: string;
  demo: boolean;
}

export interface GenerateArgs {
  system: string;
  history: { role: "user" | "assistant"; content: string }[];
  message: string;
  language: Language;
  /** Only used by the offline demo responder to pick a template. */
  need?: Need | null;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GenerateResult {
  text: string;
  provider: ProviderInfo;
  /** Set when the remote call failed and a fallback produced the text. */
  degraded?: string;
}

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const OPENAI_BASE = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

export function activeProvider(): ProviderInfo {
  if (process.env.GEMINI_API_KEY) {
    return { id: "gemini", label: "Google Gemini", model: DEFAULT_GEMINI_MODEL, demo: false };
  }
  if (process.env.OPENAI_API_KEY) {
    return { id: "openai", label: "OpenAI-compatible", model: DEFAULT_OPENAI_MODEL, demo: false };
  }
  return { id: "demo", label: "Offline demo", model: "rules-v1", demo: true };
}

const REQUEST_TIMEOUT_MS = 25_000;

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(args: GenerateArgs, model: string): Promise<string> {
  const contents = [
    ...args.history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: args.message }] },
  ];

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY as string,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: args.system }] },
        contents,
        generationConfig: {
          temperature: args.temperature ?? 0.8,
          topP: 0.95,
          maxOutputTokens: args.maxOutputTokens ?? 400,
        },
        // Emotional distress is legitimate content for this app. The crisis
        // path is handled deterministically before the model is called, so the
        // model is not the safety net here.
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`gemini ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };

  if (data.promptFeedback?.blockReason) {
    throw new Error(`gemini blocked input: ${data.promptFeedback.blockReason}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  if (!text.trim()) {
    throw new Error(`gemini empty response (${data.candidates?.[0]?.finishReason ?? "no reason"})`);
  }
  return text;
}

async function callOpenAiCompatible(args: GenerateArgs, model: string): Promise<string> {
  const response = await fetchWithTimeout(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
    },
    body: JSON.stringify({
      model,
      temperature: args.temperature ?? 0.8,
      max_tokens: args.maxOutputTokens ?? 400,
      messages: [
        { role: "system", content: args.system },
        ...args.history,
        { role: "user", content: args.message },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`openai-compatible ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new Error("openai-compatible empty response");
  return text;
}

export async function generateReply(args: GenerateArgs): Promise<GenerateResult> {
  const provider = activeProvider();

  if (provider.id === "demo") {
    return { text: demoReply(args), provider };
  }

  try {
    const text =
      provider.id === "gemini"
        ? await callGemini(args, provider.model)
        : await callOpenAiCompatible(args, provider.model);
    return { text, provider };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown provider error";
    // Never leave the person with an empty screen. Fall back to the offline
    // responder and mark the turn as degraded so the UI can be honest about it.
    return { text: demoReply(args), provider, degraded: message };
  }
}
