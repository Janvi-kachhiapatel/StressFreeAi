import type { MetadataRoute } from "next";

/**
 * Installability matters here: the React Native app is a later step, and a PWA
 * gives Android and iOS users a home-screen icon in the meantime.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StressFree AI",
    short_name: "StressFree",
    description:
      "A private, supportive AI companion for heavy days. Listen, one small step, real human help when needed.",
    start_url: "/chat",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f5f2",
    theme_color: "#1f6f68",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
