import { AccessToken, AccessTokenSchema, DataImportSource } from "@types";
import { getUserAndSession } from ".";
import { saveBackupAndUpdateStorage } from "../utils";
import {
  createOAuthBackup,
  createOAuthDeletionBackup
} from "@/lib/backup";

export const saveOAuthAccessToken = async (
  app: DataImportSource,
  token: AccessToken
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const oauthBackup = createOAuthBackup({
    email: user.email,
    password: session.backupMasterPassword,
    oauthData: {
      app,
      token,
    },
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [oauthBackup],
  });
};

export const getOAuthAccessToken = async (
  app: DataImportSource
): Promise<AccessToken | undefined> => {
  const { user } = await getUserAndSession();

  if (user.oauth && user.oauth[app]) {
    return AccessTokenSchema.parse(user.oauth[app]);
  }

  return undefined;
};

export const deleteOAuthAccessToken = async (
  app: DataImportSource
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const oauthDeletionBackup = createOAuthDeletionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    oauthApp: {
      app,
    },
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [oauthDeletionBackup],
  });
};
