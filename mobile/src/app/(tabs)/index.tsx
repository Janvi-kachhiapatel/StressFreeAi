import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CrisisPanel } from "@/components/CrisisPanel";
import { Button, Chip, Pill } from "@/components/ui";
import { sendMessage } from "@/lib/api";
import { useProfile } from "@/lib/profile";
import { helplinesForIds, loadHelplines } from "@/lib/resources";
import { clearMessages, loadMessages, saveMessages } from "@/lib/storage";
import { useTheme } from "@/lib/theme";
import { NEEDS, type ChatTurn, type Helpline, type Need } from "@/lib/types";

const PERSON_NOW_IDS = ["tele-manas", "kiran", "emergency-112"];

export default function TalkScreen() {
  const { dict, profile } = useProfile();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [need, setNeed] = useState<Need | null>(null);
  const [needOpen, setNeedOpen] = useState(false);
  const [helplines, setHelplines] = useState<Helpline[]>([]);
  const [crisis, setCrisis] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] });
  const [demo, setDemo] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let cancelled = false;
    loadHelplines().then((result) => {
      if (!cancelled) setHelplines(result.helplines);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!profile.memoryEnabled) return;
    let cancelled = false;
    loadMessages().then((turns) => {
      if (!cancelled) setMessages(turns);
    });
    return () => {
      cancelled = true;
    };
  }, [profile.memoryEnabled]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || sending) return;

      const userTurn: ChatTurn = { role: "user", content };
      const history = messages;
      const withUser = [...messages, userTurn];

      setMessages(withUser);
      setInput("");
      setSending(true);
      setError(null);
      setChips([]);
      void saveMessages(withUser, profile.memoryEnabled);

      const result = await sendMessage({
        message: content,
        language: profile.language,
        need,
        history,
        memoryEnabled: profile.memoryEnabled,
        isMinor: profile.isMinor,
      });

      setSending(false);

      if (!result.ok) {
        setError(
          result.kind === "rate"
            ? (result.message ?? dict.chat.errorRate)
            : result.kind === "network"
              ? dict.chat.errorNetwork
              : dict.chat.errorGeneric,
        );
        return;
      }

      const assistantTurn: ChatTurn = { role: "assistant", content: result.data.reply };
      const withReply = [...withUser, assistantTurn];
      setMessages(withReply);
      void saveMessages(withReply, profile.memoryEnabled);
      setChips(result.data.suggestedReplies ?? []);
      setDemo(result.data.demo);

      if (result.data.showCrisisPanel) {
        setCrisis({ open: true, ids: result.data.resourceIds ?? [] });
      }
    },
    [messages, need, sending, profile, dict],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 8 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Chip
            label={need ? `${dict.chat.needChange}` : dict.chat.needTitle}
            active={Boolean(need)}
            onPress={() => setNeedOpen((value) => !value)}
          />
          {messages.length > 0 && (
            <Pressable
              onPress={() => {
                setMessages([]);
                setChips([]);
                void clearMessages();
              }}
              accessibilityRole="button"
            >
              <Text style={{ color: theme.inkFaint, fontSize: 13, textDecorationLine: "underline" }}>
                {dict.chat.newChat}
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => setCrisis({ open: true, ids: PERSON_NOW_IDS })}
            accessibilityRole="button"
            style={{
              marginLeft: "auto",
              backgroundColor: theme.dangerSoft,
              borderColor: theme.danger,
              borderWidth: 1,
              borderRadius: 999,
              paddingVertical: 7,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: theme.danger, fontSize: 13, fontWeight: "700" }}>SOS</Text>
          </Pressable>
        </View>

        {needOpen && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {NEEDS.map((option) => (
              <Chip
                key={option}
                label={dict.chat.need[option]}
                active={need === option}
                onPress={() => {
                  setNeed(option);
                  setNeedOpen(false);
                }}
              />
            ))}
          </View>
        )}

        {demo && (
          <View
            style={{
              backgroundColor: theme.warnSoft,
              borderColor: theme.warn,
              borderWidth: 1,
              borderRadius: 14,
              padding: 10,
            }}
          >
            <Text style={{ color: theme.warn, fontSize: 13, lineHeight: 19 }}>{dict.chat.demoNotice}</Text>
          </View>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View
            style={{
              alignSelf: "flex-start",
              maxWidth: "90%",
              backgroundColor: theme.surface,
              borderColor: theme.line,
              borderWidth: 1,
              borderRadius: 18,
              borderBottomLeftRadius: 6,
              padding: 14,
            }}
          >
            <Text style={{ color: theme.ink, fontSize: 15, lineHeight: 22 }}>{dict.chat.greeting}</Text>
          </View>
        )}

        {messages.map((turn, index) => (
          <View
            key={`${turn.role}-${index}`}
            style={{ alignSelf: turn.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}
          >
            <View
              style={{
                backgroundColor: turn.role === "user" ? theme.accent : theme.surface,
                borderColor: turn.role === "user" ? theme.accent : theme.line,
                borderWidth: 1,
                borderRadius: 18,
                borderBottomLeftRadius: turn.role === "user" ? 18 : 6,
                borderBottomRightRadius: turn.role === "user" ? 6 : 18,
                padding: 14,
              }}
            >
              <Text
                style={{
                  color: turn.role === "user" ? theme.accentInk : theme.ink,
                  fontSize: 15,
                  lineHeight: 22,
                }}
              >
                {turn.content}
              </Text>
            </View>
          </View>
        ))}

        {sending && (
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Pill label={dict.chat.thinking} tone="accent" />
          </View>
        )}

        {error && (
          <View
            style={{
              backgroundColor: theme.dangerSoft,
              borderColor: theme.danger,
              borderWidth: 1,
              borderRadius: 14,
              padding: 12,
            }}
          >
            <Text style={{ color: theme.danger, fontSize: 14, lineHeight: 20 }}>{error}</Text>
          </View>
        )}

        {chips.length > 0 && !sending && (
          <View style={{ gap: 8, marginTop: 4 }}>
            <Text style={{ color: theme.inkFaint, fontSize: 12, textTransform: "uppercase" }}>
              {dict.chat.tryOne}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {chips.map((chip) => (
                <Chip key={chip} label={chip} onPress={() => void send(chip)} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-end",
          padding: 12,
          paddingBottom: insets.bottom + 12,
          borderTopColor: theme.line,
          borderTopWidth: 1,
          backgroundColor: theme.bg,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={dict.chat.placeholder}
          placeholderTextColor={theme.inkFaint}
          multiline
          maxLength={2000}
          style={{
            flex: 1,
            maxHeight: 140,
            minHeight: 46,
            backgroundColor: theme.surface,
            borderColor: theme.line,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 12,
            color: theme.ink,
            fontSize: 15,
          }}
        />
        <Button
          label={dict.chat.send}
          onPress={() => void send(input)}
          disabled={sending || !input.trim()}
        />
      </View>

      <CrisisPanel
        visible={crisis.open}
        helplines={helplinesForIds(crisis.ids, helplines)}
        onClose={() => setCrisis((current) => ({ ...current, open: false }))}
      />
    </KeyboardAvoidingView>
  );
}
