import { ChipIssuerSchema } from "@types";
import { z } from "zod";

export const TapDataSchema = z.object({
  message: z.string(),
  signature: z.string(),
  chipPublicKey: z.string(),
  chipIssuer: ChipIssuerSchema,
  timestamp: z.coerce.date(),
});

export type TapData = z.infer<typeof TapDataSchema>;
