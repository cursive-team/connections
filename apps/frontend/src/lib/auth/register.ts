import { BASE_API_URL } from "@/config";
import { generateEncryptionKeyPair } from "@/lib/crypto/encrypt";
import { generateSignatureKeyPair } from "@/lib/crypto/sign";
import { generateSalt, hashPassword } from "@/lib/crypto/backup";
import {
  ErrorResponse,
  UserRegisterRequest,
  UserRegisterResponseSchema,
  errorToString,
  BackupEntryType,
  CreateBackupData, ChipIssuer, LeaderboardEntryType,
} from "@types";
import {
  createActivityBackup,
  createConnectionBackup,
  createInitialBackup,
  processUserBackup
} from "@/lib/backup";
import { ActivitySchema, ConnectionSchema, UnregisteredUser, User } from "@/lib/storage/types";
import { storage } from "@/lib/storage";
import { createRegisterActivity } from "../activity";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";
import { updateLeaderboardEntry } from "@/lib/chip";

export interface RegisterUserArgs {
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio: string;
  telegramHandle?: string;
  twitterHandle?: string;
  registeredWithPasskey: boolean;
  passkeyAuthPublicKey?: string;
}

async function getUserKeys (): Promise<{
  encryptionPublicKey: string,
  encryptionPrivateKey: string,
  signaturePublicKey: string,
  signaturePrivateKey: string,
}> {
  const unregisteredUser = await storage.getUnregisteredUser();
  if (unregisteredUser) {
    return {
      encryptionPublicKey: unregisteredUser.userData.encryptionPublicKey,
      encryptionPrivateKey: unregisteredUser.encryptionPrivateKey,
      signaturePublicKey: unregisteredUser.userData.signaturePublicKey,
      signaturePrivateKey: unregisteredUser.signaturePrivateKey,
    }
  } else {
    const encryptionKeys = await generateEncryptionKeyPair();
    const signatureKeys =
      generateSignatureKeyPair();
    return {
      encryptionPublicKey: encryptionKeys.publicKey,
      encryptionPrivateKey: encryptionKeys.privateKey,
      signaturePublicKey: signatureKeys.verifyingKey,
      signaturePrivateKey: signatureKeys.signingKey,
    }
  }
}

/**
 * Registers a user and loads initial storage data.
 * @param args - Object containing user registration details
 * @param args.email - The backup salt for the user. Can be email for early users, username for new users. This is a quirk for backwards compatibility.
 * @param args.password - The password of the user.
 * @param args.username - The username of the user.
 * @param args.displayName - The display name of the user.
 * @param args.bio - The bio of the user.
 * @param args.telegramHandle - The telegram handle of the user.
 * @param args.twitterHandle - The twitter handle of the user.
 * @param args.registeredWithPasskey - Whether the user registered with a passkey.
 * @param args.passkeyAuthPublicKey - The public key of the authenticator if registering with passkey.
 */
export async function registerUser({
  email,
  password,
  username,
  displayName,
  bio,
  telegramHandle,
  twitterHandle,
  registeredWithPasskey,
  passkeyAuthPublicKey,
}: RegisterUserArgs): Promise<void> {

  const {encryptionPublicKey, encryptionPrivateKey, signaturePublicKey, signaturePrivateKey } = await getUserKeys();
  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  // Add activity for registering
  const registerActivity = createRegisterActivity();
  const user: User = {
    email,
    signaturePrivateKey,
    encryptionPrivateKey,
    serializedPsiPrivateKey: undefined,
    lastMessageFetchedAt: new Date(),
    userData: {
      username,
      displayName,
      bio,
      signaturePublicKey,
      encryptionPublicKey,
      psiPublicKeyLink: undefined,
      twitter: {
        username: twitterHandle,
      },
      telegram: {
        username: telegramHandle,
      },
    },
    chips: [],
    connections: {},
    activities: [registerActivity],
  };

  const initialBackupData = createInitialBackup({
    email,
    password,
    user,
  });

  const request: UserRegisterRequest = {
    username,
    email,
    signaturePublicKey,
    encryptionPublicKey,
    psiPublicKeyLink: undefined,
    passwordSalt,
    passwordHash,
    registeredWithPasskey,
    passkeyAuthPublicKey,
    initialBackupData,
  };
  const response = await fetch(`${BASE_API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const { error }: ErrorResponse = await response.json();
    throw new Error(error);
  }

  const rawData = await response.json();
  try {
    const validatedData = UserRegisterResponseSchema.parse(rawData);
    const { authToken, backupData } = validatedData;

    // Parse the user from the backup data
    const { user, submittedAt } = processUserBackup({
      email,
      password,
      backupData,
    });

    // Load the initial storage data
    await storage.loadInitialStorageData({
      user,
      authTokenValue: authToken.value,
      authTokenExpiresAt: authToken.expiresAt,
      backupMasterPassword: password,
      lastBackupFetchedAt: submittedAt,
    });

    return;
  } catch (error) {
    throw new Error(errorToString(error));
  }
}

export async function createUnregisteredUser(): Promise<UnregisteredUser> {
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } =
    await generateEncryptionKeyPair();
  const { verifyingKey: signaturePublicKey, signingKey: signaturePrivateKey } =
    generateSignatureKeyPair();

  const user: UnregisteredUser = {
    signaturePrivateKey,
    encryptionPrivateKey,
    lastMessageFetchedAt: new Date(),
    userData: {
      signaturePublicKey,
      encryptionPublicKey,
    },
    connections: {},
    locations: {},
    activities: [],
    backups: [],
  };
  await storage.saveUnregisteredUser(user);
  return user;
}

export async function applyBackupsToNewUser(password: string): Promise<void> {
  // Both these values should have been created in registerUser, if they don't, exit
  const user = await storage.getUser();
  const session = await storage.getSession();
  if (!user || !session) {
    return;
  }

  const unregisteredUser = await storage.getUnregisteredUser();
  let gaveOnboardingCredit = false;
  if (unregisteredUser) {
    const createBackups: CreateBackupData[] = [];
    for (const backup of unregisteredUser.backups) {
      try {
        switch (backup.type) {
          case BackupEntryType.CONNECTION:
            const connection = ConnectionSchema.parse(JSON.parse(backup.backup));

            // Give onboarding credit to first user connection
            if (!gaveOnboardingCredit) {
              await updateLeaderboardEntry({
                authToken: session.authTokenValue,
                chipIssuer: ChipIssuer.DEVCON_2024, // TODO: make this generic
                entryType: LeaderboardEntryType.USER_REGISTRATION_ONBOARDING,
                entryValue: 1,
                entryUsername: connection.user.username,
              });
              gaveOnboardingCredit = true;
            }

            const connectionBackupData = createConnectionBackup({
              email: user.email,
              password: password,
              connection
            });

            createBackups.push(connectionBackupData);
            break;

          case BackupEntryType.ACTIVITY:
            const activity = ActivitySchema.parse(JSON.parse(backup.backup));

            const activityBackupData = createActivityBackup({
              email: user.email,
              password: password,
              activity,
            });

            createBackups.push(activityBackupData);
            break;

          default:
            console.log(`Do not recognize type ${backup.type}.`)
            // This should never happen. Don't recognize type, just continue / skip.
        }
      } catch (error) {
        console.log(`error: ${errorToString(error)}`)
        // Nothing in this operation should disrupt registration flow
      }
    }
    await saveBackupAndUpdateStorage({user, session, newBackupData: createBackups})
    await storage.deleteUnregisteredUser();
  }
}
