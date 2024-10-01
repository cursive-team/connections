import { BASE_API_URL } from "@/constants";
import {
  Json,
  RegisterChipRequest,
  RegisterChipResponseSchema,
  errorToString,
} from "@types";
import { storage } from "@/lib/storage";

interface RegisterChipArgs {
<<<<<<< HEAD
<<<<<<< HEAD
  authToken: string;
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
=======
  authToken: string;
>>>>>>> c10b8a5 (working chip registration and tap)
  tapParams: Record<string, string>;
  ownerDisplayName?: string;
  ownerBio?: string;
  ownerSignaturePublicKey?: string;
  ownerEncryptionPublicKey?: string;
  ownerUserData?: Json;
}

/**
 * Registers a new chip and updates backup and storage with the new chip.
 * @param args - The arguments for registering a chip.
<<<<<<< HEAD
<<<<<<< HEAD
 * @param args.authToken - The authentication token for the user.
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
=======
 * @param args.authToken - The authentication token for the user.
>>>>>>> c10b8a5 (working chip registration and tap)
 * @param args.tapParams - The parameters from the chip tap.
 * @param args.ownerDisplayName - The display name of the chip owner.
 * @param args.ownerBio - The bio of the chip owner.
 * @param args.ownerSignaturePublicKey - The signature public key of the chip owner.
 * @param args.ownerEncryptionPublicKey - The encryption public key of the chip owner.
 * @param args.ownerUserData - Additional user data for the chip owner.
 * @returns A promise that resolves to the RegisterChipResponse when the chip registration is complete.
 */
export async function registerChip(args: RegisterChipArgs): Promise<void> {
  try {
    const request: RegisterChipRequest = {
<<<<<<< HEAD
<<<<<<< HEAD
      authToken: args.authToken,
=======
>>>>>>> a49a19c (make api use null, client storage use undefined)
=======
      authToken: args.authToken,
>>>>>>> c10b8a5 (working chip registration and tap)
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
    const parsedData = RegisterChipResponseSchema.parse(data);

    // Add the chip to client storage, which includes storing backup
    await storage.addChip({
      issuer: parsedData.chipIssuer,
      id: parsedData.chipId,
      variant: parsedData.chipVariant,
      publicKey: parsedData.chipPublicKey,
      privateKey: parsedData.chipPrivateKey,
    });

    return;
  } catch (error) {
    console.error("Error registering chip:", errorToString(error));
    throw error;
  }
}
