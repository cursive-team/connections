import { z } from "zod";
import { nullToUndefined } from "@types";

export const CommentDataSchema = z.object({
  note: nullToUndefined(z.string()),
  emoji: nullToUndefined(z.string()),
  goDeeper: nullToUndefined(z.boolean()),
  lastUpdatedAt: nullToUndefined(z.coerce.date()),
});

export type CommentData = z.infer<typeof CommentDataSchema>;
