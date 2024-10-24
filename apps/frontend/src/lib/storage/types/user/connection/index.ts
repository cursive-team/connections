import { z } from "zod";
import { nullToUndefined } from "@types";
import { UserDataSchema } from "../userData";
import { CommentDataSchema } from "./commentData";
import { TapDataSchema } from "./tapData";
import { PSIDataSchema } from "./psiData";
import { SentMessageSchema } from "./sentMessage";

export const ConnectionSchema = z.object({
  user: UserDataSchema,
  comment: nullToUndefined(CommentDataSchema),
  taps: z.array(TapDataSchema),
  psi: nullToUndefined(PSIDataSchema),
  sentMessages: nullToUndefined(z.array(SentMessageSchema)).default([]),
});

export type Connection = z.infer<typeof ConnectionSchema>;

export * from "./commentData";
export * from "./sentMessage";
export * from "./psiData";
export * from "./tapData";
