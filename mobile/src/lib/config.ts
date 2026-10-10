/**
 * Where the chat API lives.
 *
 * Expo inlines `EXPO_PUBLIC_*` at build time, so this is a plain constant, not a
 * secret. No model API key ever reaches the app: the server owns that, and it
 * also owns the safety layer.
 */
export const API_BASE = (process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
