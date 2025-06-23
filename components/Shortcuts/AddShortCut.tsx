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
import { AutocompleteIcon } from "./AutocompleteIcon";
import Ionicons from "react-native-vector-icons/Ionicons";

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
    borderColor: colors.DARK,
    borderWidth: 1,
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
            <AutocompleteIcon
              value={value}
              onChange={onChange}
              onSubmit={handleSend}
              error={!!error}
              renderUp
            />
          )}
        />
        <View style={styles.inputLayer}>
          <TouchableOpacity onPress={handleSend}>
             <Ionicons name="send-outline" size={22} color={colors.DARK} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
