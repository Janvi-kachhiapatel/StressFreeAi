"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { limitsStatement } from "@/lib/safety/crisis";

export function SiteFooter() {
  const { dict, language } = useApp();

  return (
    <footer className="mt-12 border-t border-line bg-surface-2/50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-ink-soft">
        <p className="max-w-2xl">{limitsStatement(language)}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/safety" className="underline decoration-line underline-offset-4 hover:text-ink">
            {dict.nav.safety}
          </Link>
          <Link href="/privacy" className="underline decoration-line underline-offset-4 hover:text-ink">
            {dict.nav.privacy}
          </Link>
          <Link href="/tools" className="underline decoration-line underline-offset-4 hover:text-ink">
            {dict.nav.tools}
          </Link>
          <Link href="/student" className="underline decoration-line underline-offset-4 hover:text-ink">
            {dict.nav.student}
          </Link>
        </div>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
          <span className="font-medium text-warn">In a crisis, in India:</span>
          <a className="underline underline-offset-4" href="tel:14416">
            Tele-MANAS 14416
          </a>
          <span aria-hidden>·</span>
          <a className="underline underline-offset-4" href="tel:18005990019">
            KIRAN 1800-599-0019
          </a>
          <span aria-hidden>·</span>
          <a className="underline underline-offset-4" href="tel:112">
            Emergency 112
          </a>
        </p>

        <p className="text-xs text-ink-faint">
          StressFree AI is a wellbeing companion in early beta. It is not a medical device and makes
          no clinical claims. Please report any unsafe reply — that is the most useful thing you can
          do for the next person who uses it.
        </p>
      </div>
    </footer>
  );
}
