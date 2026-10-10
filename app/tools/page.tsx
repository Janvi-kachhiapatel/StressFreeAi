"use client";

import Link from "next/link";
import { CalmTools } from "@/components/Grounding";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { SupportCircle } from "@/components/SupportCircle";
import { useApp } from "@/components/AppProvider";
import { Card, Pill } from "@/components/ui";

export default function ToolsPage() {
  const { dict } = useApp();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="accent">No cost, no sign-up</Pill>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{dict.tools.title}</h1>
        <p className="max-w-2xl text-sm text-ink-soft">{dict.tools.subtitle}</p>
      </div>

      <div className="space-y-6">
        <CalmTools compact />

        <Card className="space-y-3">
          <h2 className="font-semibold text-ink">{dict.tools.walk}</h2>
          <p className="text-sm text-ink-soft">{dict.tools.walkNote}</p>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-ink">{dict.tools.study}</h2>
          <p className="text-sm text-ink-soft">{dict.tools.studyNote}</p>
          <Link
            href="/student"
            className="inline-flex w-fit rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface-2"
          >
            {dict.nav.student}
          </Link>
        </Card>

        <MoodCheckIn />
        <SupportCircle />

        <Card tone="danger" className="space-y-3">
          <h2 className="font-semibold text-danger">If it gets too heavy for tools</h2>
          <p className="text-sm text-ink-soft">
            Tools are for ordinary hard days. If you are thinking about hurting yourself, or someone
            is hurting you, skip the exercises and get a person: Tele-MANAS 14416, free and answered
            24x7 in India.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="tel:14416"
              className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Call 14416
            </a>
            <Link
              href="/safety"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2"
            >
              {dict.nav.safety}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
