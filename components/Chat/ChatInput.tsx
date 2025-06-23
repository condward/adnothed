import { FC, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { BaseShortCutSchema } from "../Shortcuts/schema";
import { MessageSchema } from "./schema";
import { colors } from "../colors";
import { DEFAULT } from "../contants";

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: colors.DARK,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.LIGHT,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    fontSize: 16,
    color: colors.DARK,
  },
  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: colors.DARK },
});

const formatDateTime = (d: Date) => {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

type ChatInputProps = {
  setMessages: (messages: MessageSchema) => void;
  shortcuts: BaseShortCutSchema[];
};

export const ChatInput: FC<ChatInputProps> = ({ setMessages, shortcuts }) => {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const prevText = input.trim();

    const transformText = (text: string) => {
      const lowercaseText = text.toLowerCase();

      const currentShortCut = shortcuts.find((shortcut) =>
        lowercaseText.startsWith(`${shortcut.key} `)
      );

      if (currentShortCut) {
        return { shortcutId: currentShortCut.id, text: text.slice(2) };
      }
      return { shortcutId: DEFAULT, text };
    };
    const { text, shortcutId } = transformText(prevText);

    const now = new Date();
    const newMsg = {
      id: uuid.v4(),
      text,
      time: formatDateTime(now),
      shortcutId,
    };

    setMessages(newMsg);
    setInput("");
  };
  return (
    <View style={styles.inputRow}>
      <TextInput
        style={styles.textInput}
        placeholder="Send a message"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </View>
  );
};
