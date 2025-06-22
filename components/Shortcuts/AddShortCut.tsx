import { Controller, useForm } from "react-hook-form";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import uuid from "react-native-uuid";
import { shortcutsSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShortcuts } from "./ShortCutsProvider";
import { ShortCutErrors } from "./ShortCutErrors";

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
    padding: 6,
  },
  textInput: {
    padding: 2,
    margin: 1,
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
  },

  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  inputError: {
    borderColor: "red",
  },
  actionBtn: {
    padding: 4,
  },
});

export const AddShortCut = () => {
  const { shortcuts, addShortcuts } = useShortcuts();
  const { handleSubmit, resetField, control } = useForm({
    resolver: zodResolver(shortcutsSchema(shortcuts)),
    defaultValues: {
      newShortcut: {
        id: uuid.v4().toString(),
        key: "",
        icon: "",
        name: "",
      },
    },
  });

  const handleSend = () => {
    handleSubmit(
      ({ newShortcut }) => {
        addShortcuts(newShortcut);
        resetField("newShortcut", {
          defaultValue: {
            id: uuid.v4().toString(),
            key: "",
            icon: "",
            name: "",
          },
        });
      },
      (err) => console.log(err)
    )();
  };

  return (
    <View style={styles.inputRow}>
      <ShortCutErrors control={control} />
      <Controller
        name={`newShortcut.id`}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextInput
            placeholder="Id"
            value={value}
            onChangeText={onChange}
            returnKeyType="send"
            style={{
              display: "none",
            }}
          />
        )}
      />
      <Controller
        name={`newShortcut.key`}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextInput
            placeholder="Key"
            value={value}
            onChangeText={onChange}
            returnKeyType="send"
            style={[
              styles.textInput,
              { flexGrow: 1 },
              error && styles.inputError,
            ]}
          />
        )}
      />
      <Controller
        name={`newShortcut.name`}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextInput
            style={[
              styles.textInput,
              { flexGrow: 4 },
              error && styles.inputError,
            ]}
            placeholder="Name"
            value={value}
            onChangeText={onChange}
            returnKeyType="send"
          />
        )}
      />
      <Controller
        name={`newShortcut.icon`}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextInput
            style={[
              styles.textInput,
              { flexGrow: 12 },
              error && styles.inputError,
            ]}
            placeholder="Icon"
            value={value}
            onChangeText={onChange}
            returnKeyType="send"
          />
        )}
      />
      <TouchableOpacity
        style={[styles.sendBtn, { flexGrow: 1 }]}
        onPress={handleSend}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </View>
  );
};
