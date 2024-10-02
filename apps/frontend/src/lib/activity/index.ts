import { z } from "zod";
import { Activity, ActivityType } from "@/lib/storage/types";
import { ChipIssuer, ChipIssuerSchema } from "@types";

export const RegisterActivityDataSchema = z.object({});
export type RegisterActivityData = z.infer<typeof RegisterActivityDataSchema>;
export const createRegisterActivity = (): Activity => {
  return {
    type: ActivityType.REGISTER,
    serializedData: JSON.stringify({}),
    timestamp: new Date(),
  };
};

export const RegisterChipActivityDataSchema = z.object({
  chipIssuer: ChipIssuerSchema,
});
export type RegisterChipActivityData = z.infer<
  typeof RegisterChipActivityDataSchema
>;
export const createRegisterChipActivity = (
  chipIssuer: ChipIssuer
): Activity => {
  return {
    type: ActivityType.REGISTER_CHIP,
    serializedData: JSON.stringify({
      chipIssuer,
    }),
    timestamp: new Date(),
  };
};

export const TapActivityDataSchema = z.object({
  chipIssuer: ChipIssuerSchema,
  chipOwnerDisplayName: z.string(),
});
export type TapActivityData = z.infer<typeof TapActivityDataSchema>;
export const createTapActivity = (
  chipIssuer: ChipIssuer,
  chipOwnerDisplayName: string
): Activity => {
  return {
    type: ActivityType.TAP,
    serializedData: JSON.stringify({
      chipIssuer,
      chipOwnerDisplayName,
    }),
    timestamp: new Date(),
  };
};
