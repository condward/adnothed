import { KeyboardAvoidingView, Platform } from "react-native";
import { AddShortCut } from "./AddShortCut";
import React from "react";
import { EditShortCut } from "./EditShortCut";

export const ShortCutList = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#000", height: "100%" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <EditShortCut />
      <AddShortCut />
    </KeyboardAvoidingView>
  );
};
