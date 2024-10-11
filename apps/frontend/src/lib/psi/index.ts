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

  // 0-7 reserved for desired connections
  bitVector[0] = data.desiredConnections.getHealthy ? 1 : 0;
  bitVector[1] = data.desiredConnections.cowork ? 1 : 0;
  bitVector[2] = data.desiredConnections.enjoyMeals ? 1 : 0;
  bitVector[3] = data.desiredConnections.learnFrontierTopics ? 1 : 0;
  bitVector[4] = data.desiredConnections.findCollaborators ? 1 : 0;
  bitVector[5] = data.desiredConnections.goExploring ? 1 : 0;
  bitVector[6] = data.desiredConnections.party ? 1 : 0;
  bitVector[7] = data.desiredConnections.doMentalWorkouts ? 1 : 0;

  return bitVector;
};
