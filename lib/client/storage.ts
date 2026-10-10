"use client";

/**
 * Client-side persistence.
 *
 * Default posture: chat content lives in the user's own browser, not in a
 * database. Only the current message plus a short trimmed history is sent to
 * the server to generate a reply, and that request is not logged with content.
 *
 * Consequences to be honest about in the UI:
 *  - clearing browser data deletes everything, and we cannot recover it
 *  - messages cross the network while a reply is generated
 *  - a shared device can read the history, so offer "delete everything"
 *
 * When memory is switched off, nothing is written at all except the profile
 * itself (which is what makes the app usable on a shared device).
 */

import { notifyStorageChanged } from "@/lib/client/store";
import type {
  ChatMessage,
  ExamPlan,
  Goal,
  MoodEntry,
  TrustedContact,
  UserProfile,
} from "@/lib/types";

const KEYS = {
  profile: "stressfree.profile.v1",
  messages: "stressfree.messages.v1",
  moods: "stressfree.moods.v1",
  contacts: "stressfree.contacts.v1",
  journal: "stressfree.journal.v1",
  plan: "stressfree.plan.v1",
  goals: "stressfree.goals.v1",
} as const;

const MAX_STORED_MESSAGES = 200;

function hasWindow(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode: fail quietly rather than breaking the chat.
  }
  // Tell useStored-based components that the snapshot is stale.
  notifyStorageChanged();
}

function remove(key: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  notifyStorageChanged();
}

export const DEFAULT_PROFILE: UserProfile = {
  consentedAt: null,
  ageBand: null,
  isMinor: false,
  language: "en",
  preferredNeed: null,
  selfNotes: [],
  memoryEnabled: true,
};

export function loadProfile(): UserProfile | null {
  const stored = read<UserProfile | null>(KEYS.profile, null);
  if (!stored) return null;
  return { ...DEFAULT_PROFILE, ...stored };
}

export function saveProfile(profile: UserProfile): void {
  write(KEYS.profile, profile);
}

export function loadMessages(): ChatMessage[] {
  return read<ChatMessage[]>(KEYS.messages, []);
}

export function saveMessages(messages: ChatMessage[], memoryEnabled: boolean): void {
  if (!memoryEnabled) return;
  write(KEYS.messages, messages.slice(-MAX_STORED_MESSAGES));
}

export function loadMoods(): MoodEntry[] {
  return read<MoodEntry[]>(KEYS.moods, []);
}

export function saveMoods(moods: MoodEntry[], memoryEnabled: boolean): void {
  if (!memoryEnabled) return;
  write(KEYS.moods, moods.slice(-180));
}

export function loadContacts(): TrustedContact[] {
  return read<TrustedContact[]>(KEYS.contacts, []);
}

export function saveContacts(contacts: TrustedContact[]): void {
  write(KEYS.contacts, contacts);
}

export interface JournalLine {
  id: string;
  at: string;
  text: string;
}

export function loadJournal(): JournalLine[] {
  return read<JournalLine[]>(KEYS.journal, []);
}

export function saveJournal(lines: JournalLine[], memoryEnabled: boolean): void {
  if (!memoryEnabled) return;
  write(KEYS.journal, lines.slice(-200));
}

export function loadPlan(): ExamPlan | null {
  return read<ExamPlan | null>(KEYS.plan, null);
}

/** Passing null clears the plan; otherwise memory must be on to persist it. */
export function savePlan(plan: ExamPlan | null, memoryEnabled: boolean): void {
  if (!plan) {
    remove(KEYS.plan);
    return;
  }
  if (!memoryEnabled) return;
  write(KEYS.plan, plan);
}

export function loadGoals(): Goal[] {
  return read<Goal[]>(KEYS.goals, []);
}

export function saveGoals(goals: Goal[], memoryEnabled: boolean): void {
  if (!memoryEnabled) return;
  write(KEYS.goals, goals.slice(0, 3));
}

export function deleteConversation(memoryEnabled: boolean): void {
  remove(KEYS.messages);
  remove(KEYS.moods);
  void memoryEnabled;
}

/** Wipes everything this app has ever stored in the browser. */
export function eraseEverything(): void {
  Object.values(KEYS).forEach((key) => remove(key));
}

export function exportAll(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: "StressFree AI",
      note: "This file contains everything this app stored in your browser. Keep it somewhere private.",
      profile: loadProfile(),
      messages: loadMessages(),
      moods: loadMoods(),
      contacts: loadContacts(),
      journal: loadJournal(),
      studyPlan: loadPlan(),
      goals: loadGoals(),
    },
    null,
    2,
  );
}

export function countStored(): {
  messages: number;
  moods: number;
  contacts: number;
  journal: number;
} {
  return {
    messages: loadMessages().length,
    moods: loadMoods().length,
    contacts: loadContacts().length,
    journal: loadJournal().length,
  };
}
