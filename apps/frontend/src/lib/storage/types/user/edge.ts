import { z } from "zod";

export const DEVCON = "DEVCON2024"

export const EdgeMessageContentSchema = z.object({
  edgeId: z.string(),
  timestamp: z.coerce.date(),
  connectionUsername: z.string(),
});

export type EdgeMessageContent = z.infer<typeof EdgeMessageContentSchema>;

export const EdgeBackupSchema = z.object({
  edgeId: z.string(),
  timestamp: z.coerce.date(),
  sentHash: z.boolean(),
  connectionUsername: z.string(),
  isTapSender: z.boolean(),

  // When revocation is added, sentHash can be flipped to false and the db edge rows can expunged of hash info after submission of hash(priv sig key)
});

export type EdgeBackup = z.infer<typeof EdgeBackupSchema>;