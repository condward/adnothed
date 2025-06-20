import { Picker } from "@react-native-picker/picker";
import { FC } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BaseShortCutSchema } from "../Shortcuts/schema";

const styles = StyleSheet.create({
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
  picker: {
    width: 100,
    marginLeft: 4,
  },
  searchIcon: {
    marginLeft: 8,
  },
});

export type ChatFilterState = {
  id: string;
  text: string;
};

type ChatFilterProps = {
  filter: ChatFilterState;
  setFilter: (filter: ChatFilterState) => void;
  shortcuts: BaseShortCutSchema[];
};

export const ChatFilter: FC<ChatFilterProps> = ({
  filter,
  setFilter,
  shortcuts,
}) => {
  return (
    <View style={styles.filterRow}>
      <Picker
        selectedValue={filter.id}
        onValueChange={(v) => setFilter({ ...filter, id: v })}
        mode="dropdown"
        style={styles.picker}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Default" value="Default" />
        {shortcuts.map((shortcut) => (
          <Picker.Item
            key={shortcut.id}
            label={shortcut.name}
            value={shortcut.id}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.filterInput}
        placeholder="Filter messages…"
        value={filter.text}
        onChangeText={(text) => setFilter({ ...filter, text })}
        returnKeyType="search"
      />
      <Ionicons
        name="search"
        size={20}
        color="#555"
        style={styles.searchIcon}
      />
      {filter.text.length > 0 && (
        <TouchableOpacity onPress={() => setFilter({ ...filter, text: "" })}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};
