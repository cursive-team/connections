import { z } from "zod";
import { nullToUndefined } from "@types";

export const TwitterDataSchema = z.object({
  username: nullToUndefined(z.string()),
});

export type TwitterData = z.infer<typeof TwitterDataSchema>;
