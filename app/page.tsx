"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { Card, Pill, SectionHeading } from "@/components/ui";

const FEATURES = [
  {
    title: "It listens before it fixes",
    body: "Tell it what's happening. It reflects back what you actually said, then asks one question instead of dumping ten tips on you.",
  },
  {
    title: "One small step, not a lecture",
    body: "A 20-minute study block, a 10-minute walk, one message to one person. Small enough to do while you feel bad.",
  },
  {
    title: "Tools that work in under 10 minutes",
    body: "Box breathing, 5-4-3-2-1 grounding, a one-line journal, and a mood check-in you can actually keep up with.",
  },
  {
    title: "Student mode for exam season",
    body: "Count the days, pick one topic per twenty-minute block, and keep a focus timer. Plus scripts for career pressure and for a teacher who is being unfair.",
  },
  {
    title: "It knows where its job ends",
    body: "When risk shows up, normal chat stops and you get free human help: Tele-MANAS 14416 and the other Indian helplines, one tap away.",
  },
];

export default function HomePage() {
  const { dict, profile, status } = useApp();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
      <section className="max-w-2xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">Early beta</Pill>
          <Pill>English · हिन्दी · ગુજરાતી</Pill>
          {status.demo && <Pill tone="warn">{dict.chat.demoBadge}</Pill>}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {dict.tagline}
        </h1>

        <p className="text-base text-ink-soft sm:text-lg">{dict.promiseBody}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition hover:opacity-90"
          >
            {dict.common.start}
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            {dict.nav.tools}
          </Link>
          <Link
            href="/student"
            className="inline-flex items-center rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            {dict.nav.student}
          </Link>
          <Link
            href="/safety"
            className="inline-flex items-center rounded-xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            {dict.nav.safety}
          </Link>
        </div>

        <p className="text-sm text-ink-faint">
          {profile.memoryEnabled
            ? "Your chats stay in this browser. Only the message you send goes to the AI to get a reply."
            : "Memory is off: nothing is kept between sessions."}
        </p>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="space-y-2">
            <h2 className="font-semibold text-ink">{feature.title}</h2>
            <p className="text-sm text-ink-soft">{feature.body}</p>
          </Card>
        ))}
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <Card tone="accent" className="space-y-3">
          <SectionHeading as="h2">What it is not</SectionHeading>
          <ul className="space-y-2 text-sm text-ink-soft">
            {dict.onboarding.whatItIsNotList.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </Card>

        <Card tone="warn" className="space-y-3">
          <SectionHeading as="h2">In a crisis, right now</SectionHeading>
          <p className="text-sm text-ink-soft">
            Please don&apos;t wait for an app. In India these are free, and answered by trained people.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:14416"
              className="rounded-xl bg-warn px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Tele-MANAS 14416
            </a>
            <a
              href="tel:18005990019"
              className="rounded-xl border border-warn/40 px-4 py-2.5 text-sm font-semibold text-warn transition hover:opacity-90"
            >
              KIRAN 1800-599-0019
            </a>
            <a
              href="tel:112"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2"
            >
              Emergency 112
            </a>
          </div>
        </Card>
      </section>

      <section className="mt-14 max-w-3xl space-y-3">
        <SectionHeading as="h2">Why this exists, and how it is built</SectionHeading>
        <p className="text-sm text-ink-soft">
          AI wellbeing apps tend to be English-first, subscription-first and vague about their
          limits. StressFree AI is built the other way around: free at the point of need,
          India-first, trilingual, and explicit that it is a companion and not a clinician. Safety
          runs before the model, so a message that mentions self-harm is handled by fixed, reviewed
          language rather than whatever the model feels like generating that day.
        </p>
        <p className="text-sm text-ink-soft">
          Under 18? Guardian-aware mode keeps nothing between sessions and always points you to a
          trusted adult or Childline 1098. Read the{" "}
          <Link href="/safety" className="text-accent underline decoration-accent/40 underline-offset-4">
            safety and limits page
          </Link>{" "}
          before you need it.
        </p>
      </section>
    </div>
  );
}
