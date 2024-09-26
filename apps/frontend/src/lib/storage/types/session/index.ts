import { z } from "zod";

export const SessionSchema = z.object({
  value: z.string(),
  expiresAt: z.coerce.date(),
  backupMasterPassword: z.string(),
  lastBackupFetchedAt: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;
