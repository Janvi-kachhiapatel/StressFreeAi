import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { HelplineCard } from "@/components/HelplineCard";
import { Button, Card, Chip, Heading } from "@/components/ui";
import { useProfile } from "@/lib/profile";
import { loadHelplines, type ResourceSource } from "@/lib/resources";
import { useTheme } from "@/lib/theme";
import { LANGUAGES, type Helpline } from "@/lib/types";

export default function SafetyScreen() {
  const { dict, profile, update, erase } = useProfile();
  const theme = useTheme();

  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [source, setSource] = useState<ResourceSource>("offline");
  const [confirmErase, setConfirmErase] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadHelplines().then((result) => {
      if (cancelled) return;
      setHelplines(result.helplines);
      setSource(result.source);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceNote =
    source === "server"
      ? dict.safety.sourceServer
      : source === "cache"
        ? dict.safety.sourceCache
        : dict.safety.sourceOffline;

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Heading level="h1">{dict.safety.title}</Heading>
      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>{dict.safety.subtitle}</Text>

      <Card>
        <Heading>{dict.safety.limitsTitle}</Heading>
        {dict.safety.limits.map((limit) => (
          <Text key={limit} style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>
            · {limit}
          </Text>
        ))}
      </Card>

      <View style={{ gap: 12 }}>
        <Heading>{dict.safety.helplinesTitle}</Heading>
        <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>
          {dict.safety.helplinesNote}
        </Text>
        <Text style={{ color: source === "server" ? theme.inkFaint : theme.warn, fontSize: 12 }}>
          {sourceNote}
        </Text>
        {helplines.map((line, index) => (
          <HelplineCard key={line.id} line={line} prominent={index === 0} />
        ))}
      </View>

      <Card>
        <Heading>{dict.safety.settingsTitle}</Heading>

        <View style={{ gap: 8 }}>
          <Text style={{ color: theme.ink, fontSize: 14, fontWeight: "600" }}>
            {dict.safety.language}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {LANGUAGES.map((option) => (
              <Chip
                key={option.code}
                label={option.native}
                active={profile.language === option.code}
                onPress={() => update({ language: option.code })}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: theme.ink, fontSize: 14, fontWeight: "600" }}>
            {dict.safety.memory}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Chip
              label={dict.safety.memoryOn}
              active={profile.memoryEnabled && !profile.isMinor}
              onPress={() => !profile.isMinor && update({ memoryEnabled: true })}
            />
            <Chip
              label={dict.safety.memoryOff}
              active={!profile.memoryEnabled}
              onPress={() => update({ memoryEnabled: false })}
            />
          </View>
          {profile.isMinor && (
            <Text style={{ color: theme.warn, fontSize: 13, lineHeight: 19 }}>
              {dict.onboarding.minorNote}
            </Text>
          )}
        </View>

        {done && <Text style={{ color: theme.accent, fontSize: 14 }}>{done}</Text>}
      </Card>

      <Card tone="danger">
        <Heading>{dict.safety.eraseTitle}</Heading>
        <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>
          {dict.safety.eraseBody}
        </Text>
        <Button
          label={confirmErase ? dict.safety.confirmErase : dict.safety.eraseButton}
          variant="danger"
          onPress={() => {
            if (!confirmErase) {
              setConfirmErase(true);
              setTimeout(() => setConfirmErase(false), 4000);
              return;
            }
            setConfirmErase(false);
            void erase().then(() => setDone(dict.safety.erased));
          }}
        />
        <Text style={{ color: theme.inkFaint, fontSize: 12 }}>{dict.chat.eraseHint}</Text>
      </Card>
    </ScrollView>
  );
}
