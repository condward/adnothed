import { z } from "zod";

export enum MessageTheme {
  DEFAULT = "default",
  MUSIC = "music",
  MOVIE = "movie",
}

export const MessageThemeIcons = {
  [MessageTheme.DEFAULT]: "document-text-outline",
  [MessageTheme.MUSIC]: "musical-notes-outline",
  [MessageTheme.MOVIE]: "videocam-outline",
};

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  time: z.string(),
  theme: z.nativeEnum(MessageTheme).optional().default(MessageTheme.DEFAULT),
});
export type MessageSchema = z.infer<typeof messageSchema>;
