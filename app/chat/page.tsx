"use client";

import { useApp } from "@/components/AppProvider";
import { ChatScreen } from "@/components/ChatScreen";
import { Onboarding } from "@/components/Onboarding";

export default function ChatPage() {
  const { ready, needsOnboarding } = useApp();

  return (
    <>
      {needsOnboarding && <Onboarding />}
      {ready ? (
        <ChatScreen />
      ) : (
        <div className="mx-auto w-full max-w-3xl px-4 py-10 text-sm text-ink-faint">
          Getting things ready…
        </div>
      )}
    </>
  );
}
