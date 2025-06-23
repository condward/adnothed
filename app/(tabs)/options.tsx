import OptionsView from "@/components/Options/OptionsView";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // or your app background
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default function Options() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <OptionsView />
    </SafeAreaView>
  );
}
