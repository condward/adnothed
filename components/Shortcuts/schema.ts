import ionicons from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json";
import { z } from "zod";
const ioniconNames = Object.keys(ionicons);

export const baseShortCutSchema = z.object({
  key: z.string().min(0).max(1),
  name: z.string().min(1),
  icon: z
    .string()
    .min(1)
    .refine((val) => ioniconNames.includes(val), {
      message: "Invalid Ionicon name",
    }),
});
export type BaseShortCutSchema = z.infer<typeof baseShortCutSchema>;

export const shortcutSchema = (
  icons: { key: string; icon: string; name: string }[]
) =>
  baseShortCutSchema
    .refine(({ icon }) => !icons.some((i) => i.icon === icon), {
      message: "Icon should not match an existing icon",
    })
    .refine(({ key }) => !icons.some((i) => i.key === key), {
      message: "Key should not match an existing key",
    })
    .refine(({ name }) => !icons.some((i) => i.name === name), {
      message: "Name should not match an existing name",
    });
export type ShortcutSchema = z.infer<ReturnType<typeof shortcutSchema>>;

export const shortcutsSchema = (
  existingIcons: { key: string; icon: string; name: string }[]
) =>
  z.object({
    newShortcut: shortcutSchema(existingIcons),
  });
export type ShortcutsSchema = z.infer<ReturnType<typeof shortcutsSchema>>;
