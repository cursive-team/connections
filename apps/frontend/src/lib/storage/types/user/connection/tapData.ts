import { z } from "zod";

export const TapDataSchema = z.object({
  message: z.string(),
  signature: z.string(),
  chipPublicKey: z.string(),
  chipIssuer: z.string(),
  timestamp: z.coerce.date(),
});

export type TapData = z.infer<typeof TapDataSchema>;
