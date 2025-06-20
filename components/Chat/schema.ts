import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  time: z.string(),
  shortcutId: z.string(),
});
export type MessageSchema = z.infer<typeof messageSchema>;
