import { z } from "zod";

export const SessionSchema = z.object({
  authTokenValue: z.string(),
  authTokenExpiresAt: z.coerce.date(),
  backupMasterPassword: z.string(),
  lastBackupFetchedAt: z.coerce.date(),
});

export type Session = z.infer<typeof SessionSchema>;
