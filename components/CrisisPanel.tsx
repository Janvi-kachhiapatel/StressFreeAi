"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { HelplineList } from "@/components/Helplines";
import { BreathingExercise, GroundingSteps } from "@/components/Grounding";
import { Button, Card, Pill } from "@/components/ui";
import { guardianNotice } from "@/lib/safety/crisis";

/**
 * Shown whenever the safety layer decides risk is present, and reachable at any
 * time from the chat composer. It never hides the helplines behind a scroll:
 * the first card is always a big tap target.
 */
export function CrisisPanel({
  resourceIds,
  onClose,
  onTalk,
}: {
  resourceIds: string[];
  onClose: () => void;
  onTalk: () => void;
}) {
  const { dict, profile, language } = useApp();
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [showTools, setShowTools] = useState(false);
  const isMinor = profile.isMinor || profile.ageBand === "teen";

  // Escape and a backdrop tap both just dismiss the panel. The helplines stay
  // one tap away in the composer and in the footer, so nothing is lost.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-bg p-5 sm:rounded-3xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id="crisis-title" className="text-lg font-semibold text-ink sm:text-xl">
              {dict.crisis.title}
            </h2>
            <p className="max-w-prose text-sm text-ink-soft">{dict.crisis.subtitle}</p>
          </div>
          {isMinor && <Pill tone="warn">{dict.onboarding.ageTeen}</Pill>}
        </div>

        {isMinor && (
          <Card tone="warn" className="mb-4">
            <p className="text-sm text-warn">{guardianNotice(language)}</p>
          </Card>
        )}

        {/* The safety check comes first: one direct question, two clear answers. */}
        <Card tone="accent" className="mb-4 space-y-3">
          <p className="text-sm font-medium text-ink">{dict.crisis.checkQuestion}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant={answer === "yes" ? "danger" : "quiet"} onClick={() => setAnswer("yes")}>
              {dict.crisis.checkYes}
            </Button>
            <Button variant={answer === "no" ? "primary" : "quiet"} onClick={() => setAnswer("no")}>
              {dict.crisis.checkNo}
            </Button>
          </div>
          {answer === "yes" && (
            <p className="text-sm text-danger">
              <a className="font-semibold underline underline-offset-4" href="tel:112">
                {dict.crisis.callNow}: 112
              </a>{" "}
              — {dict.crisis.checkYesReply}
            </p>
          )}
          {answer === "no" && <p className="text-sm text-accent">{dict.crisis.checkNoReply}</p>}
        </Card>

        <HelplineList ids={resourceIds} />

        {isMinor && <p className="mt-3 text-sm text-warn">{dict.crisis.minorsLine}</p>}

        <div className="mt-5 space-y-3">
          {showTools ? (
            <div className="space-y-3">
              <BreathingExercise />
              <GroundingSteps />
            </div>
          ) : (
            <Button variant="quiet" onClick={() => setShowTools(true)} className="w-full">
              {dict.crisis.openTools}
            </Button>
          )}

          <Button onClick={onTalk} className="w-full">
            {dict.crisis.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
