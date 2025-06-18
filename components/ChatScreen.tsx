import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", height: '100%' },

  /* --- message bubble + timestamp --- */
  msgWrapper: { marginBottom: 20, alignSelf: "flex-start" },
  bubble: {
    backgroundColor: "#e7edef",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: "80%",
  },
  msgText: { fontSize: 16, color: "#000" },
  timestamp: { marginTop: 4, fontSize: 12, color: "#777" },

  /* --- list & input bar --- */
  listContent: { padding: 16 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    fontSize: 16,
  },
  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
});

// Helper to format a Date → "yyyy‑mm‑dd hh:ii:ss"
const formatDateTime = (d: Date) => {
  const pad = (n: number) => (n < 10 ? "0" + n : n);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

type Message = { id: string; text: string; time: string };

const sendLocalNotification = async (bodyText: string) => {
  if (Platform.OS === "web") {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Message Sent", { body: bodyText });
    }
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Message Sent",
        body: bodyText,
      },
      trigger: null, // instant
    });
  }
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") {
    if ("Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
  } else if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get permission for notifications.");
    }
  }
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = new Date();
    const newMsg = {
      id: now.getTime().toString(), // simple unique id
      text: input.trim(),
      time: formatDateTime(now),
    };

    // Add newest at the end; FlatList is inverted so it will appear *above* input
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    await sendLocalNotification(input.trim());
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.msgWrapper}>
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
      {/* Messages list (newest at bottom, i.e. right above the input row) */}
      <FlatList
        data={messages}
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
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
