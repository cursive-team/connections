import init, { gen_keys_js } from "./mp_psi";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { LannaData } from "../storage/types";

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

export const generateBitVectorFromLannaData = (
  data: LannaData
): Uint32Array => {
  const bitVector = new Uint32Array(1000).fill(0);

  // 0-4 reserved for desired connections
  bitVector[0] = data.desiredConnections.getHealthy ? 1 : 0;
  bitVector[1] = data.desiredConnections.enjoyMeals ? 1 : 0;
  bitVector[2] = data.desiredConnections.haveCoffee ? 1 : 0;
  bitVector[3] = data.desiredConnections.party ? 1 : 0;
  bitVector[4] = data.desiredConnections.attendTalks ? 1 : 0;

  return bitVector;
};
