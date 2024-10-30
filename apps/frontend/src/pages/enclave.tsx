"use client";
import { useState } from "react";
import { AppButton } from "@/components/ui/Button";
import { toast } from "sonner";
import { BASE_API_URL } from "@/config";
import AppLayout from "@/layouts/AppLayout";
import { verifyAttestationDoc, encryptWithPublicKey } from "@/lib/enclave";
import { AppInput } from "@/components/ui/AppInput";

export default function EnclavePage() {
  const [loading, setLoading] = useState(false);
  const [publicKey, setPublicKey] = useState<string>("");
  const [input, setInput] = useState("");

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
          className="w-full max-w-sm "
          disabled={!publicKey}
        >
          Hash with Secret
        </AppButton>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Check the browser console to see the attestation document
        </p>
      </div>
    </AppLayout>
  );
}
