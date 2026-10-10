import type { ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/lib/theme";

export function Card({
  children,
  tone = "plain",
  style,
}: {
  children: ReactNode;
  tone?: "plain" | "accent" | "danger";
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const tones = {
    plain: { backgroundColor: theme.surface, borderColor: theme.line },
    accent: { backgroundColor: theme.accentSoft, borderColor: theme.accent },
    danger: { backgroundColor: theme.dangerSoft, borderColor: theme.danger },
  } as const;

  return (
    <View
      style={[
        {
          borderRadius: 18,
          borderWidth: 1,
          padding: 16,
          gap: 10,
        },
        tones[tone],
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Heading({ children, level = "h2" }: { children: ReactNode; level?: "h1" | "h2" }) {
  const theme = useTheme();
  return (
    <Text
      style={{
        color: theme.ink,
        fontSize: level === "h1" ? 24 : 18,
        fontWeight: "700",
      }}
    >
      {children}
    </Text>
  );
}

export function Body({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>{children}</Text>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "quiet" | "danger";
  disabled?: boolean;
}) {
  const theme = useTheme();
  const variants = {
    primary: { backgroundColor: theme.accent, color: theme.accentInk, borderColor: theme.accent },
    quiet: { backgroundColor: theme.surface, color: theme.ink, borderColor: theme.line },
    danger: { backgroundColor: theme.danger, color: theme.white, borderColor: theme.danger },
  } as const;
  const chosen = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: chosen.backgroundColor,
        borderColor: chosen.borderColor,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignItems: "center",
        opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
      })}
    >
      <Text style={{ color: chosen.color, fontSize: 15, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: active ? theme.accentSoft : theme.surface,
        borderColor: active ? theme.accent : theme.line,
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text style={{ color: active ? theme.accent : theme.inkSoft, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

export function Pill({
  label,
  tone = "plain",
}: {
  label: string;
  tone?: "plain" | "accent" | "warn" | "danger";
}) {
  const theme = useTheme();
  const tones = {
    plain: { backgroundColor: theme.surface2, color: theme.inkSoft, borderColor: theme.line },
    accent: { backgroundColor: theme.accentSoft, color: theme.accent, borderColor: theme.accent },
    warn: { backgroundColor: theme.warnSoft, color: theme.warn, borderColor: theme.warn },
    danger: { backgroundColor: theme.dangerSoft, color: theme.danger, borderColor: theme.danger },
  } as const;
  const chosen = tones[tone];

  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: chosen.backgroundColor,
        borderColor: chosen.borderColor,
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 3,
        paddingHorizontal: 10,
      }}
    >
      <Text style={{ color: chosen.color, fontSize: 12, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}
