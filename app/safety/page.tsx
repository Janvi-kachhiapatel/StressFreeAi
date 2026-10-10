"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { AllHelplines } from "@/components/Helplines";
import { Card, Pill, SectionHeading } from "@/components/ui";

// TODO: replace with your real monitored address before launch. An unmonitored
// safety inbox is worse than none, because people will trust it.
const REPORT_EMAIL = "safety@stressfree.ai";

export default function SafetyPage() {
  const { dict } = useApp();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-3">
        <Pill tone="danger">Read this before you need it</Pill>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{dict.safety.title}</h1>
        <p className="max-w-2xl text-sm text-ink-soft">{dict.safety.subtitle}</p>
      </div>

      <div className="space-y-8">
        <Card className="space-y-3">
          <SectionHeading as="h2">{dict.safety.limitsTitle}</SectionHeading>
          <ul className="space-y-2 text-sm text-ink-soft">
            {dict.safety.limitsBody.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </Card>

        <Card tone="accent" className="space-y-3">
          <SectionHeading as="h2">{dict.safety.howTitle}</SectionHeading>
          <ol className="space-y-2 text-sm text-ink-soft">
            {dict.safety.howSteps.map((item, index) => (
              <li key={item}>
                <span className="font-mono text-accent">{index + 1}.</span> {item}
              </li>
            ))}
          </ol>
        </Card>

        <section className="space-y-4">
          <SectionHeading as="h2">{dict.safety.helplinesTitle}</SectionHeading>
          <p className="text-sm text-ink-soft">{dict.safety.helplinesNote}</p>
          <AllHelplines />
        </section>

        <Card className="space-y-3">
          <SectionHeading as="h2">{dict.safety.reportTitle}</SectionHeading>
          <p className="text-sm text-ink-soft">{dict.safety.reportBody}</p>
          <a
            href={`mailto:${REPORT_EMAIL}?subject=Unsafe%20reply%20report`}
            className="inline-flex w-fit rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            Email {REPORT_EMAIL}
          </a>
        </Card>

        <Card className="space-y-3">
          <SectionHeading as="h2">Children and the law (India)</SectionHeading>
          <p className="text-sm text-ink-soft">
            Under the Digital Personal Data Protection Act, 2023, anyone under 18 needs verifiable
            parental consent for their personal data to be processed, and behavioural tracking of
            children is restricted. This app therefore keeps nothing between sessions for
            under-18s, does not profile them, and always routes them towards a trusted adult or
            Childline 1098. If you are a parent or guardian reading this: the app is designed to
            point your child towards you, not away from you.
          </p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
          >
            {dict.common.start}
          </Link>
          <Link
            href="/privacy"
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            {dict.nav.privacy}
          </Link>
        </div>
      </div>
    </div>
  );
}
