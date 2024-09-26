import { BackupData } from "@types";
import { User } from "@/lib/storage/types";

// TODO: Implement loading user from backup
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
