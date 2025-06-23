import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { messageSchema, MessageSchema } from "./schema";

export const useMessageStorage = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const deleteMessages = useCallback(async (ids: string[]) => {
    setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
    await AsyncStorage.multiRemove(ids.map((id) => `message:${id}`));
    setLastUpdated(new Date().toISOString());
  }, []);

  const addMessages = useCallback(
    async (message: MessageSchema) => {
      await deleteMessages([message.id]);
      await AsyncStorage.setItem(
        `message:${message.id}`,
        JSON.stringify(message)
      );
      setMessages((prev) => [...prev, message]);
      setLastUpdated(new Date().toISOString());
    },
    [deleteMessages]
  );

  useEffect(() => {
    async function fetchData() {
      const keys = await AsyncStorage.getAllKeys();
      const noteKeys = keys.filter((k) => k.startsWith("message:"));
      const messages = await AsyncStorage.multiGet(noteKeys);

      const arr: MessageSchema[] = [];
      messages.map(([key, value]) => {
        value && arr.push(messageSchema.parse(JSON.parse(value)));
      });

      setMessages(arr);
    }
    fetchData();
  }, [setMessages]);

  return useMemo(
    () => ({
      deleteMessages,
      addMessages,
      messages,
      lastUpdated,
    }),
    [addMessages, deleteMessages, messages, lastUpdated]
  );
};
