"use client";

/**
 * A tiny external store over localStorage.
 *
 * Reading persisted data on mount with `useEffect` + `setState` causes a
 * cascading second render and is flagged by the React compiler lint rules. The
 * sanctioned pattern for "state that lives outside React" is
 * `useSyncExternalStore`: the server renders the empty snapshot, React swaps in
 * the real snapshot right after hydration, and every write notifies subscribers.
 *
 * Snapshots are cached per version so `getSnapshot` returns a stable reference -
 * without that cache React would re-render forever.
 */

import { useSyncExternalStore } from "react";

let version = 0;
const cache = new Map<string, { version: number; value: unknown }>();
const listeners = new Set<() => void>();

/** Called by every writer in lib/client/storage.ts. */
export function notifyStorageChanged(): void {
  version += 1;
  cache.clear();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStored<T>(key: string, read: () => T, serverValue: T): T {
  const getSnapshot = (): T => {
    const hit = cache.get(key);
    if (hit && hit.version === version) return hit.value as T;
    const value = read();
    cache.set(key, { version, value });
    return value;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}

/**
 * False during SSR and the first hydration render, true afterwards. Used to
 * avoid rendering consent-gated UI before the stored profile is actually known.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
