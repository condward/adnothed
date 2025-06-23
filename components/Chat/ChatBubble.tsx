import { FC, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MessageSchema } from "./schema";
import { colors } from "../colors";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { DEFAULT } from "../contants";
import { useShortcuts } from "../Shortcuts/ShortCutsProvider";
import Clipboard from "@react-native-clipboard/clipboard";

const styles = StyleSheet.create({
  listContent: { padding: 16 },
  msgWrapper: {
    alignSelf: "flex-start",
    marginVertical: 6,
  },
  textInput: {
    padding: 2,
    margin: 1,
    fontSize: 16,
    color: colors.DARK,
    backgroundColor: colors.LIGHT,
  },
  bubble: {
    flexDirection: "row",
    backgroundColor: colors.DARK,
    color: colors.LIGHT,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  msgText: { fontSize: 16, color: colors.LIGHT },
  timestamp: { marginTop: 4, fontSize: 12, color: colors.DARK },
  themeIcon: {
    marginRight: 8,
  },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: colors.LIGHT },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",}
});

enum EditType {
  TEXT = "text",
  SHORTCUT_ID = "shortcutId",
}

const bubbleSchema = z.object({
  edit: z.object({
    type: z.nativeEnum(EditType).nullable(),
    values: z.object({
      text: z.string(),
      shortcutId: z.string(),
      id: z.string(),
      time: z.string(),
    }),
  }),
});

type ChatBubbleProps = {
  selectedIds: string[];
  handleLongPress: (ids: string) => void;
  handleEdit: (item: MessageSchema) => void;
  filteredMessages: MessageSchema[];
};

const PAGE_SIZE = 5;

export const ChatBubbles: FC<ChatBubbleProps> = ({
  selectedIds,
  handleLongPress,
  handleEdit,
  filteredMessages,
}) => {
  const { shortcuts } = useShortcuts();
  const [page, setPage] = useState(1);
  const paginatedMessages = filteredMessages.slice(0, page * PAGE_SIZE);

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(bubbleSchema),
    defaultValues: {
      edit: {
        type: null,
        values: {
          id: "",
          time: "",
          text: "",
          shortcutId: "",
        },
      },
    },
  });

  const handleEditSend = () => {
    handleSubmit(
      ({ edit: { type, values } }) => {
        if (type === null || !values.shortcutId) return;

        const value = values[type];
        if (!value) return;

        handleEdit(values);
        reset();
      },
      (err) => console.log(err)
    )();
  };

  return (
    <FlatList
      data={paginatedMessages}
      keyExtractor={(item) => item.id}
      onEndReached={(val) => {
        const nextPage =
          page >= Math.ceil(filteredMessages.length / PAGE_SIZE)
            ? page
            : page + 1;
        setPage(nextPage);
      }}
      onEndReachedThreshold={0.1}
      renderItem={({ item }) => (
        <Pressable
          onLongPress={() => handleLongPress(item.id)}
          onPress={() => selectedIds.length && handleLongPress(item.id)}
        >
          <View
            style={[
              styles.msgWrapper,
              selectedIds.includes(item.id)
                ? { borderColor: colors.DARK, borderWidth: 2, padding: 2 }
                : undefined,
            ]}
            key={item.id}
          >
            <View style={styles.row}>
            <View style={styles.bubble}>
              <Controller
                name={`edit`}
                control={control}
                render={({ field: { value: edit, onChange: setEdit } }) => (
                  <>
                    {edit.type === EditType.SHORTCUT_ID &&
                    edit.values.id === item.id ? (
                      <Controller
                        name={`edit.values.shortcutId`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Picker
                            selectedValue={value}
                            onValueChange={(val) => {
                              onChange(val);
                              setEdit({
                                type: EditType.SHORTCUT_ID,
                                values: {
                                  ...item,
                                  shortcutId: val,
                                },
                              });
                              handleEditSend();
                            }}
                            mode="dropdown"
                          >
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
                    ) : (
                      <Ionicons
                        name={
                          shortcuts.find((s) => s.id === item.shortcutId)
                            ?.icon ?? "document-outline"
                        }
                        size={20}
                        color={colors.LIGHT}
                        style={styles.themeIcon}
                        onPress={() =>
                          setEdit({ type: EditType.SHORTCUT_ID, values: item })
                        }
                      />
                    )}
                    {edit.type === EditType.TEXT &&
                    edit.values.id === item.id ? (
                      <Controller
                        name="edit.values.text"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextInput
                            placeholder="Key"
                            value={value}
                            onChangeText={onChange}
                            onSubmitEditing={() => {
                              setEdit({
                                type: EditType.TEXT,
                                values: {
                                  ...item,
                                  text: value,
                                },
                              });
                              handleEditSend();
                            }}
                            returnKeyType="send"
                            style={styles.textInput}
                          />
                        )}
                      />
                    ) : (
                      <Text
                        style={styles.msgText}
                        onPress={() =>
                          setEdit({ type: EditType.TEXT, values: item })
                        }
                      >
                        {item.text}
                      </Text>
                    )}
                    {edit.type !== null && (
                      <TouchableOpacity onPress={handleEditSend}>
                        <Text style={styles.sendIcon}>➤</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              />
            </View>
            <TouchableOpacity>
              <Ionicons
                onPress={async () => {
                  await Clipboard.setString(item.text);
                  Alert.alert("Copied to clipboard!", item.text);
                }}
                name="copy-outline"
                size={20}
                color={colors.DARK}
                style={styles.themeIcon}
              />
            </TouchableOpacity>
            </View>
            <Text style={styles.timestamp}>{item.time}</Text>
          </View>
        </Pressable>
      )}
      inverted
      contentContainerStyle={styles.listContent}
    />
  );
};
