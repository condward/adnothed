import { Picker } from "@react-native-picker/picker";
import { FC, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Button,
  Text,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BaseShortCutSchema } from "../Shortcuts/schema";
import { colors } from "../colors";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.DARK,
    backgroundColor: colors.LIGHT,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.DARK,
    backgroundColor: colors.LIGHT,
  },
  filterZone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    padding: 4,
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
  const [showDate, setShowDate] = useState(false);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<{
    startDate: DateType;
    endDate: DateType;
  }>();
  const [hasLink, setHasLink] = useState(false);

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
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
          color={colors.DARK}
          style={styles.searchIcon}
        />
        {filter.text.length > 0 && (
          <TouchableOpacity onPress={() => setFilter({ ...filter, text: "" })}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.filterZone}>
        <View style={styles.switchContainer}>
          <Text>Category</Text>
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
        </View>
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: colors.DARK, true: colors.DARK }}
            thumbColor={colors.DARK}
            onValueChange={setHasLink}
            value={hasLink}
          />
          <Text>{hasLink ? "Has Link" : "All"}</Text>
        </View>
        <Button title="By Date" onPress={() => setShowDate((prev) => !prev)} />
      </View>
      {showDate && (
        <>
          <DateTimePicker
            mode="range"
            style={{ backgroundColor: colors.DARK }}
            startDate={selected?.startDate}
            endDate={selected?.endDate}
            maxDate={new Date()}
            onChange={({ startDate, endDate }) => {
              setSelected({ startDate, endDate });
            }}
            styles={defaultStyles}
          />
          <Button title="Close" onPress={() => setShowDate(false)} />
        </>
      )}
    </View>
  );
};
