"use client";
import { useState } from "react";
import { AppButton } from "@/components/ui/Button";
import { toast } from "sonner";
import { BASE_API_URL } from "@/config";
import AppLayout from "@/layouts/AppLayout";
import {
  verifyAttestationDoc,
  encryptWithPublicKey,
} from "@/lib/dataHash/enclave";
import { AppInput } from "@/components/ui/AppInput";
import { storage } from "@/lib/storage";
import { LannaHalloweenData } from "@/lib/storage/types/user/userData/lannaHalloweenData";
import { UserDataSchema } from "@/lib/storage/types/user/userData";
import { updateLannaHalloweenDataHashes } from "@/lib/dataHash";

export default function EnclavePage() {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string>("");
  const [input, setInput] = useState("");
  const [favoriteCharacter, setFavoriteCharacter] = useState("");
  const [interests, setInterests] = useState({
    movies: false,
    music: false,
    books: false,
  });

  const fetchAttestation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/enclave/attestation`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const pubKey = await verifyAttestationDoc(data.attestationDoc, true);
      setPublicKey(pubKey);
      console.log(pubKey);
      toast.success("Attestation fetched successfully!");
    } catch (error) {
      console.error("Error fetching attestation:", error);
      toast.error("Failed to fetch attestation");
    } finally {
      setLoading(false);
    }
  };

  const hashWithSecret = async () => {
    if (!publicKey) {
      toast.error("Must get public key first!");
      return;
    }

    if (!input) {
      toast.error("Must input data to send!");
      return;
    }

    console.log("hashing input", input);

    const encryptedInput = encryptWithPublicKey(publicKey, input);
    const response = await fetch(`${BASE_API_URL}/enclave/hash_with_secret`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedInput }),
    });

    if (response.ok) {
      const { inputWithSecretHash, secretHash } = await response.json();
      console.log("inputWithSecretHash", inputWithSecretHash);
      console.log("secretHash", secretHash);
    } else {
      toast.error("Failed to send data!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await storage.getUser();
    const session = await storage.getSession();
    if (!user || !session) {
      toast.error("Must be logged in to submit!");
      return;
    }

    const previousUserData = user.userData;

    const lannaHalloweenData: LannaHalloweenData = {
      favoriteCharacter: {
        value: favoriteCharacter,
        hashData:
          previousUserData.lannaHalloween?.favoriteCharacter?.value ===
          favoriteCharacter
            ? previousUserData.lannaHalloween?.favoriteCharacter?.hashData
            : undefined,
      },
      interests: {
        movies: {
          value: interests.movies ? "true" : "false",
          hashData:
            previousUserData.lannaHalloween?.interests.movies?.value ===
            (interests.movies ? "true" : "false")
              ? previousUserData.lannaHalloween?.interests.movies?.hashData
              : undefined,
        },
        music: {
          value: interests.music ? "true" : "false",
          hashData:
            previousUserData.lannaHalloween?.interests.music?.value ===
            (interests.music ? "true" : "false")
              ? previousUserData.lannaHalloween?.interests.music?.hashData
              : undefined,
        },
        books: {
          value: interests.books ? "true" : "false",
          hashData:
            previousUserData.lannaHalloween?.interests.books?.value ===
            (interests.books ? "true" : "false")
              ? previousUserData.lannaHalloween?.interests.books?.hashData
              : undefined,
        },
      },
    };

    const newUserData = {
      ...previousUserData,
      lannaHalloween: lannaHalloweenData,
    };
    const parsedUserData = UserDataSchema.parse(newUserData);

    try {
      await storage.updateUserData(parsedUserData);
      await updateLannaHalloweenDataHashes();
    } catch (error) {
      console.error("Error updating user data hashes:", error);
      toast.error("Failed to update user data hashes!");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">
          Enclave Attestation
        </h1>

        <AppButton
          onClick={fetchAttestation}
          loading={loading}
          className="w-full max-w-sm"
        >
          Fetch Attestation
        </AppButton>

        <div />

        <AppInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter data to encrypt"
        />

        <AppButton
          onClick={hashWithSecret}
          className="w-full max-w-sm"
          disabled={!publicKey}
        >
          Hash with Secret
        </AppButton>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm mt-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Favorite Movie Character
            </label>
            <AppInput
              value={favoriteCharacter}
              onChange={(e) => setFavoriteCharacter(e.target.value)}
              placeholder="Enter your favorite character"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests
            </label>
            <div className="space-y-2">
              {Object.entries(interests).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      setInterests((prev) => ({ ...prev, [key]: !value }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <AppButton type="submit" className="w-full">
            Submit
          </AppButton>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Check the browser console to see the attestation document
        </p>
      </div>
    </AppLayout>
  );
}
