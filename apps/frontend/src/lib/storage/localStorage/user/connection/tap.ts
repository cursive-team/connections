import { createActivityBackup, createConnectionBackup } from "@/lib/backup";
import { ChipTapResponse } from "@types";
import {
  TapDataSchema,
  TelegramData,
  TelegramDataSchema,
  TwitterData,
  TwitterDataSchema,
} from "@/lib/storage/types";
import { createTapActivity } from "@/lib/activity";
import { getUserAndSession, saveBackupAndUpdateStorage } from "../../utils";

export const addTap = async (tapResponse: ChipTapResponse): Promise<void> => {
  const { user, session } = getUserAndSession();

  const tap = tapResponse.tap;
  if (!tap) {
    throw new Error("Tap not found");
  }

  if (
    !tap.ownerUsername ||
    !tap.ownerDisplayName ||
    !tap.ownerSignaturePublicKey ||
    !tap.ownerEncryptionPublicKey ||
    !tap.ownerPsiPublicKeyLink
  ) {
    throw new Error("Tap owner username, display name, or keys not found");
  }

  const previousConnection = user.connections[tap.ownerUsername];

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
  const ownerBio = tap.ownerBio === null ? "" : tap.ownerBio;
  const newConnectionUserData = {
    username: tap.ownerUsername,
    displayName: tap.ownerDisplayName,
    bio: ownerBio,
    signaturePublicKey: tap.ownerSignaturePublicKey,
    encryptionPublicKey: tap.ownerEncryptionPublicKey,
    psiPublicKeyLink: tap.ownerPsiPublicKeyLink,
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

  // Create activity for tapping a chip
  const tapActivity = createTapActivity(
    tapResponse.chipIssuer,
    tap.ownerDisplayName,
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
};
