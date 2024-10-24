import { z } from "zod";

export enum ActivityType {
  REGISTER = "REGISTER",
  REGISTER_CHIP = "REGISTER_CHIP",
  TAP = "TAP",
  PSI = "PSI",
  TAP_BACK_SENT = "TAP_BACK_SENT",
  TAP_BACK_RECEIVED = "TAP_BACK_RECEIVED",
}

export const ActivitySchema = z.object({
  type: z.nativeEnum(ActivityType),
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export type Activity = z.infer<typeof ActivitySchema>;
