import { nullToUndefined } from "@types";
import { z } from "zod";

export const PSIDataSchema = z.object({
  sharedConnections: z.array(z.string()),
  sharedLannaInterests: z.array(z.string()),
  lastUpdatedAt: nullToUndefined(z.coerce.date()),
});

export type PSIData = z.infer<typeof PSIDataSchema>;
