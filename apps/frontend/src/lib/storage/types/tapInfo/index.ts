import { TapParamsSchema, ChipTapResponseSchema } from "@types";
import { z } from "zod";

export const TapInfoSchema = z.object({
  tapParams: TapParamsSchema,
  tapResponse: ChipTapResponseSchema,
});

export type TapInfo = z.infer<typeof TapInfoSchema>;
