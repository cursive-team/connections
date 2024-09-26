import { z } from "zod";

export const ChipSchema = z.object({
  issuer: z.string(),
  id: z.string(),
  variant: z.string(),
  publicKey: z.string(),
  privateKey: z.string(),
});

export type Chip = z.infer<typeof ChipSchema>;
