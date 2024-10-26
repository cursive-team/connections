import { z } from "zod";
import { UpdatableFieldSchema } from "@types";

export const StravaDataSchema = z.object({
  previousMonthRunDistance: UpdatableFieldSchema,
});

export type StravaData = z.infer<typeof StravaDataSchema>;
