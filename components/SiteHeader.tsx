"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { LANGUAGES } from "@/lib/types";
import { cx } from "@/components/ui";

export function SiteHeader() {
  const { dict, profile, updateProfile, status, ready } = useApp();
  const pathname = usePathname();

  const links = [
    { href: "/chat", label: dict.nav.chat },
    { href: "/tools", label: dict.nav.tools },
    { href: "/student", label: dict.nav.student },
    { href: "/safety", label: dict.nav.safety },
    { href: "/privacy", label: dict.nav.privacy },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 14c2.5 0 3-5 5.5-5S12 16 14.5 16 19 11 20 11" strokeLinecap="round" />
            </svg>
          </span>
          {dict.appName}
        </Link>

        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto text-sm sm:order-2 sm:mx-0 sm:w-auto">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 transition",
                  active ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-surface-2",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3">
          {ready && status.demo && (
            <span
              title={
                "No model API key is configured, so replies come from written templates. Everything else works normally."
              }
              className="hidden rounded-full border border-warn/30 bg-warn-soft px-2.5 py-0.5 text-xs font-medium text-warn sm:inline-block"
            >
              {dict.chat.demoBadge}
            </span>
          )}

          <div
            role="group"
            aria-label={dict.onboarding.languageQuestion}
            className="flex overflow-hidden rounded-lg border border-line"
          >
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => updateProfile({ language: language.code })}
                aria-pressed={profile.language === language.code}
                className={cx(
                  "px-2.5 py-1.5 text-xs transition",
                  profile.language === language.code
                    ? "bg-accent text-accent-ink"
                    : "bg-surface text-ink-soft hover:bg-surface-2",
                )}
              >
                {language.native}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
