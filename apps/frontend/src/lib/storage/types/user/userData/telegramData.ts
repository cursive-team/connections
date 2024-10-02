import { z } from "zod";
import { nullToUndefined } from "@types";

export const TelegramDataSchema = z.object({
  username: nullToUndefined(z.string()),
});

export type TelegramData = z.infer<typeof TelegramDataSchema>;
