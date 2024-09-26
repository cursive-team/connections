import { z } from "zod";

export const CommentDataSchema = z.object({
  note: z.string().optional(),
  emoji: z.string().optional(),
  lastUpdatedAt: z.coerce.date().optional(),
});

export type CommentData = z.infer<typeof CommentDataSchema>;
