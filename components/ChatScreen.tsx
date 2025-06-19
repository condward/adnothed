import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
} from "react-native";
import { ChatBar } from "./Chat/ChatBar";
import { ChatBubble } from "./Chat/ChatBubble";
import { ChatFilter, ChatFilterState } from "./Chat/ChatFilter";
import { ChatInput } from "./Chat/ChatInput";
import { MessageSchema } from "./Chat/schema";
import { useMessageStorage } from "./Chat/useMessageStorage";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", height: "100%" },
  listContent: { padding: 16 },
});

const ChatScreen = () => {
  const { addMessages, deleteMessages, messages } = useMessageStorage();
  const [filter, setFilter] = useState<ChatFilterState>({
    text: "",
    theme: "ALL",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredMessages = useMemo(
    () =>
      messages.filter((m) => {
        const matchesText = m.text
          .toLowerCase()
          .includes(filter.text.trim().toLowerCase());

        const matchesTheme = filter.theme === "ALL" || m.theme === filter.theme;

        return matchesText && matchesTheme;
      }),
    [messages, filter]
  );

  const handleLongPress = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    deleteMessages(selectedIds);
    setSelectedIds([]);
  };

  const renderItem = ({ item }: { item: MessageSchema }) => (
    <ChatBubble
      item={item}
      selectedIds={selectedIds}
      handleLongPress={handleLongPress}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ChatBar selectedIds={selectedIds} handleDelete={handleDelete} />
      <ChatFilter filter={filter} setFilter={setFilter} />
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.listContent}
      />
      <ChatInput setMessages={addMessages} />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
