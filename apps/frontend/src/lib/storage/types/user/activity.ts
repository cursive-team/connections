import { z } from "zod";

export enum ActivityType {
  REGISTER = "REGISTER",
  REGISTER_CHIP = "REGISTER_CHIP",
  TAP = "TAP",
  PSI = "PSI",
}

export const ActivitySchema = z.object({
  type: z.nativeEnum(ActivityType),
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export type Activity = z.infer<typeof ActivitySchema>;
