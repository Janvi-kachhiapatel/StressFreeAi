import { Linking, Pressable, Text, View } from "react-native";
import { Card, Pill } from "@/components/ui";
import { useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";
import type { Helpline } from "@/lib/types";

export function HelplineCard({ line, prominent = false }: { line: Helpline; prominent?: boolean }) {
  const theme = useTheme();
  const { dict } = useProfile();

  return (
    <Card tone={prominent ? "accent" : "plain"}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <Text
          style={{
            color: prominent ? theme.accent : theme.ink,
            fontSize: 16,
            fontWeight: "700",
            flexShrink: 1,
          }}
        >
          {line.name}
        </Text>
        {line.official && <Pill label="Government" tone="accent" />}
      </View>

      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 20 }}>{line.who}</Text>
      <Text style={{ color: theme.inkFaint, fontSize: 12 }}>
        {line.hours} · {line.languages}
      </Text>

      {line.numbers.map((number) => (
        <Pressable
          key={number.dial}
          onPress={() => void Linking.openURL(`tel:${number.dial}`)}
          accessibilityRole="button"
          style={({ pressed }) => ({
            backgroundColor: prominent ? theme.accent : theme.surface2,
            borderColor: prominent ? theme.accent : theme.line,
            borderWidth: 1,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              color: prominent ? theme.accentInk : theme.ink,
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            {dict.crisis.callNow} · {number.display}
          </Text>
        </Pressable>
      ))}

      {line.url && (
        <Pressable onPress={() => void Linking.openURL(line.url as string)} accessibilityRole="link">
          <Text style={{ color: theme.accent, fontSize: 14, textDecorationLine: "underline" }}>
            {line.url}
          </Text>
        </Pressable>
      )}

      {line.note && (
        <Text style={{ color: theme.inkFaint, fontSize: 12, lineHeight: 18 }}>{line.note}</Text>
      )}
    </Card>
  );
}
