import React, { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
} from "react-native";
import { ChatBar } from "./ChatBar";
import { ChatBubbles } from "./ChatBubble";
import { ChatFilter } from "./ChatFilter";
import { ChatInput } from "./ChatInput";
import { MessageSchema } from "./schema";
import { useMessageStorage } from "./useMessageStorage";
import { colors } from "../colors";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.MEDIUM, height: "100%" },
});

const ChatScreenWrapper = () => {
  const { addMessages, deleteMessages, messages } = useMessageStorage();

  if (messages.length === 0) return null;

  return (
    <ChatScreen
      messages={messages}
      addMessages={addMessages}
      deleteMessages={deleteMessages}
    />
  );
};

type ChatScreenProps = {
  messages: MessageSchema[];
  addMessages: (message: MessageSchema) => Promise<void>;
  deleteMessages: (ids: string[]) => void;
};

const ChatScreen: FC<ChatScreenProps> = ({
  addMessages,
  deleteMessages,
  messages,
}) => {
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
      />
      <ChatBubbles
        filteredMessages={filteredMessages}
        selectedIds={selectedIds}
        handleLongPress={handleLongPress}
        handleEdit={addMessages}
      />
      <ChatInput setMessages={addMessages} />
    </KeyboardAvoidingView>
  );
};

export default ChatScreenWrapper;
