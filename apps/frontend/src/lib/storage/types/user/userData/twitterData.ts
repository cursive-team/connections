import { z } from "zod";

export const TwitterDataSchema = z.object({
  username: z.string().optional(),
});

export type TwitterData = z.infer<typeof TwitterDataSchema>;
