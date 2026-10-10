import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Chip, Heading } from "@/components/ui";
import { useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";
import { LANGUAGES, type Language } from "@/lib/types";

/**
 * Consent gate.
 *
 * Two questions and one checkbox, because the thing being consented to matters:
 * this is an AI companion with hard limits, and saying so before the first
 * message is what separates it from a product that implies it is a therapist.
 */
export function Onboarding() {
  const { dict, profile, update } = useProfile();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [language, setLanguageState] = useState<Language>(profile.language);
  const [isMinor, setIsMinor] = useState<boolean | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function finish() {
    if (!consent) {
      setError(dict.onboarding.consentRequired);
      return;
    }
    update({
      consentedAt: new Date().toISOString(),
      language,
      isMinor: isMinor === true,
      memoryEnabled: isMinor === true ? false : true,
    });
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 32,
        gap: 18,
      }}
    >
      <Heading level="h1">{dict.onboarding.title}</Heading>
      <Text style={{ color: theme.inkSoft, fontSize: 15, lineHeight: 22 }}>
        {dict.onboarding.intro}
      </Text>

      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.ink, fontSize: 15, fontWeight: "600" }}>
          {dict.onboarding.languageQuestion}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {LANGUAGES.map((option) => (
            <Chip
              key={option.code}
              label={option.native}
              active={language === option.code}
              onPress={() => setLanguageState(option.code)}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: theme.ink, fontSize: 15, fontWeight: "600" }}>
          {dict.onboarding.ageQuestion}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Chip
            label={dict.onboarding.ageYes}
            active={isMinor === true}
            onPress={() => setIsMinor(true)}
          />
          <Chip
            label={dict.onboarding.ageNo}
            active={isMinor === false}
            onPress={() => setIsMinor(false)}
          />
        </View>
        {isMinor === true && (
          <Card tone="accent">
            <Text style={{ color: theme.accent, fontSize: 13, lineHeight: 20 }}>
              {dict.onboarding.minorNote}
            </Text>
          </Card>
        )}
      </View>

      <Pressable
        onPress={() => {
          setConsent((value) => !value);
          setError(null);
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consent }}
        style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: consent ? theme.accent : theme.line,
            backgroundColor: consent ? theme.accent : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1,
          }}
        >
          {consent && <Text style={{ color: theme.accentInk, fontSize: 13, fontWeight: "700" }}>✓</Text>}
        </View>
        <Text style={{ color: theme.ink, fontSize: 14, lineHeight: 21, flex: 1 }}>
          {dict.onboarding.consentLabel}
        </Text>
      </Pressable>

      {error && <Text style={{ color: theme.danger, fontSize: 14 }}>{error}</Text>}

      <Button label={dict.onboarding.start} onPress={finish} disabled={isMinor === null} />
    </ScrollView>
  );
}
