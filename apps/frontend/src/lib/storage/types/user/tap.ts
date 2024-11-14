import { z } from "zod";
import { ChipIssuerSchema, LocationTapSchema, UserTapSchema } from "@types";

export const ChipTapSchema = z.object({
  chipIssuer: ChipIssuerSchema,
  chipIsRegistered: z.boolean(),
  isLocationChip: z.boolean().nullable(),
  userTap: UserTapSchema.nullable(),
  locationTap: LocationTapSchema.nullable(),
  chipId: z.string(),
});

export type ChipTap = z.infer<typeof ChipTapSchema>;