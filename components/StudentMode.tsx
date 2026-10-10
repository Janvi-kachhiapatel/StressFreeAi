"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { HelplineList } from "@/components/Helplines";
import { Button, Card, Pill, SectionHeading, cx } from "@/components/ui";
import { loadGoals, loadPlan, saveGoals, savePlan } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";
import type { ExamPlan, Goal } from "@/lib/types";

/**
 * Student mode.
 *
 * Deliberately model-free: nothing here is generated, so nothing here can
 * invent a deadline, a helpline number or a plan that does not fit. It is a
 * planner, a timer and scripts the person can copy - all of it on-device.
 *
 * The framing matters more than the features. Exam pressure is a trap of
 * "everything or nothing", so every screen here reduces the next action to
 * something that fits in twenty minutes or thirty seconds.
 */

const EMPTY_GOALS: Goal[] = [];
const EMPTY_PLAN: ExamPlan = { exam: "", date: "", topics: [] };
const MAX_GOALS = 3;
const WORK_SECONDS = 20 * 60;
const BREAK_SECONDS = 5 * 60;
const CYCLE_SECONDS = WORK_SECONDS + BREAK_SECONDS;

/** Helplines that fit the risks students actually disclose at this age. */
const STUDENT_RESOURCE_IDS = [
  "tele-manas",
  "kiran",
  "childline-1098",
  "women-181",
  "cyber-1930",
];

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

function clock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ planner */

function ExamPlanner() {
  const { dict, profile } = useApp();
  // `draft` shadows storage for the current session, so the inputs stay editable
  // for under-18s (whose memory is off and who therefore persist nothing).
  const stored = useStored<ExamPlan | null>("plan", loadPlan, null);
  const [draft, setDraft] = useState<ExamPlan | null>(null);
  const plan = draft ?? stored ?? EMPTY_PLAN;
  const [topicInput, setTopicInput] = useState("");

  function update(next: ExamPlan) {
    setDraft(next);
    savePlan(next, profile.memoryEnabled);
  }

  function addTopic() {
    const text = topicInput.trim();
    if (!text) return;
    update({ ...plan, topics: [...plan.topics, { id: newId(), text, done: false }] });
    setTopicInput("");
  }

  const daysLeft = (() => {
    if (!plan.date) return null;
    const target = new Date(`${plan.date}T00:00:00`);
    if (Number.isNaN(target.getTime())) return null;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000);
  })();

  const nextTopic = plan.topics.find((topic) => !topic.done);
  const hasTopics = plan.topics.length > 0;

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h2">{dict.student.planTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.student.planNote}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-ink">
          {dict.student.examLabel}
          <input
            value={plan.exam}
            onChange={(event) => update({ ...plan, exam: event.target.value })}
            placeholder={dict.student.examPlaceholder}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-normal text-ink outline-none focus-visible:border-accent"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-ink">
          {dict.student.dateLabel}
          <input
            type="date"
            value={plan.date}
            onChange={(event) => update({ ...plan, date: event.target.value })}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-normal text-ink outline-none focus-visible:border-accent"
          />
        </label>
      </div>

      {daysLeft !== null && (
        <div className="flex flex-wrap items-center gap-2">
          {daysLeft >= 0 ? (
            <Pill tone="accent">
              {daysLeft} {daysLeft === 1 ? dict.student.daysLeftOne : dict.student.daysLeftMany}
            </Pill>
          ) : (
            <Pill tone="warn">{dict.student.examPassed}</Pill>
          )}
          {nextTopic && (
            <p className="text-sm text-ink-soft">
              <span className="font-medium text-ink">{dict.student.startWith}: </span>
              {nextTopic.text}
            </p>
          )}
          {hasTopics && !nextTopic && (
            <p className="text-sm text-accent">{dict.student.nothingLeft}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">{dict.student.topicsLabel}</p>

        {!hasTopics && <p className="text-sm text-ink-faint">{dict.student.noTopics}</p>}

        <ul className="space-y-2">
          {plan.topics.map((topic) => (
            <li
              key={topic.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2"
            >
              <input
                type="checkbox"
                checked={topic.done}
                onChange={() =>
                  update({
                    ...plan,
                    topics: plan.topics.map((item) =>
                      item.id === topic.id ? { ...item, done: !item.done } : item,
                    ),
                  })
                }
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <span className={cx("flex-1 text-sm", topic.done ? "text-ink-faint line-through" : "text-ink")}>
                {topic.text}
              </span>
              <button
                type="button"
                onClick={() => update({ ...plan, topics: plan.topics.filter((item) => item.id !== topic.id) })}
                className="text-xs text-ink-faint underline decoration-line underline-offset-4 hover:text-ink"
              >
                {dict.common.delete}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={topicInput}
            onChange={(event) => setTopicInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTopic();
              }
            }}
            placeholder={dict.student.topicPlaceholder}
            className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
          />
          <Button variant="quiet" onClick={addTopic} disabled={!topicInput.trim()}>
            {dict.student.addTopic}
          </Button>
        </div>
      </div>

      {(hasTopics || plan.exam || plan.date) && (
        <button
          type="button"
          onClick={() => {
            setDraft(null);
            setTopicInput("");
            savePlan(null, profile.memoryEnabled);
          }}
          className="text-xs text-ink-faint underline decoration-line underline-offset-4 hover:text-ink"
        >
          {dict.student.clearPlan}
        </button>
      )}

      {!profile.memoryEnabled && (
        <p className="text-xs text-warn">
          Memory is off, so this plan will not be kept after you leave.
        </p>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------- timer */

function FocusTimer() {
  const { dict } = useApp();
  const [topic, setTopic] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Phase is derived from elapsed seconds, so no effect ever has to switch state.
  const position = elapsed % CYCLE_SECONDS;
  const inWork = position < WORK_SECONDS;
  const remaining = inWork ? WORK_SECONDS - position : CYCLE_SECONDS - position;
  const blocksDone = Math.floor(elapsed / CYCLE_SECONDS) + (inWork ? 0 : 1);

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h2">{dict.student.focusTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.student.focusNote}</p>
      </div>

      <input
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        placeholder={dict.student.focusPlaceholder}
        disabled={running}
        className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent disabled:opacity-60"
      />

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-accent">
            {running ? (inWork ? dict.student.focusPhaseWork : dict.student.focusPhaseBreak) : dict.student.focusTitle}
          </p>
          <p className="font-mono text-4xl tabular-nums text-ink">{clock(remaining)}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() => {
              if (running) {
                setRunning(false);
                setElapsed(0);
                return;
              }
              if (!topic.trim()) {
                setWarning(dict.student.focusNeedTopic);
                return;
              }
              setWarning(null);
              setElapsed(0);
              setRunning(true);
            }}
          >
            {running ? dict.student.focusStop : dict.student.focusStart}
          </Button>
          <Pill tone="accent">
            {blocksDone} {dict.student.focusBlocks}
          </Pill>
        </div>
      </div>

      {warning && <p className="text-sm text-warn">{warning}</p>}
      {running && !inWork && <p className="text-sm text-accent">{dict.student.focusBreakNote}</p>}
    </Card>
  );
}

/* -------------------------------------------------------------------- goals */

function SmallGoals() {
  const { dict, profile } = useApp();
  const stored = useStored<Goal[]>("goals", loadGoals, EMPTY_GOALS);
  const [draft, setDraft] = useState<Goal[] | null>(null);
  const goals = draft ?? stored;
  const [text, setText] = useState("");

  function update(next: Goal[]) {
    setDraft(next);
    saveGoals(next, profile.memoryEnabled);
  }

  function add() {
    const value = text.trim();
    if (!value || goals.length >= MAX_GOALS) return;
    update([...goals, { id: newId(), text: value, done: false }]);
    setText("");
  }

  const done = goals.filter((goal) => goal.done).length;

  return (
    <Card className="space-y-3">
      <div className="space-y-1">
        <SectionHeading as="h2">{dict.student.goalsTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.student.goalsNote}</p>
      </div>

      {goals.length === 0 && <p className="text-sm text-ink-faint">{dict.student.goalsEmpty}</p>}

      <ul className="space-y-2">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2"
          >
            <input
              type="checkbox"
              checked={goal.done}
              onChange={() =>
                update(goals.map((item) => (item.id === goal.id ? { ...item, done: !item.done } : item)))
              }
              className="h-5 w-5 accent-[var(--accent)]"
            />
            <span className={cx("flex-1 text-sm", goal.done ? "text-ink-faint line-through" : "text-ink")}>
              {goal.text}
            </span>
            <button
              type="button"
              onClick={() => update(goals.filter((item) => item.id !== goal.id))}
              className="text-xs text-ink-faint underline decoration-line underline-offset-4 hover:text-ink"
            >
              {dict.common.delete}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={dict.student.goalsPlaceholder}
          disabled={goals.length >= MAX_GOALS}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent disabled:opacity-60"
        />
        <Button variant="quiet" onClick={add} disabled={!text.trim() || goals.length >= MAX_GOALS}>
          {dict.student.goalsAdd}
        </Button>
      </div>

      <p className="text-xs text-ink-faint">
        {goals.length >= MAX_GOALS ? dict.student.goalsLimit : `${done}/${MAX_GOALS} ${dict.student.goalsDone}`}
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ scripts */

function CareerPressure() {
  const { dict } = useApp();
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h2">{dict.student.careerTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.student.careerNote}</p>
      </div>

      <div className="space-y-3">
        {dict.student.careerItems.map((item) => (
          <div key={item.heading} className="rounded-xl border border-line bg-surface-2 p-3">
            <p className="font-medium text-ink">{item.heading}</p>
            <p className="text-sm text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">{dict.student.careerScriptTitle}</p>
        <ul className="space-y-2">
          {dict.student.careerScripts.map((script) => (
            <li key={script} className="rounded-xl border border-accent/30 bg-accent-soft p-3 text-sm text-ink">
              {script}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function FacultyPressure() {
  const { dict } = useApp();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(dict.student.facultyEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (older browsers, insecure context): the text is on
      // screen and selectable, so this is a no-op rather than an error.
    }
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h2">{dict.student.facultyTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.student.facultyNote}</p>
      </div>

      <ol className="space-y-2 text-sm text-ink-soft">
        {dict.student.facultySteps.map((step, index) => (
          <li key={step}>
            <span className="font-mono text-accent">{index + 1}.</span> {step}
          </li>
        ))}
      </ol>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">{dict.student.facultyEmailTitle}</p>
        <pre className="whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-3 text-sm text-ink">
          {dict.student.facultyEmail}
        </pre>
        <Button variant="quiet" onClick={() => void copy()}>
          {copied ? dict.student.copied : dict.student.copy}
        </Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------- safety */

function HeavySection() {
  const { dict } = useApp();
  return (
    <Card tone="danger" className="space-y-4">
      <SectionHeading as="h2">{dict.student.heavyTitle}</SectionHeading>
      <p className="text-sm text-ink-soft">{dict.student.heavyBody}</p>

      <div className="flex flex-wrap gap-2">
        <a
          href="tel:14416"
          className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Call Tele-MANAS 14416
        </a>
        <Link
          href="/chat"
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
        >
          {dict.student.heavyChat}
        </Link>
        <Link
          href="/safety"
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
        >
          {dict.student.heavySafety}
        </Link>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">{dict.student.heavyHelplines}</p>
        <HelplineList ids={STUDENT_RESOURCE_IDS} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ composed */

export function StudentMode() {
  const { dict } = useApp();
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">Student mode</Pill>
          <Pill>No sign-up</Pill>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{dict.student.title}</h1>
        <p className="max-w-2xl text-sm text-ink-soft">{dict.student.subtitle}</p>
        <p className="max-w-2xl text-xs text-ink-faint">{dict.student.privacyNote}</p>
      </div>

      <ExamPlanner />
      <FocusTimer />
      <SmallGoals />
      <CareerPressure />
      <FacultyPressure />
      <HeavySection />
    </div>
  );
}
