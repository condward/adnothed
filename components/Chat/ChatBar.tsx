import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../colors";

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.DARK,
  },
  actionCount: {
    color: colors.LIGHT,
    fontSize: 16,
    fontWeight: "600",
  },
  actionBtn: {
    padding: 4,
  },
});

type ChatBarProps = {
  selectedIds: string[];
  handleDelete: () => void;
};

export const ChatBar: FC<ChatBarProps> = ({ selectedIds, handleDelete }) => {
  if (selectedIds.length === 0) return null;
  return (
    <View style={styles.actionBar}>
      <Text style={styles.actionCount}>{selectedIds.length}</Text>

      <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
        <Ionicons name="trash-outline" size={22} color={colors.LIGHT} />
      </TouchableOpacity>
    </View>
  );
};
