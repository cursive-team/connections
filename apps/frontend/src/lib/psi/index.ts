import init, { gen_keys_js } from "./mp_psi";
import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { Connection, UserData } from "../storage/types";
import { sha256 } from "js-sha256";

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

const PSI_BIT_VECTOR_SIZE = 10000;
const COMMON_CONNECTIONS_BIT_VECTOR_SIZE = 9000;

export const generateBitVectorFromUserData = (
  userData: UserData,
  connections: Record<string, Connection>
): { bitVector: Uint32Array; indexMapping: Record<number, string[]> } => {
  const bitVector = new Uint32Array(PSI_BIT_VECTOR_SIZE).fill(0);
  const bitIndexToUsername: Record<number, string[]> = {};

  // 0-8999 reserved for common connections
  for (const connection of Object.values(connections)) {
    const { username, signaturePublicKey } = connection.user;
    const hash = sha256(signaturePublicKey);
    const bigIntHash = BigInt("0x" + hash);
    const index = Number(
      bigIntHash % BigInt(COMMON_CONNECTIONS_BIT_VECTOR_SIZE)
    );
    bitVector[index] = 1;

    if (!bitIndexToUsername[index]) {
      bitIndexToUsername[index] = [];
    }
    bitIndexToUsername[index].push(username);
  }

  // 9000-9999 reserved for edge city lanna data
  const lannaDesiredConnections = userData.lanna?.desiredConnections;
  if (lannaDesiredConnections) {
    bitVector[9000] = lannaDesiredConnections.getHealthy ? 1 : 0;
    bitVector[9001] = lannaDesiredConnections.cowork ? 1 : 0;
    bitVector[9002] = lannaDesiredConnections.enjoyMeals ? 1 : 0;
    bitVector[9003] = lannaDesiredConnections.learnFrontierTopics ? 1 : 0;
    bitVector[9004] = lannaDesiredConnections.findCollaborators ? 1 : 0;
    bitVector[9005] = lannaDesiredConnections.goExploring ? 1 : 0;
    bitVector[9006] = lannaDesiredConnections.party ? 1 : 0;
    bitVector[9007] = lannaDesiredConnections.doMentalWorkouts ? 1 : 0;
  }

  return { bitVector, indexMapping: bitIndexToUsername };
};

export const getOverlapFromPSIResult = (
  overlapIndices: number[],
  indexMapping: Record<number, string[]>
): { overlapUsers: string[]; overlapLannaDesiredConnections: string[] } => {
  const overlapUsers: string[] = [];
  const overlapLannaDesiredConnections: string[] = [];

  for (const index of overlapIndices) {
    if (index < COMMON_CONNECTIONS_BIT_VECTOR_SIZE) {
      if (indexMapping[index]) {
        overlapUsers.push(...indexMapping[index]);
      }
    } else {
      // Parse Lanna desired connections
      const lannaConnections = [
        "getHealthy",
        "cowork",
        "enjoyMeals",
        "learnFrontierTopics",
        "findCollaborators",
        "goExploring",
        "party",
        "doMentalWorkouts",
      ];
      const lannaIndex = index - COMMON_CONNECTIONS_BIT_VECTOR_SIZE;
      if (lannaIndex >= 0 && lannaIndex < lannaConnections.length) {
        overlapLannaDesiredConnections.push(lannaConnections[lannaIndex]);
      }
    }
  }

  return {
    overlapUsers,
    overlapLannaDesiredConnections,
  };
};
