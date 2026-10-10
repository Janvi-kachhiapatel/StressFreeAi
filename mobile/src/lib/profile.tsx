import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { t, type Dict } from "@/lib/i18n";
import { StorageKeys, eraseAll } from "@/lib/storage";
import type { Profile } from "@/lib/types";

export const DEFAULT_PROFILE: Profile = {
  consentedAt: null,
  language: "en",
  isMinor: false,
  memoryEnabled: true,
};

interface ProfileContextValue {
  /** False until the stored profile has been read, so the UI does not flash. */
  ready: boolean;
  profile: Profile;
  dict: Dict;
  update: (patch: Partial<Profile>) => void;
  erase: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(StorageKeys.profile)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as Partial<Profile>;
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((current) => {
      const next = { ...current, ...patch };
      // Under-18s keep nothing between sessions, so memory is forced off here
      // rather than relying on every screen to remember.
      if (patch.isMinor === true) next.memoryEnabled = false;
      AsyncStorage.setItem(StorageKeys.profile, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const erase = useCallback(async () => {
    await eraseAll();
    setProfile(DEFAULT_PROFILE);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ ready, profile, dict: t(profile.language), update, erase }),
    [ready, profile, update, erase],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside <ProfileProvider>");
  return context;
}
