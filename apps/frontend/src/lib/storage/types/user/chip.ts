import { ChipIssuerSchema, ChipVariantSchema } from "@types";
import { z } from "zod";

export const ChipSchema = z.object({
  issuer: ChipIssuerSchema,
  id: z.string(),
  variant: ChipVariantSchema,
  publicKey: z.string(),
  privateKey: z.string(),
});

export type Chip = z.infer<typeof ChipSchema>;
