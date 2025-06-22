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
import { colors } from "../colors";

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderColor: colors.DARK,
    padding: 6,
  },
  inputLayer: {
    flexDirection: "row",
    borderColor: colors.DARK,
    padding: 6,
    justifyContent: "space-between",
  },
  textInput: {
    padding: 2,
    margin: 1,
    fontSize: 16,
    color: colors.DARK,
    backgroundColor: colors.LIGHT,
  },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: colors.DARK },
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
      <View style={styles.inputLayer}>
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
              style={[styles.textInput, error && styles.inputError]}
            />
          )}
        />

        <Controller
          name={`newShortcut.name`}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInput
              style={[styles.textInput, error && styles.inputError]}
              placeholder="Name"
              value={value}
              onChangeText={onChange}
              returnKeyType="send"
            />
          )}
        />
      </View>
      <View style={styles.inputLayer}>
        <Controller
          name={`newShortcut.icon`}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInput
              style={[styles.textInput, error && styles.inputError]}
              placeholder="Icon"
              value={value}
              onChangeText={onChange}
              returnKeyType="send"
            />
          )}
        />
        <View style={styles.inputLayer}>
          <TouchableOpacity onPress={handleSend}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
