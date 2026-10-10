import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StressFree AI — a companion for heavy days",
    template: "%s · StressFree AI",
  },
  description:
    "A private, supportive AI companion for exam stress, work pressure, loneliness and everything in between. It listens, helps you take one small step, and points you to free human help when you need it. Not a therapist.",
  applicationName: "StressFree AI",
  keywords: [
    "stress",
    "exam stress",
    "student mental health India",
    "emotional support",
    "Tele-MANAS",
    "wellbeing companion",
  ],
  openGraph: {
    title: "StressFree AI — a companion for heavy days",
    description:
      "Pause, understand what you feel, take one small step, and reach real human help when needed. Free, private, and honest about its limits.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#14161a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <AppProvider>
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
        </AppProvider>
      </body>
    </html>
  );
}
