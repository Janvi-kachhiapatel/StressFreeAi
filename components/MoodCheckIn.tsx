"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Button, Card, Chip, SectionHeading } from "@/components/ui";
import { loadMoods, saveMoods } from "@/lib/client/storage";
import { useStored } from "@/lib/client/store";
import type { MoodEntry } from "@/lib/types";

const SCORES = [
  { score: 1, key: "terrible" },
  { score: 2, key: "low" },
  { score: 3, key: "okay" },
  { score: 4, key: "good" },
  { score: 5, key: "great" },
] as const;

const TAGS = [
  { id: "study", key: "tagStudy" },
  { id: "work", key: "tagWork" },
  { id: "money", key: "tagMoney" },
  { id: "people", key: "tagPeople" },
  { id: "body", key: "tagBody" },
  { id: "family", key: "tagFamily" },
  { id: "nothing", key: "tagNothing" },
] as const;

const EMPTY_MOODS: MoodEntry[] = [];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_TAGS: string[] = [];

export function MoodCheckIn() {
  const { dict, profile } = useApp();
  const moods = useStored<MoodEntry[]>("moods", loadMoods, EMPTY_MOODS);

  // Today's existing check-in is the baseline; the local state holds only edits,
  // so there is no need to copy storage into state on mount.
  const existing = moods.find((entry) => entry.date === todayKey()) ?? null;

  const [scoreEdit, setScoreEdit] = useState<number | null | undefined>(undefined);
  const [tagsEdit, setTagsEdit] = useState<string[] | undefined>(undefined);
  const [noteEdit, setNoteEdit] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  const score = scoreEdit !== undefined ? scoreEdit : (existing?.score ?? null);
  const tags = tagsEdit ?? existing?.tags ?? EMPTY_TAGS;
  const note = noteEdit ?? existing?.note ?? "";

  function save() {
    if (!score) return;
    const entry: MoodEntry = {
      date: todayKey(),
      score,
      tags,
      note: note.trim() || undefined,
    };
    const next = [...moods.filter((item) => item.date !== entry.date), entry].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    saveMoods(next, profile.memoryEnabled);
    setSaved(true);
  }

  const recent = moods.slice(-14);
  const average =
    recent.length > 0
      ? (recent.reduce((total, entry) => total + entry.score, 0) / recent.length).toFixed(1)
      : "—";

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <SectionHeading as="h4">{dict.mood.title}</SectionHeading>
        <p className="text-sm text-ink-soft">{dict.mood.how}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCORES.map((option) => (
          <Chip
            key={option.score}
            tone={score === option.score ? "accent" : "plain"}
            onClick={() => {
              setScoreEdit(option.score);
              setSaved(false);
            }}
          >
            {option.score} · {dict.mood[option.key]}
          </Chip>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-ink-soft">{dict.mood.tags}</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <Chip
              key={tag.id}
              tone={tags.includes(tag.id) ? "accent" : "plain"}
              onClick={() =>
                setTagsEdit((previous) => {
                  const base = previous ?? existing?.tags ?? [];
                  return base.includes(tag.id)
                    ? base.filter((id) => id !== tag.id)
                    : [...base, tag.id];
                })
              }
            >
              {dict.mood[tag.key]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-ink-soft" htmlFor="mood-note">
          {dict.mood.note} ({dict.common.optional})
        </label>
        <input
          id="mood-note"
          value={note}
          onChange={(event) => setNoteEdit(event.target.value)}
          maxLength={200}
          className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={!score}>
          {dict.mood.save}
        </Button>
        {saved && <span className="text-xs text-accent">{dict.mood.saved}</span>}
      </div>

      <div className="space-y-2 border-t border-line pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-soft">{dict.mood.trend}</p>
          <p className="text-xs text-ink-faint">
            {dict.mood.average}: {average}
          </p>
        </div>
        {recent.length === 0 ? (
          <p className="text-xs text-ink-faint">{dict.mood.empty}</p>
        ) : (
          <div className="flex items-end gap-1" aria-hidden>
            {recent.map((entry) => (
              <span
                key={entry.date}
                title={`${entry.date}: ${entry.score}/5`}
                className="w-4 rounded-t bg-accent/70"
                style={{ height: `${entry.score * 8}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
