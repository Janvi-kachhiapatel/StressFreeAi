"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Button, Card, Pill, SectionHeading } from "@/components/ui";
import { loadJournal, saveJournal, type JournalLine } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";
import type { Language } from "@/lib/types";

/* ------------------------------------------------------------------ breathing */

const PHASE_LABELS: Record<Language, { in: string; hold: string; out: string }> = {
  en: { in: "Breathe in", hold: "Hold", out: "Breathe out" },
  hi: { in: "सांस लें", hold: "रोकें", out: "छोड़ें" },
  gu: { in: "શ્વાસ લો", hold: "રોકો", out: "છોડો" },
};

/** 4-4-6-2: the longer exhale is the part that settles the nervous system. */
const PHASES = [
  { key: "in", seconds: 4, scale: 1 },
  { key: "hold", seconds: 4, scale: 1 },
  { key: "out", seconds: 6, scale: 0.62 },
  { key: "rest", seconds: 2, scale: 0.62 },
] as const;

const CYCLE_SECONDS = PHASES.reduce((total, phase) => total + phase.seconds, 0);

export function BreathingExercise() {
  const { language, dict } = useApp();
  const [running, setRunning] = useState(false);
  // A single elapsed-seconds counter; the phase is derived from it, so no effect
  // ever needs to reset state.
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTicks((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const position = ticks % CYCLE_SECONDS;
  let elapsed = 0;
  let phaseIndex = 0;
  for (let index = 0; index < PHASES.length; index += 1) {
    if (position < elapsed + PHASES[index].seconds) {
      phaseIndex = index;
      break;
    }
    elapsed += PHASES[index].seconds;
  }
  const phase = PHASES[phaseIndex];
  const remaining = elapsed + phase.seconds - position;
  const rounds = Math.floor(ticks / CYCLE_SECONDS);

  const labels = PHASE_LABELS[language] ?? PHASE_LABELS.en;
  const label = phase.key === "in" ? labels.in : phase.key === "out" ? labels.out : labels.hold;

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h3">{dict.tools.breathing}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.tools.breathingNote}</p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <div className="absolute inset-0 rounded-full border border-accent/25" />
          <div
            aria-hidden
            className="absolute inset-3 rounded-full bg-accent-soft transition-transform ease-in-out"
            style={{
              transform: `scale(${running ? phase.scale : 0.8})`,
              transitionDuration: `${running ? phase.seconds * 1000 : 300}ms`,
            }}
          />
          <div className="relative text-center" aria-live="polite">
            <p className="text-sm font-medium text-accent">{running ? label : dict.tools.breathing}</p>
            <p className="font-mono text-3xl tabular-nums text-ink">{running ? remaining : "—"}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => {
              setTicks(0);
              setRunning((value) => !value);
            }}
          >
            {running ? dict.tools.stop : dict.tools.start}
          </Button>
          <Pill tone="accent">
            {rounds} {dict.tools.cycle}
            {rounds === 1 ? "" : "s"}
          </Pill>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------- grounding */

export function GroundingSteps() {
  const { dict } = useApp();
  const steps = [dict.tools.see, dict.tools.touch, dict.tools.hear, dict.tools.smell, dict.tools.taste];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const done = index >= steps.length;

  function next() {
    if (!done) setAnswers((previous) => [...previous, value.trim()]);
    setValue("");
    setIndex((current) => current + 1);
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h3">{dict.tools.grounding}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.tools.groundingNote}</p>
      </div>

      {done ? (
        <div className="space-y-3">
          <p className="text-sm text-ink">
            {answers.filter(Boolean).length} / {steps.length} — done. Nothing was saved.
          </p>
          <Button
            variant="quiet"
            onClick={() => {
              setIndex(0);
              setAnswers([]);
            }}
          >
            {dict.tools.reset}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-1.5" aria-hidden>
            {steps.map((_, stepIndex) => (
              <span
                key={stepIndex}
                className={`h-1.5 flex-1 rounded-full ${stepIndex <= index ? "bg-accent" : "bg-line"}`}
              />
            ))}
          </div>

          <label className="block text-sm font-medium text-ink" htmlFor="grounding-input">
            {steps[index]}
          </label>
          <textarea
            id="grounding-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-ink outline-none focus-visible:border-accent"
            placeholder="…"
          />
          <div className="flex items-center gap-2">
            <Button onClick={next}>{index === steps.length - 1 ? "Finish" : dict.common.next}</Button>
            <button
              type="button"
              onClick={next}
              className="text-sm text-ink-faint underline decoration-line underline-offset-4"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* --------------------------------------------------------------------- journal */

const EMPTY_JOURNAL: JournalLine[] = [];

export function JournalPrompt() {
  const { dict, profile } = useApp();
  const lines = useStored<JournalLine[]>("journal", loadJournal, EMPTY_JOURNAL);
  const [value, setValue] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function save() {
    const text = value.trim();
    if (!text) return;
    const line: JournalLine = {
      id: globalThis.crypto?.randomUUID?.() ?? `line-${Date.now()}`,
      at: new Date().toISOString(),
      text,
    };
    saveJournal([...lines, line], profile.memoryEnabled);
    setValue("");
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <Card className="space-y-3">
      <div className="space-y-1">
        <SectionHeading as="h3">{dict.tools.journal}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.tools.journalNote}</p>
      </div>

      <label className="block text-sm font-medium text-ink" htmlFor="journal-input">
        {dict.tools.journalPrompt}
      </label>
      <textarea
        id="journal-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-ink outline-none focus-visible:border-accent"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={!value.trim()}>
          {dict.common.save}
        </Button>
        {savedAt && (
          <span className="text-xs text-ink-faint">
            {dict.tools.journalSaved} · {savedAt}
          </span>
        )}
        {!profile.memoryEnabled && (
          <span className="text-xs text-warn">
            Memory is off, so this line will not be kept after you leave.
          </span>
        )}
        {lines.length > 0 && <span className="text-xs text-ink-faint">{lines.length} saved</span>}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ composed */

export function CalmTools({ compact = false }: { compact?: boolean }) {
  const { dict } = useApp();
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="space-y-1">
          <SectionHeading as="h2">{dict.tools.title}</SectionHeading>
          <p className="text-sm text-ink-soft">{dict.tools.subtitle}</p>
        </div>
      )}
      <BreathingExercise />
      <GroundingSteps />
      <JournalPrompt />
    </div>
  );
}
