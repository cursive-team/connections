import { z } from "zod";

export const EdgeDataSchema = z.object({
  id: z.string(),
  tapSenderId: z.string().nullable(),
  tapReceiverId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type EdgeData = z.infer<typeof EdgeDataSchema>
