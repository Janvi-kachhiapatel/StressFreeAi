"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Button, Card, Chip, SectionHeading } from "@/components/ui";
import { LANGUAGES, type AgeBand, type Language, type Need } from "@/lib/types";

const AGE_OPTIONS: { band: AgeBand; labelKey: "ageTeen" | "ageYoung" | "ageAdult" | "ageOlder"; minor: boolean }[] =
  [
    { band: "teen", labelKey: "ageTeen", minor: true },
    { band: "young", labelKey: "ageYoung", minor: false },
    { band: "adult", labelKey: "ageAdult", minor: false },
    { band: "older", labelKey: "ageOlder", minor: false },
  ];

const NEED_OPTIONS: { need: Need; labelKey: "needVent" | "needCalm" | "needSolve" | "needPlan" | "needDistract" | "needHuman" }[] =
  [
    { need: "vent", labelKey: "needVent" },
    { need: "calm", labelKey: "needCalm" },
    { need: "solve", labelKey: "needSolve" },
    { need: "plan", labelKey: "needPlan" },
    { need: "distract", labelKey: "needDistract" },
    { need: "human", labelKey: "needHuman" },
  ];

export function Onboarding() {
  const { dict, profile, updateProfile } = useApp();
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<Language>(profile.language);
  const [ageBand, setAgeBand] = useState<AgeBand | null>(profile.ageBand);
  const [consent, setConsent] = useState(false);
  const [need, setNeed] = useState<Need | null>(profile.preferredNeed);
  const [memoryEnabled, setMemoryEnabled] = useState(profile.memoryEnabled);
  const [error, setError] = useState<string | null>(null);

  const isMinor = ageBand === "teen";

  function finish() {
    if (!consent) {
      setError(dict.onboarding.consentRequired);
      return;
    }
    updateProfile({
      consentedAt: new Date().toISOString(),
      language,
      ageBand,
      isMinor,
      preferredNeed: need,
      // A guardian-aware mode for under-18s: keep nothing between sessions.
      memoryEnabled: isMinor ? false : memoryEnabled,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-line bg-bg p-5 sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2" aria-hidden>
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-accent" : "bg-line"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <SectionHeading as="h2">{dict.onboarding.welcome}</SectionHeading>
              <p className="text-sm text-ink-soft">{dict.onboarding.intro}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">{dict.onboarding.languageQuestion}</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((option) => (
                  <Chip
                    key={option.code}
                    tone={language === option.code ? "accent" : "plain"}
                    onClick={() => {
                      setLanguage(option.code);
                      updateProfile({ language: option.code });
                    }}
                  >
                    {option.native}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">{dict.onboarding.ageQuestion}</p>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((option) => (
                  <Chip
                    key={option.band}
                    tone={ageBand === option.band ? "accent" : "plain"}
                    onClick={() => setAgeBand(option.band)}
                  >
                    {dict.onboarding[option.labelKey]}
                  </Chip>
                ))}
              </div>
              {isMinor && (
                <Card tone="warn">
                  <p className="text-sm text-warn">{dict.onboarding.minorNotice}</p>
                </Card>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!ageBand}>
                {dict.common.next}
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <p className="mb-2 text-sm font-semibold text-accent">{dict.onboarding.whatItIs}</p>
                <ul className="space-y-1.5 text-sm text-ink-soft">
                  {dict.onboarding.whatItIsList.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Card>
              <Card tone="warn">
                <p className="mb-2 text-sm font-semibold text-warn">
                  {dict.onboarding.whatItIsNot}
                </p>
                <ul className="space-y-1.5 text-sm text-ink-soft">
                  {dict.onboarding.whatItIsNotList.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  setError(null);
                }}
                className="mt-0.5 h-5 w-5 accent-[var(--accent)]"
              />
              <span className="text-sm text-ink">{dict.onboarding.consentLabel}</span>
            </label>
            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex justify-between">
              <Button variant="quiet" onClick={() => setStep(0)}>
                {dict.common.back}
              </Button>
              <Button onClick={() => setStep(2)} disabled={!consent}>
                {dict.common.next}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <SectionHeading as="h2">{dict.onboarding.needQuestion}</SectionHeading>
              <p className="text-sm text-ink-soft">
                This is just a default. You can change it any time, and it never locks you into
                anything.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {NEED_OPTIONS.map((option) => (
                <Chip
                  key={option.need}
                  tone={need === option.need ? "accent" : "plain"}
                  onClick={() => setNeed(option.need)}
                >
                  {dict.onboarding[option.labelKey]}
                </Chip>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="quiet" onClick={() => setStep(1)}>
                {dict.common.back}
              </Button>
              <Button onClick={() => setStep(3)}>{dict.common.next}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <SectionHeading as="h2">{dict.onboarding.memoryQuestion}</SectionHeading>
              <p className="text-sm text-ink-soft">{dict.onboarding.memoryNote}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip
                tone={memoryEnabled && !isMinor ? "accent" : "plain"}
                onClick={() => !isMinor && setMemoryEnabled(true)}
              >
                {dict.onboarding.memoryOn}
              </Chip>
              <Chip
                tone={!memoryEnabled || isMinor ? "accent" : "plain"}
                onClick={() => setMemoryEnabled(false)}
              >
                {dict.onboarding.memoryOff}
              </Chip>
            </div>

            {isMinor && (
              <Card tone="warn">
                <p className="text-sm text-warn">{dict.onboarding.minorNotice}</p>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="quiet" onClick={() => setStep(2)}>
                {dict.common.back}
              </Button>
              <Button onClick={finish}>{dict.common.start}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
