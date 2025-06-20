import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BaseShortCutSchema } from "../Shortcuts/schema";
import { MessageSchema } from "./schema";

const styles = StyleSheet.create({
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
  themeIcon: {
    marginRight: 8,
  },
});

type ChatBubbleProps = {
  item: MessageSchema;
  selectedIds: string[];
  handleLongPress: (ids: string) => void;
  shortcuts: BaseShortCutSchema[];
};

export const ChatBubble: FC<ChatBubbleProps> = ({
  item,
  selectedIds,
  handleLongPress,
  shortcuts,
}) => {
  const shortcut = shortcuts.find((s) => s.name === item.name);

  return (
    <Pressable
      onLongPress={() => handleLongPress(item.id)}
      onPress={() => selectedIds.length && handleLongPress(item.id)}
    >
      <View style={styles.msgWrapper} key={item.id}>
        <View style={styles.bubble}>
          <Ionicons
            name={shortcut?.icon ?? "document-outline"}
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
};
