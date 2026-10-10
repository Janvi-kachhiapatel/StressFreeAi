"use client";

import { useApp } from "@/components/AppProvider";
import { PrivacyPanel } from "@/components/PrivacyPanel";
import { Card, SectionHeading } from "@/components/ui";

export default function PrivacyPage() {
  const { dict } = useApp();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{dict.privacy.title}</h1>
        <p className="max-w-2xl text-sm text-ink-soft">{dict.privacy.subtitle}</p>
      </div>

      <div className="space-y-6">
        <Card className="space-y-3">
          <SectionHeading as="h2">The short version</SectionHeading>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>· Your chats and moods are stored in your browser, not in our database.</li>
            <li>
              · When you send a message, that text (plus the last few turns) goes to the AI model
              provider to generate a reply. It is not attached to your name, and there is no
              account to attach it to.
            </li>
            <li>
              · You can export everything as a JSON file, delete the conversation, or erase
              everything, at any time, with no email or request needed.
            </li>
            <li>
              · We do not use your messages for advertising, we do not sell data, and there are no
              third-party trackers or analytics scripts in this app.
            </li>
            <li>
              · Safety metrics are counted without content: how many crisis paths were triggered,
              never what was written.
            </li>
          </ul>
        </Card>

        <PrivacyPanel />

        <Card className="space-y-3">
          <SectionHeading as="h2">If you build on this</SectionHeading>
          <p className="text-sm text-ink-soft">
            Under India&apos;s DPDP Act, 2023 you must give a clear notice of what is collected and
            why, take free and specific consent, allow erasure, and obtain verifiable parental
            consent before processing the data of anyone under 18 — including not tracking or
            behaviourally monitoring children. This app satisfies the easy parts by not storing
            personal data centrally at all. If you later add accounts, a database or analytics, that
            is when the obligations become real, and a privacy policy plus a grievance officer
            become mandatory.
          </p>
        </Card>
      </div>
    </div>
  );
}
