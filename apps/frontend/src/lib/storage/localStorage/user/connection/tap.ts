import {
  createActivityBackup,
  createConnectionBackup,
  unregisteredUserCreateActivityBackup,
  unregisteredUserCreateConnectionBackup
} from "@/lib/backup";
import {
  TapDataSchema,
  TelegramData,
  TelegramDataSchema,
  TwitterData,
  TwitterDataSchema,
  SignalData,
  SignalDataSchema,
  InstagramData,
  InstagramDataSchema,
  FarcasterData,
  FarcasterDataSchema,
  Connection,
} from "@/lib/storage/types";
import { createTapActivity } from "@/lib/activity";
import { saveBackupAndUpdateStorage } from "../../utils";
import { getUser } from "..";
import { getSession } from "@/lib/storage/localStorage/session";
import { createUnregisteredUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { ChipTap } from "@/lib/storage/types/user/tap";

export const addUserTap = async (
  tapResponse: ChipTap
): Promise<void> => {
  const user = getUser();
  const session = getSession();
  let unregisteredUser = await storage.getUnregisteredUser();

  const tap = tapResponse.userTap;
  if (!tap) {
    throw new Error("Tap not found");
  }

  if (
    !tap.ownerUsername ||
    !tap.ownerSignaturePublicKey ||
    !tap.ownerEncryptionPublicKey
  ) {
    throw new Error("Tap owner username, display name, or keys not found");
  }

  let previousConnection: Connection | null = null;
  if (unregisteredUser && unregisteredUser.connections) {
    // In case where unregistered user exists, attempt to set from its connections
    // unregistered user and regular user should not exist as the same time
    previousConnection = unregisteredUser.connections[tap.ownerUsername];
  } else if (user) {
    previousConnection = user.connections[tap.ownerUsername];
  }

  let ownerTwitter: TwitterData | undefined;
  let ownerTelegram: TelegramData | undefined;
  let ownerSignal: SignalData | undefined;
  let ownerInstagram: InstagramData | undefined;
  let ownerFarcaster: FarcasterData | undefined;
  let ownerPronouns: string | undefined;
  if (
    tap.ownerUserData &&
    typeof tap.ownerUserData === "object" &&
    !Array.isArray(tap.ownerUserData)
  ) {
    if (
      "twitter" in tap.ownerUserData &&
      typeof tap.ownerUserData.twitter === "object"
    ) {
      try {
        ownerTwitter = TwitterDataSchema.parse(tap.ownerUserData.twitter);
      } catch (error) {
        console.error("Error parsing ownerUserData.twitter:", error);
      }
    }
    if (
      "telegram" in tap.ownerUserData &&
      typeof tap.ownerUserData.telegram === "object"
    ) {
      try {
        ownerTelegram = TelegramDataSchema.parse(tap.ownerUserData.telegram);
      } catch (error) {
        console.error("Error parsing ownerUserData.telegram:", error);
      }
    }
    if (
      "signal" in tap.ownerUserData &&
      typeof tap.ownerUserData.signal === "object"
    ) {
      try {
        ownerSignal = SignalDataSchema.parse(tap.ownerUserData.signal);
      } catch (error) {
        console.error("Error parsing ownerUserData.signal:", error);
      }
    }
    if (
      "instagram" in tap.ownerUserData &&
      typeof tap.ownerUserData.instagram === "object"
    ) {
      try {
        ownerInstagram = InstagramDataSchema.parse(tap.ownerUserData.instagram);
      } catch (error) {
        console.error("Error parsing ownerUserData.instagram:", error);
      }
    }
    if (
      "farcaster" in tap.ownerUserData &&
      typeof tap.ownerUserData.farcaster === "object"
    ) {
      try {
        ownerFarcaster = FarcasterDataSchema.parse(tap.ownerUserData.farcaster);
      } catch (error) {
        console.error("Error parsing ownerUserData.farcaster:", error);
      }
    }
    if (
      "pronouns" in tap.ownerUserData &&
      typeof tap.ownerUserData.pronouns === "string"
    ) {
      try {
        ownerPronouns = tap.ownerUserData.pronouns;
      } catch (error) {
        console.error("Error parsing ownerUserData.pronouns:", error);
      }
    }
  }

  // NOTE: For now, tapping a connection's chip will overwrite the existing connection data
  const ownerBio = tap.ownerBio === null ? "" : tap.ownerBio;
  const ownerDisplayName = tap.ownerDisplayName ?? "";
  const newConnectionUserData = {
    username: tap.ownerUsername,
    displayName: ownerDisplayName,
    bio: ownerBio,
    signaturePublicKey: tap.ownerSignaturePublicKey,
    encryptionPublicKey: tap.ownerEncryptionPublicKey,
    psiPublicKeyLink: tap.ownerPsiPublicKeyLink ?? undefined,
    twitter: ownerTwitter,
    telegram: ownerTelegram,
    signal: ownerSignal,
    instagram: ownerInstagram,
    farcaster: ownerFarcaster,
    pronouns: ownerPronouns,
  };

  // Taps will be appended to the existing taps
  const previousTaps = previousConnection?.taps ?? [];
  const newTap = TapDataSchema.parse({
    message: tap.message,
    signature: tap.signature,
    chipPublicKey: tap.chipPublicKey,
    chipIssuer: tapResponse.chipIssuer,
    timestamp: tap.timestamp,
  });
  const newTaps = [...previousTaps, newTap];

  // Comment is left unchanged
  const newComment = previousConnection?.comment ?? undefined;

  // Sent messages are left unchanged
  const newSentMessages = previousConnection?.sentMessages ?? [];

  const newConnection = {
    user: newConnectionUserData,
    taps: newTaps,
    comment: newComment,
    sentMessages: newSentMessages,
  };

  if (user && session) {
    const connectionBackup = createConnectionBackup({
      email: user.email,
      password: session.backupMasterPassword,
      connection: newConnection,
    });

    // Create activity for tapping a chip
    const tapActivity = createTapActivity(
      tapResponse.chipIssuer,
      ownerDisplayName,
      tap.ownerUsername
    );
    const tapActivityBackup = createActivityBackup({
      email: user.email,
      password: session.backupMasterPassword,
      activity: tapActivity,
    });

    await saveBackupAndUpdateStorage({
      user,
      session,
      newBackupData: [connectionBackup, tapActivityBackup],
    });
  } else {
    // NOTE: This is the *only* place where createUnregisteredUser and saveUnregisteredUser are called.
    // This is intention to ensure unregistered user is *only* created when a client has no user AND no session
    // (indicating that they're logged out / accountless)

    // If unregistered user does not exist already, initialize it
    if (!unregisteredUser) {
      unregisteredUser = await createUnregisteredUser();
    }

    // Construct tapActivity
    const tapActivity = createTapActivity(
      tapResponse.chipIssuer,
      ownerDisplayName,
      tap.ownerUsername
    );

    // Update connection record on unregisteredUser
    unregisteredUser.connections[newConnectionUserData.username] = newConnection;

    // Push activity onto user.activities
    unregisteredUser.activities.push(tapActivity)

    // Push backups onto user.backups
    const connectionBackup = unregisteredUserCreateConnectionBackup({connection: newConnection});
    const activityBackup = unregisteredUserCreateActivityBackup({activity: tapActivity});
    unregisteredUser.backups.push(connectionBackup);
    unregisteredUser.backups.push(activityBackup);

    // Save unregistered user
    await storage.saveUnregisteredUser(unregisteredUser);
  }
};
