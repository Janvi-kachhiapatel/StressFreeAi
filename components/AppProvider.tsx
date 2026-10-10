"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { t, type Dict } from "@/lib/i18n";
import { DEFAULT_PROFILE, deleteConversation, loadProfile, saveProfile } from "@/lib/client/storage";
import { useHydrated, useStored } from "@/lib/client/store";
import type { Language, UserProfile } from "@/lib/types";

export interface ProviderStatus {
  label: string;
  model: string;
  demo: boolean;
  /** True until /api/status answers, so the UI does not flash a wrong badge. */
  loading: boolean;
}

interface AppContextValue {
  /** False until the stored profile has been read on the client. */
  ready: boolean;
  profile: UserProfile;
  dict: Dict;
  language: Language;
  needsOnboarding: boolean;
  status: ProviderStatus;
  updateProfile: (patch: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Snapshot of the profile from localStorage. On the server this is null, so
  // React swaps in the real value immediately after hydration.
  const storedProfile = useStored<UserProfile | null>("profile", loadProfile, null);
  const hydrated = useHydrated();
  const profile = storedProfile ?? DEFAULT_PROFILE;

  const [status, setStatus] = useState<ProviderStatus>({
    label: "Checking",
    model: "",
    demo: false,
    loading: true,
  });

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = profile.language;
  }, [profile.language, hydrated]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setStatus({
          label: data.provider?.label ?? "Unknown",
          model: data.provider?.model ?? "",
          demo: Boolean(data.demo),
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({ label: "Unavailable", model: "", demo: false, loading: false });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    const current = loadProfile() ?? DEFAULT_PROFILE;
    const next = { ...current, ...patch };
    saveProfile(next);

    if (next.memoryEnabled === false) {
      // Switching memory off must actually delete what was there, otherwise the
      // toggle is a lie.
      deleteConversation(false);
    }
  }, []);

  const resetProfile = useCallback(() => {
    saveProfile(DEFAULT_PROFILE);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready: hydrated,
      profile,
      dict: t(profile.language),
      language: profile.language,
      // Never gate on the server snapshot: it would flash the intro every load.
      needsOnboarding: hydrated && !profile.consentedAt,
      status,
      updateProfile,
      resetProfile,
    }),
    [hydrated, profile, status, updateProfile, resetProfile],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <AppProvider>");
  return context;
}
