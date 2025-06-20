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
import { useShortcuts } from "./ShortCutsProvider";

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderColor: "#dcdcdc",
    padding: 6,
  },
  textInput: {
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    margin: 1,
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
  },
  shortCutRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 4,
    gap: 2,
  },
  shortCutContainer: {
    flex: 1,
    flexDirection: "row",
    minHeight: 40,
    maxHeight: 120,
    padding: 8,
    margin: 1,
    fontSize: 16,
    color: "black",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
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
  actionBtn: {
    padding: 4,
  },
});

export const ShortCutList = () => {
  const { shortcuts, addShortcuts, deleteShortcuts } = useShortcuts();
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
    handleSubmit(
      ({ newShortcut }) => {
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
          <View style={styles.shortCutContainer} key={item.key}>
            <View style={styles.shortCutRow}>
              <Text style={styles.themeIcon}>{item.key}</Text>
              <Ionicons name={item.icon} size={24} />
              <Text style={styles.themeIcon}>{item.name}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => deleteShortcuts([item.key])}
                style={styles.actionBtn}
              >
                <Ionicons name="trash-outline" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </View>
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
    </KeyboardAvoidingView>
  );
};
