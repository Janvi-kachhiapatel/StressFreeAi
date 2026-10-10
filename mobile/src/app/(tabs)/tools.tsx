import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Card, Heading, Pill } from "@/components/ui";
import { useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";

/** 4-4-6-2: the long exhale is the part that settles the nervous system. */
const PHASES = [
  { key: "in", seconds: 4 },
  { key: "hold", seconds: 4 },
  { key: "out", seconds: 6 },
  { key: "rest", seconds: 2 },
] as const;

const CYCLE_SECONDS = PHASES.reduce((total, phase) => total + phase.seconds, 0);

function BreathingExercise() {
  const { dict } = useProfile();
  const theme = useTheme();
  const [running, setRunning] = useState(false);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTicks((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Phase is derived from a single counter, so nothing ever has to reset state.
  const position = ticks % CYCLE_SECONDS;
  let elapsed = 0;
  let phaseIndex = 0;
  for (let index = 0; index < PHASES.length; index += 1) {
    if (position < elapsed + PHASES[index].seconds) {
      phaseIndex = index;
      break;
    }
    elapsed += PHASES[index].seconds;
  }
  const phase = PHASES[phaseIndex];
  const remaining = elapsed + phase.seconds - position;
  const rounds = Math.floor(ticks / CYCLE_SECONDS);

  const labels: Record<(typeof PHASES)[number]["key"], string> = {
    in: dict.tools.breatheIn,
    hold: dict.tools.hold,
    out: dict.tools.breatheOut,
    rest: dict.tools.hold,
  };

  return (
    <Card>
      <Heading>{dict.tools.breathing}</Heading>
      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>
        {dict.tools.breathingNote}
      </Text>

      <View style={{ alignItems: "center", gap: 12, paddingVertical: 8 }}>
        <View
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            borderWidth: 1,
            borderColor: theme.accent,
            backgroundColor: theme.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: theme.accent, fontSize: 13, fontWeight: "600" }}>
            {running ? labels[phase.key] : dict.tools.breathing}
          </Text>
          <Text style={{ color: theme.ink, fontSize: 34, fontVariant: ["tabular-nums"] }}>
            {running ? remaining : "—"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Button
            label={running ? dict.common.stop : dict.common.start}
            onPress={() => {
              setTicks(0);
              setRunning((value) => !value);
            }}
          />
          <Pill label={`${rounds} ${dict.tools.round}`} tone="accent" />
        </View>
      </View>
    </Card>
  );
}

function GroundingSteps() {
  const { dict } = useProfile();
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const done = index >= dict.tools.steps.length;

  return (
    <Card>
      <Heading>{dict.tools.grounding}</Heading>
      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>
        {dict.tools.groundingNote}
      </Text>

      {done ? (
        <View style={{ gap: 10 }}>
          <Text style={{ color: theme.accent, fontSize: 15 }}>{dict.tools.done}</Text>
          <Button label={dict.common.reset} variant="quiet" onPress={() => setIndex(0)} />
        </View>
      ) : (
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {dict.tools.steps.map((_, stepIndex) => (
              <View
                key={stepIndex}
                style={{
                  flex: 1,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: stepIndex <= index ? theme.accent : theme.line,
                }}
              />
            ))}
          </View>

          <Pressable onPress={() => setIndex((value) => value + 1)} accessibilityRole="button">
            <Text style={{ color: theme.ink, fontSize: 18, fontWeight: "600" }}>
              {dict.tools.steps[index]}
            </Text>
          </Pressable>

          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Button
              label={
                index === dict.tools.steps.length - 1 ? dict.tools.finish : dict.common.next
              }
              onPress={() => setIndex((value) => value + 1)}
            />
            <Pressable onPress={() => setIndex(dict.tools.steps.length)} accessibilityRole="button">
              <Text style={{ color: theme.inkFaint, fontSize: 14, textDecorationLine: "underline" }}>
                {dict.common.close}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Card>
  );
}

export default function ToolsScreen() {
  const { dict } = useProfile();
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Heading level="h1">{dict.tools.title}</Heading>
      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 21 }}>{dict.tools.subtitle}</Text>

      <BreathingExercise />
      <GroundingSteps />
    </ScrollView>
  );
}
