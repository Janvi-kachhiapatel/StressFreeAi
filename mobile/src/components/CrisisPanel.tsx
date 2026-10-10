import { Linking, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HelplineCard } from "@/components/HelplineCard";
import { Button, Heading } from "@/components/ui";
import { useProfile } from "@/lib/profile";
import { useTheme } from "@/lib/theme";
import type { Helpline } from "@/lib/types";

/**
 * Shown when the server's safety layer says risk is present. It takes over the
 * screen on purpose: the priority stops being the conversation and becomes
 * getting a trained person on the line.
 */
export function CrisisPanel({
  visible,
  helplines,
  onClose,
}: {
  visible: boolean;
  helplines: Helpline[];
  onClose: () => void;
}) {
  const { dict, profile } = useProfile();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primary = helplines[0];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <ScrollView
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={{
          padding: 20,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 28,
          gap: 16,
        }}
      >
        <Heading level="h1">{dict.crisis.title}</Heading>
        <Text style={{ color: theme.inkSoft, fontSize: 15, lineHeight: 22 }}>
          {dict.crisis.subtitle}
        </Text>

        {primary && primary.numbers[0] && (
          <Pressable
            onPress={() => void Linking.openURL(`tel:${primary.numbers[0].dial}`)}
            accessibilityRole="button"
            style={({ pressed }) => ({
              backgroundColor: theme.danger,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: theme.white, fontSize: 18, fontWeight: "800" }}>
              {dict.crisis.callNow} {primary.numbers[0].display}
            </Text>
          </Pressable>
        )}

        {profile.isMinor && (
          <Text style={{ color: theme.warn, fontSize: 14, lineHeight: 21 }}>
            {dict.crisis.minorsLine}
          </Text>
        )}

        <View style={{ gap: 12 }}>
          {helplines.map((line, index) => (
            <HelplineCard key={line.id} line={line} prominent={index === 0} />
          ))}
        </View>

        <Button label={dict.crisis.close} variant="quiet" onPress={onClose} />
      </ScrollView>
    </Modal>
  );
}
