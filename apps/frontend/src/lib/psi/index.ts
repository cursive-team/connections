import init, { gen_keys_js } from "./mp_psi";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

export const psiBlobUploadClient = async (name: string, data: string) => {
  const newBlob: PutBlobResult = await upload(name, data, {
    access: "public",
    handleUploadUrl: "/api/psiBlobUploadServer",
  });

  return newBlob.url;
};

export const generatePSIKeyPair = async () => {
  await init();
  const gen_keys_output = gen_keys_js();

  return {
    psiPrivateKey: gen_keys_output.psi_keys,
    psiPublicKey: gen_keys_output.message_round1,
  };
};
