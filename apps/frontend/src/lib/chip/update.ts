import { BASE_API_URL } from "@/config";
import { errorToString, Json, UpdateChipRequest } from "@types";
import { storage } from "../storage";

interface UpdateChipArgs {
  authToken: string;
  tapParams: Record<string, string>;
  ownerDisplayName: string | null;
  ownerBio: string | null;
  ownerTwitterUsername: string | null;
  ownerTelegramUsername: string | null;
  ownerSignalUsername: string | null;
  ownerInstagramUsername: string | null;
}

export async function updateChip(args: UpdateChipArgs): Promise<void> {
  const ownerUserData: Json = {};
  if (args.ownerTwitterUsername) {
    ownerUserData.twitter = {
      username: args.ownerTwitterUsername,
    };
  };
  if (args.ownerTelegramUsername) {
    ownerUserData.telegram = {
      username: args.ownerTelegramUsername,
    };
  };
  if (args.ownerSignalUsername) {
    ownerUserData.signal = {
      username: args.ownerSignalUsername,
    };
  };
  if (args.ownerInstagramUsername) {
    ownerUserData.instagram = {
      username: args.ownerInstagramUsername,
    };
  };



  const request: UpdateChipRequest = {
    authToken: args.authToken,
    tapParams: args.tapParams,
    ownerDisplayName: args.ownerDisplayName ?? null,
    ownerBio: args.ownerBio ?? null,
    ownerUserData,
  };

  try {
    const response = await fetch(`${BASE_API_URL}/chip/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update chip");
    }

    const user = await storage.getUser();

    if (!user) {
      throw new Error("User not found");
    }

    await storage.updateUserData({
      ...user.userData,
      displayName: args.ownerDisplayName ?? "",
      bio: args.ownerBio ?? "",
      twitter: {
        username: args.ownerTwitterUsername ?? undefined,
      },
      telegram: {
        username: args.ownerTelegramUsername ?? undefined,
      },
      signal: {
        username: args.ownerSignalUsername ?? undefined,
      },
      instagram: {
        username: args.ownerInstagramUsername ?? undefined,
      },
    });
  } catch (error) {
    console.error("Error updating chip:", errorToString(error));
    throw error;
  }
}
