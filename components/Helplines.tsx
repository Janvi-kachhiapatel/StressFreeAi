"use client";

import { HELPLINES, helplineById, type Helpline } from "@/lib/helplines";
import { Card, Pill, cx } from "@/components/ui";

function HelplineCard({ line, prominent = false }: { line: Helpline; prominent?: boolean }) {
  return (
    <Card tone={prominent ? "accent" : "plain"} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={cx("font-semibold", prominent ? "text-accent" : "text-ink")}>{line.name}</h3>
        {line.official && <Pill tone="accent">Government</Pill>}
        <Pill>{line.hours}</Pill>
      </div>

      <p className="text-sm text-ink-soft">{line.who}</p>
      <p className="text-xs text-ink-faint">Languages: {line.languages}</p>

      {line.numbers.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {line.numbers.map((number) => (
            <a
              key={number.dial}
              href={`tel:${number.dial}`}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
                prominent
                  ? "bg-accent text-accent-ink hover:opacity-90"
                  : "border border-line bg-surface hover:bg-surface-2",
              )}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path
                  d="M4 5c0-.6.4-1 1-1h2.5c.5 0 .9.3 1 .8l.7 3c.1.4 0 .8-.4 1L7 10c1 2.5 3.5 5 6 6l1.2-1.8c.2-.3.6-.5 1-.4l3 .7c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1A13 13 0 0 1 4 6V5Z"
                  strokeLinecap="round"
                />
              </svg>
              Call {number.display}
            </a>
          ))}
        </div>
      )}

      {line.url && (
        <a
          href={line.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block pt-1 text-sm text-accent underline decoration-accent/40 underline-offset-4"
        >
          Open website
        </a>
      )}

      {line.note && <p className="text-xs text-ink-faint">{line.note}</p>}
    </Card>
  );
}

/** Renders a specific set of helplines, in the order given. */
export function HelplineList({ ids }: { ids: string[] }) {
  const lines = ids.map(helplineById).filter((line): line is Helpline => Boolean(line));
  if (lines.length === 0) return null;
  return (
    <div className="grid gap-3">
      {lines.map((line, index) => (
        <HelplineCard key={line.id} line={line} prominent={index === 0} />
      ))}
    </div>
  );
}

/** Full list, grouped by region. Used on the safety page. */
export function AllHelplines() {
  const india = HELPLINES.filter((line) => line.region === "IN");
  const global = HELPLINES.filter((line) => line.region === "GLOBAL");
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {india.map((line) => (
          <HelplineCard key={line.id} line={line} prominent={line.id === "tele-manas"} />
        ))}
      </div>
      <div className="grid gap-3">
        {global.map((line) => (
          <HelplineCard key={line.id} line={line} />
        ))}
      </div>
    </div>
  );
}
