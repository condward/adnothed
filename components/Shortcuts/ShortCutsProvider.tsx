import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { baseShortCutSchema, ShortcutSchema } from "./schema";

interface ShortcutContextValue {
  shortcuts: ShortcutSchema[];
  addShortcuts: (shortcut: ShortcutSchema) => Promise<void>;
  deleteShortcuts: (ids: string[]) => Promise<void>;
  editShortcuts: (
    id: string,
    type: "key" | "icon" | "name",
    value: string
  ) => Promise<void>;
}

const ShortcutContext = createContext<ShortcutContextValue | undefined>(
  undefined
);

export const ShortcutProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [shortcuts, setShortcuts] = useState<ShortcutSchema[]>([]);

  const deleteShortcuts = useCallback(async (ids: string[]) => {
    setShortcuts((prev) => prev.filter((m) => !ids.includes(m.id)));
    await AsyncStorage.multiRemove(ids.map((id) => `shortcut:${id}`));
  }, []);

  const editShortcuts = useCallback(
    async (id: string, type: "key" | "icon" | "name", value: string) => {
      setShortcuts((prev) =>
        prev.map((shortcut) =>
          shortcut.id === id ? { ...shortcut, [type]: value } : shortcut
        )
      );

      await AsyncStorage.setItem(
        `shortcut:${id}`,
        JSON.stringify({ ...shortcuts.find((s) => s.id === id), [type]: value })
      );
    },
    [shortcuts]
  );

  const addShortcuts = useCallback(async (shortcut: ShortcutSchema) => {
    setShortcuts((prev) => [...prev, shortcut]);
    await AsyncStorage.setItem(
      `shortcut:${shortcut.id}`,
      JSON.stringify(shortcut)
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const keys = await AsyncStorage.getAllKeys();
      const shortcutKeys = keys.filter((k) => k.startsWith("shortcut:"));
      const storedPairs = await AsyncStorage.multiGet(shortcutKeys);

      const parsed: ShortcutSchema[] = [];
      storedPairs.forEach(([_, value]) => {
        if (value) parsed.push(baseShortCutSchema.parse(JSON.parse(value)));
      });

      if (isMounted) setShortcuts(parsed);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      shortcuts,
      addShortcuts,
      deleteShortcuts,
      editShortcuts,
    }),
    [shortcuts, addShortcuts, deleteShortcuts, editShortcuts]
  );

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
};

export const useShortcuts = () => {
  const ctx = useContext(ShortcutContext);
  if (!ctx) {
    throw new Error("useShortcuts must be used within a ShortcutProvider");
  }
  return ctx;
};
