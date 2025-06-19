import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { messageSchema, MessageSchema } from "./schema";

export const useMessageStorage = () => {
  const [messages, setMessages] = useState<MessageSchema[]>([]);

  const deleteMessages = useCallback(async (ids: string[]) => {
    setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
    await AsyncStorage.multiRemove(ids.map((id) => `message:${id}`));
  }, []);

  const addMessages = useCallback(async (message: MessageSchema) => {
    setMessages((prev) => [...prev, message]);
    await AsyncStorage.setItem(
      `message:${message.id}`,
      JSON.stringify(message)
    );
  }, []);

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
    }),
    [addMessages, deleteMessages, messages]
  );
};
