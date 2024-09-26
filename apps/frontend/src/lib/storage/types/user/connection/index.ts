import { z } from "zod";
import { UserDataSchema } from "../userData";
import { CommentDataSchema } from "./commentData";
import { TapDataSchema } from "./tapData";

export const ConnectionSchema = z.object({
  user: UserDataSchema,
  comment: CommentDataSchema.optional(),
  taps: z.array(TapDataSchema),
});

export type Connection = z.infer<typeof ConnectionSchema>;

export * from "./commentData";
export * from "./tapData";
