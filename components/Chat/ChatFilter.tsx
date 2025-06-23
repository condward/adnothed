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
import { colors } from "../colors";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "./schema";
import { format } from "date-fns";
import { ALL, DEFAULT } from "../contants";
import { useShortcuts } from "../Shortcuts/ShortCutsProvider";

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

const filterSchema = z.object({
  text: z.string(),
  categoryId: z.string().optional(),
  hasLink: z.boolean(),
  dateRange: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }),
});
export type FilterSchema = z.infer<typeof filterSchema>;

type ChatFilterProps = {
  setFilteredMessages: (messages: MessageSchema[]) => void;
  messages: MessageSchema[];
};

const urlRegex = /https?:\/\/[^\s]+/g;

export const ChatFilter: FC<ChatFilterProps> = ({
  setFilteredMessages,
  messages,
}) => {
  const { shortcuts } = useShortcuts();
  const [showDate, setShowDate] = useState(false);
  const defaultStyles = useDefaultStyles();

  const { handleSubmit, resetField, control } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      text: "",
      categoryId: ALL,
      hasLink: false,
      dateRange: {
        startDate: undefined,
        endDate: undefined,
      },
    },
  });

  const handleFilterMessages = handleSubmit(
    ({ text, categoryId, dateRange: { startDate, endDate }, hasLink }) => {
      setFilteredMessages(
        messages.filter((m) => {
          const intStartDate = startDate
            ? format(startDate, "yyyy-MM-dd")
            : undefined;
          const intEndDate = endDate
            ? format(endDate, "yyyy-MM-dd")
            : undefined;

          if (intStartDate && m.time < intStartDate) return false;
          if (intEndDate && m.time > intEndDate) return false;
          if (hasLink && !m.text.match(urlRegex)) return false;
          if (categoryId !== ALL && m.shortcutId !== categoryId) return false;

          return m.text.toLowerCase().includes(text.trim().toLowerCase());
        })
      );
    }
  );

  return (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        <Controller
          name="text"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                style={styles.filterInput}
                placeholder="Filter messages…"
                value={value}
                onChangeText={onChange}
                returnKeyType="search"
              />

              {value.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    resetField("text");
                    handleFilterMessages();
                  }}
                >
                  <Ionicons name="close" size={22} color={colors.DARK} />
                </TouchableOpacity>
              )}
              <Ionicons
                name="search"
                size={20}
                color={colors.DARK}
                style={styles.searchIcon}
                onPress={handleFilterMessages}
              />
            </>
          )}
        />
      </View>
      <View style={styles.filterZone}>
        <View style={styles.switchContainer}>
          <Text>Group</Text>
          <Controller
            name="categoryId"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={(val) => {
                  onChange(val);
                  handleFilterMessages();
                }}
                mode="dropdown"
                style={styles.picker}
              >
                <Picker.Item label={ALL} value={ALL} />
                <Picker.Item label={DEFAULT} value={DEFAULT} />
                {shortcuts.map((shortcut) => (
                  <Picker.Item
                    key={shortcut.id}
                    label={shortcut.name}
                    value={shortcut.id}
                  />
                ))}
              </Picker>
            )}
          />
        </View>
        <View style={styles.switchContainer}>
          <Controller
            name="hasLink"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <Text>Links</Text>
                <Switch
                  trackColor={{ false: colors.DARK, true: colors.DARK }}
                  thumbColor={colors.DARK}
                  onValueChange={(val) => {
                    onChange(val);
                    handleFilterMessages();
                  }}
                  value={value}
                />
                <Text>{value ? "Only" : "All"}</Text>
              </>
            )}
          />
        </View>
        <Button
          title="By Date"
          color={colors.DARK}
          onPress={() => {
            setShowDate((prev) => !prev);
            handleFilterMessages();
          }}
        />
      </View>
      {showDate && (
        <>
          <Controller
            name="dateRange"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                mode="range"
                style={{ backgroundColor: colors.DARK }}
                startDate={value.startDate}
                endDate={value.endDate}
                maxDate={new Date()}
                onChange={onChange}
                styles={defaultStyles}
              />
            )}
          />
          <Button
            title="Close"
            color={colors.DARK}
            onPress={() => {
              setShowDate(false);
              handleFilterMessages();
            }}
          />
        </>
      )}
    </View>
  );
};
