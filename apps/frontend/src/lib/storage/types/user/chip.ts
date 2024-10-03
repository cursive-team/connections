import { ChipIssuerSchema, ChipVariantSchema } from "@types";
import { z } from "zod";

export const ChipSchema = z.object({
  issuer: ChipIssuerSchema,
  id: z.string(),
  variant: ChipVariantSchema,
  publicKey: z.string(),
  privateKey: z.string(),
  registeredAt: z.coerce.date(),
});

export type Chip = z.infer<typeof ChipSchema>;
