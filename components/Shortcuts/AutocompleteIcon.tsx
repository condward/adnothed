import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
} from "react-native";
import { colors } from "../colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ioniconNames } from "./schema";
import { FC, useState } from "react";

const styles = StyleSheet.create({
  autoCompleteContainer: {
    position: "relative",
  },
  autoComplete: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.DARK,
    zIndex: 1000,
  },
  autoCompleteOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  themeIcon: {
    marginRight: 8,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  inputError: {
    borderColor: "red",
  },
  iconWithPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
});

type AutocompleteIconProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error: boolean;
  renderUp?: boolean;
};

export const AutocompleteIcon: FC<AutocompleteIconProps> = ({
  value,
  onChange,
  onSubmit,
  error,
  renderUp,
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  return (
    <View style={styles.autoCompleteContainer}>
      <View style={styles.iconWithPreview}>
        <TextInput
          placeholder="Icon"
          value={value}
          onChangeText={(val) => {
            if (val) {
              const filtered = ioniconNames.filter((item) =>
                item.toLowerCase().startsWith(val.toLowerCase())
              );
              setFilteredSuggestions(filtered);
            } else {
              setFilteredSuggestions([]);
            }

            onChange(val);
          }}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          style={[
            styles.textInput,
            { flexGrow: 1 },
            error && styles.inputError,
          ]}
        />
        {ioniconNames.includes(value) && (
          <Ionicons
            name={value}
            size={20}
            color={colors.DARK}
            style={styles.themeIcon}
          />
        )}
      </View>
      {filteredSuggestions.length > 0 && (
        <FlatList
          style={[styles.autoComplete, renderUp ? { bottom: 35 } : { top: 30 }]}
          data={filteredSuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onChange(item);
                setFilteredSuggestions([]);
              }}
              style={styles.autoCompleteOption}
            >
              <Text style={styles.suggestion}>{item}</Text>
              <Ionicons
                name={item}
                size={20}
                color={colors.DARK}
                style={styles.themeIcon}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
