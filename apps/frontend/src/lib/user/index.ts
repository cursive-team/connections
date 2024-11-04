import {
  UserData,
  UserDataSchema,
} from "@/lib/storage/types";
import { Json } from "@types";

// To prevent accidental sharing, default ensure shareable data needs to be added to this method
// TODO: offer a more expressive way to define / set shareable data based on community / persona
export const getUserShareableData = (userData: UserData): UserData => {
  const { username, displayName, bio, signaturePublicKey, encryptionPublicKey, psiPublicKeyLink, twitter, telegram, signal, instagram, farcaster, pronouns} = UserDataSchema.parse(userData);

  return {
    username,
    displayName,
    bio,
    signaturePublicKey,
    encryptionPublicKey,
    psiPublicKeyLink,
    twitter,
    telegram,
    signal,
    instagram,
    farcaster,
    pronouns,
  };
};

export const shareableUserDataToJson = (userData: UserData): Json => {
  const { username, displayName, bio, signaturePublicKey, encryptionPublicKey, psiPublicKeyLink, twitter, telegram, signal, instagram, farcaster, pronouns} = UserDataSchema.parse(userData);

  return {
    username: username || null,
    displayName: displayName || null,
    bio: bio || null,
    signaturePublicKey: signaturePublicKey || null,
    encryptionPublicKey: encryptionPublicKey || null,
    psiPublicKeyLink: psiPublicKeyLink || null,
    twitter: twitter || null,
    telegram: telegram || null,
    signal: signal || null,
    instagram: instagram || null,
    farcaster: farcaster || null,
    pronouns: pronouns || null,
  };
};