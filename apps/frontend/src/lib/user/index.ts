import { UserData } from "@/lib/storage/types";

// To prevent accidental sharing, default ensure shareable data needs to be added to this method
// TODO: offer a more expressive way to define / set shareable data based on community / persona
export const getUserShareableData = (userData: UserData): UserData => {
  return {
    username: userData.username,
    displayName: userData.displayName,
    bio: userData.bio,
    signaturePublicKey: userData.signaturePublicKey,
    encryptionPublicKey: userData.encryptionPublicKey,
    psiPublicKeyLink: userData.psiPublicKeyLink,
    twitter: userData.twitter,
    telegram: userData.telegram,
    signal: userData.signal,
    instagram: userData.instagram,
    farcaster: userData.farcaster,
    pronouns: userData.pronouns,
  };
};