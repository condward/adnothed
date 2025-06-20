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

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    fontSize: 16,
    color: "black",
  },
  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
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
        return { name: currentShortCut.name, text: text.slice(2) };
      }
      return { name: "Default", text };
    };
    const { text, name } = transformText(prevText);

    const now = new Date();
    const newMsg = {
      id: uuid.v4(),
      text,
      time: formatDateTime(now),
      name,
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
