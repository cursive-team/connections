import { BackupData, CreateBackupData } from "@types";
import {
  Activity,
  Chip,
  Connection,
  User,
  UserData,
  UserSchema,
} from "@/lib/storage/types";
import { decryptBackupString, encryptBackupString } from "@/lib/crypto/backup";

/**
 * Parses a user object from a backup.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param backupData - The backup data of the user.
 * @returns The user.
 */
export const parseUserFromBackup = (
  email: string,
  password: string,
  backupData: BackupData[]
): User => {
  if (backupData.length === 0) {
    throw new Error("No backup data found");
  }

  if (backupData[0].backupEntryType !== "INITIAL") {
    throw new Error("First backup entry is not INITIAL");
  }

  let previousSubmittedAt: Date | undefined;
  let user: User | undefined;

  for (const data of backupData) {
    // Check if the backup data is out of order
    if (previousSubmittedAt && data.submittedAt < previousSubmittedAt) {
      throw new Error("Backup data is out of order");
    }
    previousSubmittedAt = data.submittedAt;

    switch (data.backupEntryType) {
      // For initial backup, decrypt the data and parse it as a User
      case "INITIAL":
        const { authenticationTag, iv, encryptedData } = data;
        const decryptedData = decryptBackupString({
          encryptedData,
          authenticationTag,
          iv,
          email,
          password,
        });
        user = UserSchema.parse(JSON.parse(decryptedData));
        break;
      // For other backup entry types, throw an error
      // TODO: Handle other backup entry types
      default:
        throw new Error(`Invalid backup entry type: ${data.backupEntryType}`);
    }
  }

  if (!user) {
    throw new Error("User not found in backup");
  }

  return user;
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
    backupEntryType: "INITIAL",
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
    backupEntryType: "USER_DATA",
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
    backupEntryType: "CHIP",
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
    backupEntryType: "CONNECTION",
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
    backupEntryType: "ACTIVITY",
    clientCreatedAt: new Date(),
  };
};
