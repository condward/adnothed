import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
} from "react-native";
import { useShortcuts } from "../Shortcuts/ShortCutsProvider";
import { ChatBar } from "./ChatBar";
import { ChatBubble } from "./ChatBubble";
import { ChatFilter } from "./ChatFilter";
import { ChatInput } from "./ChatInput";
import { MessageSchema } from "./schema";
import { useMessageStorage } from "./useMessageStorage";
import { colors } from "../colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MEDIUM, height: "100%" },
  listContent: { padding: 16 },
});

const ChatScreen = () => {
  const { shortcuts } = useShortcuts();
  const { addMessages, deleteMessages, messages } = useMessageStorage();
  const [filteredMessages, setFilteredMessages] =
    useState<MessageSchema[]>(messages);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
      shortcuts={shortcuts}
    />
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ChatBar selectedIds={selectedIds} handleDelete={handleDelete} />
      <ChatFilter
        messages={messages}
        setFilteredMessages={setFilteredMessages}
        shortcuts={shortcuts}
      />
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.listContent}
      />
      <ChatInput setMessages={addMessages} shortcuts={shortcuts} />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
