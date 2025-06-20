import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { shortcutsSchema } from "./schema";
import { ShortCutErrors } from "./ShortCutErrors";
import { useShortCut } from "./useShortcutStorage";

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
    padding: 6,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    margin: 1,
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
  },
  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
  container: { flex: 1, backgroundColor: "#000", height: "100%" },
  themeIcon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 14,
  },
});

export const ShortCutList = () => {
  const { shortcuts, addShortcuts } = useShortCut();
  const { handleSubmit, resetField, control } = useForm({
    resolver: zodResolver(shortcutsSchema(shortcuts)),
    defaultValues: {
      newShortcut: {
        key: "",
        icon: "",
      },
    },
  });

  const handleSend = () => {
    console.log("hero");
    handleSubmit(
      ({ newShortcut }) => {
        console.log("Sending shortcuts:", newShortcut);
        addShortcuts(newShortcut);
        resetField("newShortcut");
      },
      (err) => console.log(err)
    )();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ShortCutErrors control={control} />
      <FlatList
        data={shortcuts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.textInput} key={item.key}>
            <View style={styles.inputRow}>
              <Text style={styles.themeIcon}>{item.key}</Text>
              <Ionicons name={item.icon} size={24} />
              <Text style={styles.themeIcon}>{item.icon}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.key}
      />
      <View style={styles.inputRow}>
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
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
