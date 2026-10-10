"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Button, Card, SectionHeading } from "@/components/ui";
import { countStored, deleteConversation, eraseEverything, exportAll } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";

const EMPTY_COUNTS = { messages: 0, moods: 0, contacts: 0, journal: 0 };

export function PrivacyPanel() {
  const { dict, profile, updateProfile, resetProfile } = useApp();
  // Recomputed whenever anything in storage changes, because every writer notifies.
  const counts = useStored("counts", countStored, EMPTY_COUNTS);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmErase, setConfirmErase] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function download() {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `stressfree-ai-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.stored}</SectionHeading>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {[
            { label: dict.privacy.storedMessages, value: counts.messages },
            { label: dict.privacy.storedMoods, value: counts.moods },
            { label: dict.privacy.storedContacts, value: counts.contacts },
            { label: "Journal lines", value: counts.journal },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-surface-2 p-3">
              <dt className="text-xs text-ink-faint">{item.label}</dt>
              <dd className="font-mono text-lg text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-ink-faint">{dict.privacy.onDevice}</p>
      </Card>

      <Card className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.memory}</SectionHeading>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={profile.memoryEnabled ? "primary" : "quiet"}
            onClick={() => {
              updateProfile({ memoryEnabled: true });
              setDone("Memory is on. New chats will be kept in this browser.");
            }}
            disabled={profile.isMinor}
          >
            {dict.privacy.memoryOnLabel}
          </Button>
          <Button
            variant={!profile.memoryEnabled ? "primary" : "quiet"}
            onClick={() => {
              updateProfile({ memoryEnabled: false });
              setDone(
                "Memory is off. Chat history and mood check-ins were deleted from this browser.",
              );
            }}
          >
            {dict.privacy.memoryOffLabel}
          </Button>
        </div>
        {profile.isMinor && <p className="text-sm text-warn">{dict.onboarding.minorNotice}</p>}
        {done && <p className="text-sm text-accent">{done}</p>}
      </Card>

      <Card className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.exportTitle}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.privacy.exportBody}</p>
        <Button variant="quiet" onClick={download}>
          {dict.privacy.exportButton}
        </Button>
      </Card>

      <Card className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.deleteChats}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.privacy.deleteChatsBody}</p>
        <Button
          variant="warn"
          onClick={() => {
            if (!confirmDelete) {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 4000);
              return;
            }
            deleteConversation(profile.memoryEnabled);
            setConfirmDelete(false);
            setDone("Chat history deleted from this browser.");
          }}
        >
          {confirmDelete ? dict.privacy.confirmDelete : dict.privacy.deleteChatsButton}
        </Button>
      </Card>

      <Card tone="danger" className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.eraseAll}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.privacy.eraseAllBody}</p>
        <Button
          variant="danger"
          onClick={() => {
            if (!confirmErase) {
              setConfirmErase(true);
              setTimeout(() => setConfirmErase(false), 4000);
              return;
            }
            eraseEverything();
            resetProfile();
            setConfirmErase(false);
            setDone("Everything was erased. You will see the intro again next time.");
          }}
        >
          {confirmErase ? dict.privacy.confirmDelete : dict.privacy.eraseAllButton}
        </Button>
      </Card>

      <Card tone="warn" className="space-y-3">
        <SectionHeading as="h3">{dict.privacy.limits}</SectionHeading>
        <ul className="space-y-2 text-sm text-ink-soft">
          {dict.privacy.limitsList.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
