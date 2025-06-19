import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import Ionicons from "react-native-vector-icons/Ionicons";
import { z } from "zod";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", height: "100%" },

  /* --- message bubble + timestamp --- */
  msgWrapper: {
    marginBottom: 20,
    alignSelf: "flex-start",
    flexGrow: 1,
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: "lime",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: "80%",
  },
  msgText: { fontSize: 16, color: "#000" },
  timestamp: { marginTop: 4, fontSize: 12, color: "white" },

  /* --- list & input bar --- */
  listContent: { padding: 16 },
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
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  filterInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  clearText: { fontSize: 18, paddingHorizontal: 8, opacity: 0.6 },
  searchIcon: {
    marginLeft: 8,
  },
  themeIcon: {
    marginRight: 8,
  },
  selectedWrapper: {
    backgroundColor: "#e0f2ff",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2196f3",
  },
  actionCount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionBtn: {
    padding: 4,
  },
});

const formatDateTime = (d: Date) => {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

enum MessageTheme {
  DEFAULT = "default",
  MUSIC = "music",
  MOVIE = "movie",
}

const MessageThemeIcons = {
  [MessageTheme.DEFAULT]: "document-text-outline",
  [MessageTheme.MUSIC]: "musical-notes-outline",
  [MessageTheme.MOVIE]: "videocam-outline",
};

const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  time: z.string(),
  theme: z.nativeEnum(MessageTheme).optional().default(MessageTheme.DEFAULT),
});
type MessageSchema = z.infer<typeof messageSchema>;

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredMessages = useMemo(
    () =>
      messages.filter((m) =>
        m.text?.toLowerCase().includes(filter.trim().toLowerCase())
      ),
    [messages, filter]
  );

  const handleLongPress = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    await AsyncStorage.multiRemove(selectedIds.map((id) => `message:${id}`));
    setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const prevText = input.trim();

    const transformText = (text: string) => {
      const lowercaseText = text.toLowerCase();
      if (lowercaseText.startsWith("m ")) {
        return { theme: MessageTheme.MUSIC, text: text.slice(2) };
      } else if (lowercaseText.startsWith("f ")) {
        return { theme: MessageTheme.MOVIE, text: text.slice(2) };
      }
      return { theme: MessageTheme.DEFAULT, text };
    };
    const { text, theme } = transformText(prevText);

    const now = new Date();
    const newMsg = {
      id: uuid.v4(),
      text,
      time: formatDateTime(now),
      theme,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    await AsyncStorage.setItem(`message:${newMsg.id}`, JSON.stringify(newMsg));
  };

  useEffect(() => {
    async function fetchData() {
      const keys = await AsyncStorage.getAllKeys();
      const noteKeys = keys.filter((k) => k.startsWith("message:"));
      const messages = await AsyncStorage.multiGet(noteKeys);

      const arr: MessageSchema[] = [];
      messages.map(([key, value]) => {
        value && arr.push(messageSchema.parse(JSON.parse(value)));
      });

      setMessages(arr);
    }
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: MessageSchema }) => (
    <Pressable
      onLongPress={() => handleLongPress(item.id)}
      onPress={() => selectedIds.length && handleLongPress(item.id)}
    >
      <View style={styles.msgWrapper} key={item.id}>
        <View style={styles.bubble}>
          <Ionicons
            name={MessageThemeIcons[item.theme]}
            size={20}
            color="#555"
            style={styles.themeIcon}
          />

          <Text style={styles.msgText}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {selectedIds.length > 0 && (
        <View style={styles.actionBar}>
          <Text style={styles.actionCount}>{selectedIds.length}</Text>

          <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter messages…"
          value={filter}
          onChangeText={setFilter}
          returnKeyType="search"
        />
        <Ionicons
          name="search"
          size={20}
          color="#555"
          style={styles.searchIcon}
        />
        {filter.length > 0 && (
          <TouchableOpacity onPress={() => setFilter("")}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted // <-- flips the list so bottom is newest
        contentContainerStyle={styles.listContent}
      />

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Send a message"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
