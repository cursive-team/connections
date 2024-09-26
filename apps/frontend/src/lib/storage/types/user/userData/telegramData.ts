import { z } from "zod";

export const TelegramDataSchema = z.object({
  username: z.string().optional(),
});

export type TelegramData = z.infer<typeof TelegramDataSchema>;
