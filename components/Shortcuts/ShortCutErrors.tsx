import { FC } from "react";
import { Control, useFormState } from "react-hook-form";
import { Text, View } from "react-native";
import { ShortcutsSchema } from "./schema";

type ShortCutErrorsProps = {
  control: Control<ShortcutsSchema>;
};

export const ShortCutErrors: FC<ShortCutErrorsProps> = ({ control }) => {
  const {
    errors: { newShortcut },
  } = useFormState({
    control,
    name: "newShortcut",
  });

  if (!newShortcut) return null;

  return (
    <View style={{ padding: 16, backgroundColor: "red" }}>
      {[
        newShortcut.message,
        newShortcut.key?.message,
        newShortcut.icon?.message,
      ]
        .filter(Boolean)
        .map((msg, index) => (
          <Text
            key={index}
            style={{
              color: "white",
              marginTop: 4,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {msg}
          </Text>
        ))}
    </View>
  );
};
