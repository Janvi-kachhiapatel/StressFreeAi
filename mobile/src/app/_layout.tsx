import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import { Onboarding } from "@/components/Onboarding";
import { ProfileProvider, useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";

/** Nothing is usable before consent, and nothing flashes before storage is read. */
function Gate({ children }: { children: ReactNode }) {
  const { ready, profile } = useProfile();
  const theme = useTheme();

  if (!ready) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.bg }}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (!profile.consentedAt) return <Onboarding />;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <StatusBar style="auto" />
        <Gate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </Gate>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
