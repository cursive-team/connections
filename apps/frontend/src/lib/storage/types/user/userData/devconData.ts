import { z } from "zod";
import {
  DevconScheduleSchema,
  nullToUndefined,
} from "@types";

export const DevconSchema = z.object({
  username: nullToUndefined(z.string()),
  schedule: nullToUndefined(DevconScheduleSchema)
});

export type DevconData = z.infer<typeof DevconSchema>;
