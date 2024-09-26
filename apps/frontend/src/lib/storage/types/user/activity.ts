import { z } from "zod";

export const ActivitySchema = z.object({
  type: z.string(),
  serializedData: z.string(),
  timestamp: z.coerce.date(),
});

export type Activity = z.infer<typeof ActivitySchema>;
