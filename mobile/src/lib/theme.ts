import { useColorScheme } from "react-native";

/**
 * The same palette as the web app, so the two feel like one product.
 * Calm and low-stimulation on purpose: this gets read at 2am on a phone.
 */
export interface Theme {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  line: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  warn: string;
  warnSoft: string;
  danger: string;
  dangerSoft: string;
  white: string;
}

const light: Theme = {
  bg: "#f7f5f2",
  surface: "#ffffff",
  surface2: "#f1eee9",
  ink: "#221f1c",
  inkSoft: "#5c5650",
  inkFaint: "#8a8279",
  line: "#e2ddd5",
  accent: "#1f6f68",
  accentInk: "#ffffff",
  accentSoft: "#e3f0ee",
  warn: "#a25a12",
  warnSoft: "#fdf1e3",
  danger: "#a8322d",
  dangerSoft: "#fdeceb",
  white: "#ffffff",
};

const dark: Theme = {
  bg: "#14161a",
  surface: "#1c1f24",
  surface2: "#23272d",
  ink: "#eceef0",
  inkSoft: "#b3b8bf",
  inkFaint: "#858b93",
  line: "#2e333a",
  accent: "#6fc7bd",
  accentInk: "#10201e",
  accentSoft: "#1d2f2d",
  warn: "#e0a464",
  warnSoft: "#2b2318",
  danger: "#ef837d",
  dangerSoft: "#2e1d1c",
  white: "#ffffff",
};

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}
