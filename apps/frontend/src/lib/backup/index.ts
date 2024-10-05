import {
  AppendBackupDataRequest,
  AppendBackupDataResponseSchema,
  BackupData,
  BackupEntryType,
  CreateBackupData,
} from "@types";
import {
  Activity,
  ActivitySchema,
  Chip,
  ChipSchema,
  Connection,
  ConnectionSchema,
  User,
  UserData,
  UserDataSchema,
  UserSchema,
} from "@/lib/storage/types";
import { decryptBackupString, encryptBackupString } from "@/lib/crypto/backup";
import { BASE_API_URL } from "@/config";

/**
 * Parses a user object from backup data.
 * @param processUserBackupArgs - An object containing the following properties:
 * @param processUserBackupArgs.email - The email of the user.
 * @param processUserBackupArgs.password - The password of the user.
 * @param processUserBackupArgs.backupData - The backup data of the user.
 * @param processUserBackupArgs.existingUser - Optional. The existing user object to update.
 * @param processUserBackupArgs.previousSubmittedAt - Optional. The last processed backup date.
 * @returns An object containing the updated user and the new submitted date.
 */
export const processUserBackup = ({
  email,
  password,
  backupData,
  existingUser,
  previousSubmittedAt,
}: {
  email: string;
  password: string;
  backupData: BackupData[];
  existingUser?: User;
  previousSubmittedAt?: Date;
}): { user: User; submittedAt: Date } => {
  if (backupData.length === 0) {
    throw new Error("No backup data found");
  }

  let user = existingUser;
  let submittedAt = previousSubmittedAt || backupData[0].submittedAt;

  if (!user && backupData[0].backupEntryType !== BackupEntryType.INITIAL) {
    throw new Error("INITIAL backup entry not found");
  }

  for (const data of backupData) {
    // Check if the backup data is out of order
    if (data.submittedAt < submittedAt) {
      throw new Error("Backup data is out of order");
    }
    submittedAt = data.submittedAt;

    const decryptedData = decryptBackupString({
      encryptedData: data.encryptedData,
      authenticationTag: data.authenticationTag,
      iv: data.iv,
      email,
      password,
    });

    switch (data.backupEntryType) {
      case BackupEntryType.INITIAL:
        if (user) {
          throw new Error("INITIAL backup entry found for existing user");
        }
        user = UserSchema.parse(JSON.parse(decryptedData));
        break;
      case BackupEntryType.USER_DATA:
        if (!user) {
          throw new Error("USER_DATA backup entry found before INITIAL");
        }
        user.userData = UserDataSchema.parse(JSON.parse(decryptedData));
        break;
      case BackupEntryType.CHIP:
        if (!user) {
          throw new Error("CHIP backup entry found before INITIAL");
        }
        const chip: Chip = ChipSchema.parse(JSON.parse(decryptedData));
        user.chips.push(chip);
        break;
      case BackupEntryType.CONNECTION:
        if (!user) {
          throw new Error("CONNECTION backup entry found before INITIAL");
        }
        const connection: Connection = ConnectionSchema.parse(
          JSON.parse(decryptedData)
        );
        user.connections[connection.user.signaturePublicKey] = connection;
        break;
      case BackupEntryType.ACTIVITY:
        if (!user) {
          throw new Error("ACTIVITY backup entry found before INITIAL");
        }
        const activity: Activity = ActivitySchema.parse(
          JSON.parse(decryptedData)
        );
        user.activities.push(activity);
        break;
      default:
        throw new Error(`Invalid backup entry type: ${data.backupEntryType}`);
    }
  }

  if (!user) {
    throw new Error("User not found in backup");
  }

  return { user, submittedAt };
};

export interface AppendBackupDataArgs {
  email: string;
  password: string;
  authToken: string;
  newBackupData: CreateBackupData[];
  existingUser: User;
  previousSubmittedAt: Date;
}

export const appendBackupData = async ({
  email,
  password,
  authToken,
  newBackupData,
  existingUser,
  previousSubmittedAt,
}: AppendBackupDataArgs): Promise<{
  updatedUser: User;
  updatedSubmittedAt: Date;
}> => {
  // Append backup data to user
  const request: AppendBackupDataRequest = {
    authToken,
    newBackupData,
    previousSubmittedAt,
  };
  const response = await fetch(`${BASE_API_URL}/user/backup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  // Throw an error if the request failed
  if (!response.ok) {
    throw new Error(`Failed to append backup data: ${response.statusText}`);
  }

  // Parse the response
  const data = await response.json();
  const {
    success,
    unprocessedBackupData,
    newBackupData: appendedBackupData,
  } = AppendBackupDataResponseSchema.parse(data);

  // Throw an error if the request failed
  if (!success) {
    throw new Error("Failed to append backup data");
  }

  // Process unprocessed backup data and new backup data
  const allBackupData = [...unprocessedBackupData, ...appendedBackupData];
  const { user: updatedUser, submittedAt: updatedSubmittedAt } =
    processUserBackup({
      email,
      password,
      backupData: allBackupData,
      existingUser,
      previousSubmittedAt,
    });

  return { updatedUser, updatedSubmittedAt };
};

export interface CreateInitialBackupArgs {
  email: string;
  password: string;
  user: User;
}

/**
 * Creates an initial backup for a user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param user - The user object.
 * @returns The backup data.
 */
export const createInitialBackup = ({
  email,
  password,
  user,
}: CreateInitialBackupArgs): CreateBackupData => {
  const { authenticationTag, iv, encryptedData } = encryptBackupString({
    backup: JSON.stringify(user),
    email,
    password,
  });

  return {
    authenticationTag,
    iv,
    encryptedData,
    backupEntryType: BackupEntryType.INITIAL,
    clientCreatedAt: new Date(),
  };
};

export interface CreateUserDataBackupArgs {
  email: string;
  password: string;
  userData: UserData;
}

export const createUserDataBackup = ({
  email,
  password,
  userData,
}: CreateUserDataBackupArgs): CreateBackupData => {
  const { authenticationTag, iv, encryptedData } = encryptBackupString({
    backup: JSON.stringify(userData),
    email,
    password,
  });

  return {
    authenticationTag,
    iv,
    encryptedData,
    backupEntryType: BackupEntryType.USER_DATA,
    clientCreatedAt: new Date(),
  };
};

export interface CreateChipBackupArgs {
  email: string;
  password: string;
  chip: Chip;
}

export const createChipBackup = ({
  email,
  password,
  chip,
}: CreateChipBackupArgs): CreateBackupData => {
  const { authenticationTag, iv, encryptedData } = encryptBackupString({
    backup: JSON.stringify(chip),
    email,
    password,
  });

  return {
    authenticationTag,
    iv,
    encryptedData,
    backupEntryType: BackupEntryType.CHIP,
    clientCreatedAt: new Date(),
  };
};

export interface CreateConnectionBackupArgs {
  email: string;
  password: string;
  connection: Connection;
}

export const createConnectionBackup = ({
  email,
  password,
  connection,
}: CreateConnectionBackupArgs): CreateBackupData => {
  const { authenticationTag, iv, encryptedData } = encryptBackupString({
    backup: JSON.stringify(connection),
    email,
    password,
  });

  return {
    authenticationTag,
    iv,
    encryptedData,
    backupEntryType: BackupEntryType.CONNECTION,
    clientCreatedAt: new Date(),
  };
};

export interface CreateActivityBackupArgs {
  email: string;
  password: string;
  activity: Activity;
}

export const createActivityBackup = ({
  email,
  password,
  activity,
}: CreateActivityBackupArgs): CreateBackupData => {
  const { authenticationTag, iv, encryptedData } = encryptBackupString({
    backup: JSON.stringify(activity),
    email,
    password,
  });

  return {
    authenticationTag,
    iv,
    encryptedData,
    backupEntryType: BackupEntryType.ACTIVITY,
    clientCreatedAt: new Date(),
  };
};
