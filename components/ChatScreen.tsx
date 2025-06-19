import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
    color: "white",
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
});

// Helper to format a Date → "yyyy‑mm‑dd hh:ii:ss"
const formatDateTime = (d: Date) => {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  time: z.string(),
});
type MessageSchema = z.infer<typeof messageSchema>;

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");

  const filteredMessages = useMemo(
    () =>
      messages.filter((m) =>
        m.text?.toLowerCase().includes(filter.trim().toLowerCase())
      ),
    [messages, filter]
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const newMsg = {
      id: uuid.v4(),
      text: input.trim(),
      time: formatDateTime(now),
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
    <View style={styles.msgWrapper} key={item.id}>
      <View style={styles.bubble}>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
      <Text style={styles.timestamp}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
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
