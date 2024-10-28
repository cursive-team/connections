import { createActivityBackup, createLocationBackup } from "@/lib/backup";
import { ChipTapResponse } from "@types";
import { TapDataSchema } from "@/lib/storage/types";
import { createLocationTapActivity } from "@/lib/activity";
import { saveBackupAndUpdateStorage } from "../../utils";
import { getUserAndSession } from "..";
import { LocationSchema } from "@/lib/storage/types/user/location";

export const addLocationTap = async (
  tapResponse: ChipTapResponse
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const tap = tapResponse.locationTap;
  if (!tap) {
    throw new Error("Location tap not found");
  }

  if (!tap.locationId || !tap.locationName || !tap.chipPublicKey) {
    throw new Error("Location ID, name, or chip public key not found");
  }

  const previousLocation = user.locations?.[tap.locationId];

  if (
    previousLocation &&
    previousLocation.chipPublicKey &&
    previousLocation.chipPublicKey !== tap.chipPublicKey
  ) {
    throw new Error("Cannot update location with a different chip");
  }

  // NOTE: For now, tapping a location chip will overwrite the existing location data
  const newLocationData = {
    id: tap.locationId,
    name: tap.locationName,
    description: tap.locationDescription ?? "",
    data: tap.locationData,
    chipIssuer: tapResponse.chipIssuer,
    chipPublicKey: tap.chipPublicKey,
  };

  // Taps will be appended to the existing taps
  const previousTaps = previousLocation?.taps ?? [];
  const newTap = TapDataSchema.parse({
    message: tap.message,
    signature: tap.signature,
    chipPublicKey: tap.chipPublicKey,
    chipIssuer: tapResponse.chipIssuer,
    timestamp: tap.timestamp,
  });
  const newTaps = [...previousTaps, newTap];

  const newLocation = LocationSchema.parse({
    ...newLocationData,
    taps: newTaps,
  });

  const locationBackup = createLocationBackup({
    email: user.email,
    password: session.backupMasterPassword,
    location: newLocation,
  });

  // Create activity for tapping a location
  const tapActivity = createLocationTapActivity(
    tap.locationId,
    tap.locationName
  );
  const tapActivityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity: tapActivity,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [locationBackup, tapActivityBackup],
  });
};
