import { BackupData } from "@types";
import { User } from "@/lib/storage/user";

// TODO: Implement loading user from backup
export const loadUserFromBackup = (backupData: BackupData[]): User => {
  return {
    email: "",
    signaturePublicKey: "",
    encryptionPublicKey: "",
    lastMessageFetchedAt: new Date(),
    userData: {
      displayName: "",
      bio: "",
      signaturePublicKey: "",
      encryptionPublicKey: "",
    },
    chips: [],
    connections: {},
    activities: [],
  };
};
