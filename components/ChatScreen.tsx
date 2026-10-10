"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { CrisisPanel } from "@/components/CrisisPanel";
import { HelplineList } from "@/components/Helplines";
import { Chip, Pill, Button, cx } from "@/components/ui";
import { greetingFor } from "@/lib/ai/prompt";
import { loadMessages, loadMoods, saveMessages } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";
import { CRISIS_RESOURCE_IDS, resourceIdsFor } from "@/lib/helplines";
import { NEEDS, type ChatMessage, type ChatResponse, type Need } from "@/lib/types";

const NEED_LABEL_KEYS: Record<
  Need,
  "needVent" | "needCalm" | "needSolve" | "needPlan" | "needDistract" | "needHuman"
> = {
  vent: "needVent",
  calm: "needCalm",
  solve: "needSolve",
  plan: "needPlan",
  distract: "needDistract",
  human: "needHuman",
};

const EMPTY_MESSAGES: ChatMessage[] = [];

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cx("sf-rise flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cx("max-w-[85%] space-y-2", isUser ? "items-end" : "items-start")}>
        <div
          className={cx(
            "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[0.95rem]",
            isUser
              ? "rounded-br-md bg-accent text-accent-ink"
              : "rounded-bl-md border border-line bg-surface text-ink",
          )}
        >
          {message.content}
        </div>

        {!isUser && message.meta && (
          <div className="flex flex-wrap gap-1.5">
            {message.meta.supportMode === "crisis" && <Pill tone="danger">Safety mode</Pill>}
            {message.meta.supportMode === "elevated" && <Pill tone="warn">Support shown</Pill>}
            {message.meta.demo && <Pill>Demo reply</Pill>}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-faint" aria-live="polite">
      <span className="sf-typing flex gap-1" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {label}
    </div>
  );
}

export function ChatScreen() {
  const { dict, profile, language, status, ready, updateProfile } = useApp();

  // Persisted history comes from localStorage; messages created this session are
  // held separately so the chat still works when memory is switched off.
  const storedMessages = useStored<ChatMessage[]>("messages", loadMessages, EMPTY_MESSAGES);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);

  const messages = useMemo(() => {
    const known = new Set(storedMessages.map((message) => message.id));
    return [...storedMessages, ...sessionMessages.filter((message) => !known.has(message.id))];
  }, [storedMessages, sessionMessages]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [needOverride, setNeedOverride] = useState<Need | null | undefined>(undefined);
  const [needOpen, setNeedOpen] = useState(false);
  const [panel, setPanel] = useState<{ open: boolean; resourceIds: string[] }>({
    open: false,
    resourceIds: CRISIS_RESOURCE_IDS,
  });
  const [lastResources, setLastResources] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const need = needOverride !== undefined ? needOverride : profile.preferredNeed;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const greeting = useMemo(
    () =>
      greetingFor({
        language,
        need,
        domain: null,
        emotions: [],
        ageBand: profile.ageBand,
        isMinor: profile.isMinor,
        memoryEnabled: profile.memoryEnabled,
        selfNotes: profile.selfNotes,
        moodScore: null,
      }),
    [language, need, profile],
  );

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || sending) return;

      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      const priorTurns = messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));
      const upToUser = [...messages, userMessage];

      setSessionMessages((previous) => [...previous, userMessage]);
      setInput("");
      setSending(true);
      setError(null);
      setChips([]);
      saveMessages(upToUser, profile.memoryEnabled);

      try {
        const moodToday = loadMoods().find(
          (entry) => entry.date === new Date().toISOString().slice(0, 10),
        );

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            message: content,
            language,
            need,
            ageBand: profile.ageBand,
            isMinor: profile.isMinor,
            memoryEnabled: profile.memoryEnabled,
            selfNotes: profile.selfNotes,
            moodScore: moodToday?.score ?? null,
            history: priorTurns,
          }),
        });

        if (response.status === 429) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          setError(
            data?.message ??
              "You're sending messages very quickly. Take one slow breath, then try again in a moment.",
          );
          return;
        }

        if (!response.ok) {
          setError("Something went wrong on my side. Please try that message again.");
          return;
        }

        const data = (await response.json()) as ChatResponse;
        const assistantMessage: ChatMessage = {
          id: newId(),
          role: "assistant",
          content: data.reply,
          createdAt: new Date().toISOString(),
          meta: {
            supportMode: data.supportMode,
            riskLevel: data.riskLevel,
            kinds: data.kinds,
            provider: data.provider,
            demo: data.demo,
            crisisResourcesShared: data.resourceIds.length > 0,
          },
        };

        setSessionMessages((previous) => [...previous, assistantMessage]);
        saveMessages([...upToUser, assistantMessage], profile.memoryEnabled);
        setChips(data.suggestedReplies ?? []);
        setLastResources(data.resourceIds ?? []);

        // The safety layer decides whether resources take over the screen.
        if (data.showCrisisPanel) {
          setPanel({
            open: true,
            resourceIds:
              data.resourceIds.length > 0
                ? data.resourceIds
                : resourceIdsFor({
                    isMinor: profile.isMinor,
                    kinds: data.kinds,
                    wantsHuman: true,
                  }),
          });
        }
      } catch {
        setError("I couldn't reach the server. Check your connection and try again.");
      } finally {
        setSending(false);
      }
    },
    [messages, need, language, profile, sending],
  );

  function startFresh() {
    setSessionMessages([]);
    setChips([]);
    setLastResources([]);
    saveMessages([], profile.memoryEnabled);
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-sm text-ink-faint">Getting things ready…</div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
      {/* ------------------------------------------------------------ toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip tone={need ? "accent" : "plain"} onClick={() => setNeedOpen((open) => !open)}>
          {need
            ? `${dict.chat.needChange}: ${dict.onboarding[NEED_LABEL_KEYS[need]]}`
            : dict.chat.needPickerTitle}
        </Chip>

        <Link href="/tools">
          <Chip>{dict.nav.tools}</Chip>
        </Link>

        <Link href="/student">
          <Chip>{dict.nav.student}</Chip>
        </Link>

        <button
          type="button"
          onClick={() => setPanel({ open: true, resourceIds: CRISIS_RESOURCE_IDS })}
          className="ml-auto rounded-full border border-danger/40 bg-danger-soft px-3 py-1.5 text-sm font-medium text-danger transition hover:opacity-90"
        >
          Need a person now?
        </button>
      </div>

      {needOpen && (
        <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-3">
          {NEEDS.map((option) => (
            <Chip
              key={option}
              tone={need === option ? "accent" : "plain"}
              onClick={() => {
                setNeedOverride(option);
                updateProfile({ preferredNeed: option });
                setNeedOpen(false);
              }}
            >
              {dict.onboarding[NEED_LABEL_KEYS[option]]}
            </Chip>
          ))}
        </div>
      )}

      {status.demo && (
        <div className="mb-4 rounded-2xl border border-warn/30 bg-warn-soft p-3 text-sm text-warn">
          {dict.chat.limitedDemo}
        </div>
      )}

      {/* ----------------------------------------------------------- messages */}
      <div className="flex-1 space-y-4">
        {messages.length === 0 && (
          <div className="sf-rise flex justify-start">
            <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink">
              {greeting}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {sending && <TypingIndicator label={dict.chat.thinking} />}

        {error && (
          <div className="rounded-2xl border border-danger/40 bg-danger-soft p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!panel.open && lastResources.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-ink">{dict.crisis.title}</p>
            <HelplineList ids={lastResources} />
          </div>
        )}

        {!sending && chips.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs uppercase tracking-wide text-ink-faint">{dict.chat.tryOne}</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Chip key={chip} onClick={() => void send(chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ---------------------------------------------------------- composer */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="sticky bottom-0 mt-5 space-y-2 bg-bg pb-2 pt-2"
      >
        <label className="sr-only" htmlFor="chat-input">
          {dict.chat.placeholder}
        </label>
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface p-2">
          <textarea
            id="chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={dict.chat.placeholder}
            className="max-h-40 min-h-[2.5rem] w-full resize-none bg-transparent px-2 py-2 text-sm text-ink outline-none"
          />
          <Button type="submit" disabled={sending || !input.trim()} ariaLabel={dict.chat.send}>
            {dict.chat.send}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-faint">
          <span>
            {profile.memoryEnabled ? dict.privacy.memoryOnLabel : dict.privacy.memoryOffLabel}
          </span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startFresh}
              className="underline decoration-line underline-offset-4 hover:text-ink"
            >
              {dict.chat.newChat}
            </button>
          )}
        </div>
      </form>

      {panel.open && (
        <CrisisPanel
          resourceIds={panel.resourceIds}
          onClose={() => setPanel((current) => ({ ...current, open: false }))}
          onTalk={() => setPanel((current) => ({ ...current, open: false }))}
        />
      )}
    </div>
  );
}
