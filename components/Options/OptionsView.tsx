import React from "react";
import {
  View,
  Button,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OptionsView = () => {
  const downloadJson = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your storage to download the file.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission denied");
          return;
        }
      }

      const keys = await AsyncStorage.getAllKeys();
      const noteKeys = keys.filter(
        (k) => k.startsWith("message:") || k.startsWith("shortcut:")
      );
      const messages = await AsyncStorage.multiGet(noteKeys);
      const fileName = "data.json";
      const json = JSON.stringify(messages, null, 2);
    } catch (error) {
      console.error("Error saving file:", error);
      Alert.alert("Error", "Failed to save the file.");
    }
  };

  return (
    <View style={{ margin: 20 }}>
      <Button title="Download JSON" onPress={downloadJson} />
    </View>
  );
};

export default OptionsView;
