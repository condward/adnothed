import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BaseShortCutSchema } from "../Shortcuts/schema";
import { MessageSchema } from "./schema";
import { colors } from "../colors";

const styles = StyleSheet.create({
  msgWrapper: {
    marginBottom: 20,
    alignSelf: "flex-start",
    flexGrow: 1,
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: colors.DARK,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: "80%",
  },
  msgText: { fontSize: 16, color: "white" },
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
  const shortcut = shortcuts.find((s) => s.id === item.shortcutId);

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
            color="white"
            style={styles.themeIcon}
          />

          <Text style={styles.msgText}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
    </Pressable>
  );
};
