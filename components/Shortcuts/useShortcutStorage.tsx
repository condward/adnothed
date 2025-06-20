import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { baseShortCutSchema, ShortcutSchema } from "./schema";

export const useShortCut = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutSchema[]>([]);

  const deleteShortcuts = useCallback(async (ids: string[]) => {
    setShortcuts((prev) => prev.filter((m) => !ids.includes(m.key)));
    await AsyncStorage.multiRemove(ids.map((id) => `shortcut:${id}`));
  }, []);

  const addShortcuts = useCallback(async (shortcut: ShortcutSchema) => {
    setShortcuts((prev) => [...prev, shortcut]);
    await AsyncStorage.setItem(
      `shortcut:${shortcut.key}`,
      JSON.stringify(shortcut)
    );
  }, []);

  useEffect(() => {
    async function fetchData() {
      const keys = await AsyncStorage.getAllKeys();
      const noteKeys = keys.filter((k) => k.startsWith("shortcut:"));
      const shortcuts = await AsyncStorage.multiGet(noteKeys);

      const arr: ShortcutSchema[] = [];
      shortcuts.map(([key, value]) => {
        value && arr.push(baseShortCutSchema.parse(JSON.parse(value)));
      });

      setShortcuts(arr);
    }
    fetchData();
  }, [setShortcuts]);

  return useMemo(
    () => ({
      deleteShortcuts,
      addShortcuts,
      shortcuts,
    }),
    [addShortcuts, deleteShortcuts, shortcuts]
  );
};
