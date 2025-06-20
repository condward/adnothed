import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  time: z.string(),
  name: z.string(),
});
export type MessageSchema = z.infer<typeof messageSchema>;
