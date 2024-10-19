import { z } from "zod";
import { UserDataSchema } from "../userData";
import { CommentDataSchema } from "./commentData";
import { TapDataSchema } from "./tapData";
import { PSIDataSchema } from "./psiData";
import { nullToUndefined } from "@types";

export const ConnectionSchema = z.object({
  user: UserDataSchema,
  comment: nullToUndefined(CommentDataSchema),
  taps: z.array(TapDataSchema),
  psi: nullToUndefined(PSIDataSchema),
});

export type Connection = z.infer<typeof ConnectionSchema>;

export * from "./commentData";
export * from "./psiData";
export * from "./tapData";
