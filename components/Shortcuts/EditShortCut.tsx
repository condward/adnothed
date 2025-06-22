import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { editShortcutSchema } from "./schema";
import { useShortcuts } from "./ShortCutsProvider";
import { colors } from "../colors";

// musical-notes

const styles = StyleSheet.create({
  textInput: {
    padding: 2,
    margin: 1,
    fontSize: 16,
    color: colors.DARK,
    backgroundColor: colors.LIGHT,
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
    color: colors.DARK,
    backgroundColor: colors.DARK,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sendBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  sendIcon: { fontSize: 18, fontWeight: "bold", color: colors.DARK },
  themeIcon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: "red",
  },
  actionBtn: {
    padding: 4,
  },
});

enum EditType {
  ICON = "icon",
  NAME = "name",
  KEY = "key",
}

export const EditShortCut = () => {
  const { shortcuts, editShortcuts } = useShortcuts();

  const {
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    control: editControl,
  } = useForm({
    resolver: zodResolver(editShortcutSchema),
    defaultValues: {
      edit: {
        type: null,
        values: {
          id: "",
          key: "",
          icon: "",
          name: "",
        },
      },
    },
  });

  const handleEditSend = () => {
    handleEditSubmit(
      ({ edit: { type, values } }) => {
        if (type === null || !values.id) return;

        const value = values[type];
        if (!value) return;

        editShortcuts(values.id, type, value);
        resetEdit();
      },
      (err) => console.log(err)
    )();
  };

  return (
    <FlatList
      data={shortcuts}
      renderItem={({ item }) => (
        <View style={styles.shortCutContainer} key={item.key}>
          <Controller
            name={`edit`}
            control={editControl}
            render={({ field: { value: edit, onChange: setEdit } }) => (
              <View style={styles.shortCutRow}>
                {edit.type === EditType.KEY ? (
                  <Controller
                    name={`edit.values.key`}
                    control={editControl}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Key"
                        value={value}
                        onChangeText={onChange}
                        onSubmitEditing={handleEditSend}
                        returnKeyType="send"
                        style={[
                          styles.textInput,
                          { flexGrow: 1 },
                          error && styles.inputError,
                        ]}
                      />
                    )}
                  />
                ) : (
                  <Text
                    style={styles.themeIcon}
                    onPress={() =>
                      setEdit({ type: EditType.KEY, values: item })
                    }
                  >
                    {item.key}
                  </Text>
                )}

                {edit.type === EditType.ICON ? (
                  <Controller
                    name={`edit.values.icon`}
                    control={editControl}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Icon"
                        value={value}
                        onChangeText={onChange}
                        onSubmitEditing={handleEditSend}
                        returnKeyType="send"
                        style={[
                          styles.textInput,
                          { flexGrow: 1 },
                          error && styles.inputError,
                        ]}
                      />
                    )}
                  />
                ) : (
                  <Ionicons
                    name={item.icon}
                    size={24}
                    onPress={() =>
                      setEdit({ type: EditType.ICON, values: item })
                    }
                  />
                )}

                {edit.type === EditType.NAME ? (
                  <Controller
                    name={`edit.values.name`}
                    control={editControl}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Name"
                        value={value}
                        onChangeText={onChange}
                        onSubmitEditing={handleEditSend}
                        returnKeyType="send"
                        style={[
                          styles.textInput,
                          { flexGrow: 1 },
                          error && styles.inputError,
                        ]}
                      />
                    )}
                  />
                ) : (
                  <Text
                    style={styles.themeIcon}
                    onPress={() =>
                      setEdit({ type: EditType.NAME, values: item })
                    }
                  >
                    {item.name}
                  </Text>
                )}
              </View>
            )}
          />
          <View>
            <TouchableOpacity
              onPress={() => handleEditSend()}
              style={styles.actionBtn}
            >
              <Ionicons name="send-outline" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
};
