import { appendBackupData, createConnectionBackup } from "@/lib/backup";
import { ChipTapResponse } from "@types";
import { getUser, saveUser } from "../../user";
import { getSession, saveSession } from "../../session";
import {
  TapDataSchema,
  TelegramData,
  TelegramDataSchema,
  TwitterData,
  TwitterDataSchema,
} from "@/lib/storage/types";

export const addTap = async (tapResponse: ChipTapResponse): Promise<void> => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  const tap = tapResponse.tap;
  if (!tap) {
    throw new Error("Tap not found");
  }

  if (
    !tap.ownerDisplayName ||
    !tap.ownerBio ||
    !tap.ownerSignaturePublicKey ||
    !tap.ownerEncryptionPublicKey
  ) {
    throw new Error("Tap owner keys not found");
  }

  const previousConnection = user.connections[tap.ownerSignaturePublicKey];

  let ownerTwitter: TwitterData | undefined;
  let ownerTelegram: TelegramData | undefined;
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
  }

  // NOTE: For now, tapping a connection's chip will overwrite the existing connection data
  const newConnectionUserData = {
    displayName: tap.ownerDisplayName,
    bio: tap.ownerBio,
    signaturePublicKey: tap.ownerSignaturePublicKey,
    encryptionPublicKey: tap.ownerEncryptionPublicKey,
    twitter: ownerTwitter,
    telegram: ownerTelegram,
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

  const newConnection = {
    user: newConnectionUserData,
    taps: newTaps,
    comment: newComment,
  };

  const connectionBackup = createConnectionBackup({
    email: user.email,
    password: session.backupMasterPassword,
    connection: newConnection,
  });

  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData: [connectionBackup],
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
