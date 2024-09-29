import { BASE_API_URL } from "@/constants";
import {
  Json,
  RegisterChipRequest,
  RegisterChipResponse,
  errorToString,
} from "@types";

interface RegisterChipArgs {
<<<<<<< HEAD
  authToken: string;
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
  tapParams: Record<string, string>;
  ownerDisplayName?: string;
  ownerBio?: string;
  ownerSignaturePublicKey?: string;
  ownerEncryptionPublicKey?: string;
  ownerUserData?: Json;
}

/**
 * Registers a new chip.
 * @param args - The arguments for registering a chip.
<<<<<<< HEAD
 * @param args.authToken - The authentication token for the user.
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
 * @param args.tapParams - The parameters from the chip tap.
 * @param args.ownerDisplayName - The display name of the chip owner.
 * @param args.ownerBio - The bio of the chip owner.
 * @param args.ownerSignaturePublicKey - The signature public key of the chip owner.
 * @param args.ownerEncryptionPublicKey - The encryption public key of the chip owner.
 * @param args.ownerUserData - Additional user data for the chip owner.
 * @returns A promise that resolves to the RegisterChipResponse when the chip registration is complete.
 */
export async function registerChip(
  args: RegisterChipArgs
): Promise<RegisterChipResponse> {
  try {
    const request: RegisterChipRequest = {
<<<<<<< HEAD
      authToken: args.authToken,
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
      tapParams: args.tapParams,
      ownerDisplayName: args.ownerDisplayName ?? null,
      ownerBio: args.ownerBio ?? null,
      ownerSignaturePublicKey: args.ownerSignaturePublicKey ?? null,
      ownerEncryptionPublicKey: args.ownerEncryptionPublicKey ?? null,
      ownerUserData: args.ownerUserData ?? null,
    };

    const response = await fetch(`${BASE_API_URL}/chip/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to register chip");
    }

    const data = await response.json();
    return data as RegisterChipResponse;
  } catch (error) {
    console.error("Error registering chip:", errorToString(error));
    throw error;
  }
}
