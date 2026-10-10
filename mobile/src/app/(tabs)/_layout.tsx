import { Tabs } from "expo-router";
import { useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";

export default function TabsLayout() {
  const { dict } = useProfile();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.ink,
        headerTitleStyle: { color: theme.ink },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.line },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.inkFaint,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: dict.tabs.talk }} />
      <Tabs.Screen name="tools" options={{ title: dict.tabs.tools }} />
      <Tabs.Screen name="safety" options={{ title: dict.tabs.safety }} />
    </Tabs>
  );
}
