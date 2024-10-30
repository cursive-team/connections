import { BASE_API_URL } from "@/config";
import { LannaHalloweenData } from "@/lib/storage/types/user/userData/lannaHalloweenData";
import { encryptWithPublicKey, verifyAttestationDoc } from "./enclave";
import { storage } from "../storage";
import { ChipIssuer, CreateDataHashRequest, DataHashInput } from "@types";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";

export const LANNA_HALLOWEEN_LOCATION_ID = "TESTLOC001";

export const updateLannaHalloweenDataHashes = async (): Promise<void> => {
  const { user, session } = await storage.getUserAndSession();
  const updatedUser = user.userData;
  const lannaHalloweenData: LannaHalloweenData | undefined =
    updatedUser.lannaHalloween;
  if (!lannaHalloweenData || !updatedUser.lannaHalloween) {
    return;
  }

  // Get enclave attestation
  const getAttestationResponse = await fetch(
    `${BASE_API_URL}/data_hash/get_enclave_attestation`
  );
  if (!getAttestationResponse.ok) {
    throw new Error(`HTTP error! status: ${getAttestationResponse.status}`);
  }
  const data = await getAttestationResponse.json();
  const pubKey = await verifyAttestationDoc(data.attestationDoc, true);
  const pubKeyHash = sha256(pubKey);

  // Process all fields
  const dataHashInputs: DataHashInput[] = [];
  const favoriteCharacter = lannaHalloweenData.favoriteCharacter;
  const FAVORITE_CHARACTER_HASH_PREFIX = "LANNA_HALLOWEEN_FAVORITE_CHARACTER";
  if (
    favoriteCharacter &&
    (!favoriteCharacter.hashData ||
      favoriteCharacter.hashData.enclavePublicKeyHash !== pubKeyHash)
  ) {
    const dataIdentifier = uuidv4();
    const hashPreimage = `${FAVORITE_CHARACTER_HASH_PREFIX}_${favoriteCharacter.value}`;
    const hash = sha256(hashPreimage);
    const encryptedInput = encryptWithPublicKey(pubKey, hash);
    dataHashInputs.push({
      dataIdentifier,
      encryptedInput,
    });
    updatedUser.lannaHalloween.favoriteCharacter.hashData = {
      hashPrefix: FAVORITE_CHARACTER_HASH_PREFIX,
      enclavePublicKeyHash: pubKeyHash,
      lastUpdated: new Date(),
    };
  }

  const likesMovies = lannaHalloweenData.interests.movies;
  const LIKES_MOVIES_HASH_PREFIX = "LANNA_HALLOWEEN_LIKES_MOVIES";
  if (
    likesMovies &&
    (!likesMovies.hashData ||
      likesMovies.hashData.enclavePublicKeyHash !== pubKeyHash)
  ) {
    const dataIdentifier = uuidv4();
    const hashPreimage = `${LIKES_MOVIES_HASH_PREFIX}_${likesMovies}`;
    const hash = sha256(hashPreimage);
    const encryptedInput = encryptWithPublicKey(pubKey, hash);
    dataHashInputs.push({
      dataIdentifier,
      encryptedInput,
    });
    updatedUser.lannaHalloween.interests.movies.hashData = {
      hashPrefix: LIKES_MOVIES_HASH_PREFIX,
      enclavePublicKeyHash: pubKeyHash,
      lastUpdated: new Date(),
    };
  }

  const likesMusic = lannaHalloweenData.interests.music;
  const LIKES_MUSIC_HASH_PREFIX = "LANNA_HALLOWEEN_LIKES_MUSIC";
  if (
    likesMusic &&
    (!likesMusic.hashData ||
      likesMusic.hashData.enclavePublicKeyHash !== pubKeyHash)
  ) {
    const dataIdentifier = uuidv4();
    const hashPreimage = `${LIKES_MUSIC_HASH_PREFIX}_${likesMusic}`;
    const hash = sha256(hashPreimage);
    const encryptedInput = encryptWithPublicKey(pubKey, hash);
    dataHashInputs.push({
      dataIdentifier,
      encryptedInput,
    });
    updatedUser.lannaHalloween.interests.music.hashData = {
      hashPrefix: LIKES_MUSIC_HASH_PREFIX,
      enclavePublicKeyHash: pubKeyHash,
      lastUpdated: new Date(),
    };
  }

  const likesBooks = lannaHalloweenData.interests.books;
  const LIKES_BOOKS_HASH_PREFIX = "LANNA_HALLOWEEN_LIKES_BOOKS";
  if (
    likesBooks &&
    (!likesBooks.hashData ||
      likesBooks.hashData.enclavePublicKeyHash !== pubKeyHash)
  ) {
    const dataIdentifier = uuidv4();
    const hashPreimage = `${LIKES_BOOKS_HASH_PREFIX}_${likesBooks}`;
    const hash = sha256(hashPreimage);
    const encryptedInput = encryptWithPublicKey(pubKey, hash);
    dataHashInputs.push({
      dataIdentifier,
      encryptedInput,
    });
    updatedUser.lannaHalloween.interests.books.hashData = {
      hashPrefix: LIKES_BOOKS_HASH_PREFIX,
      enclavePublicKeyHash: pubKeyHash,
      lastUpdated: new Date(),
    };
  }

  // Create data hashes
  const createDataHashRequest: CreateDataHashRequest = {
    authToken: session.authTokenValue,
    chipIssuer: ChipIssuer.EDGE_CITY_LANNA,
    locationId: LANNA_HALLOWEEN_LOCATION_ID,
    enclavePublicKey: pubKey,
    dataHashInputs,
  };

  const createDataHashResponse = await fetch(
    `${BASE_API_URL}/data_hash/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createDataHashRequest),
    }
  );
  if (!createDataHashResponse.ok) {
    throw new Error(`HTTP error! status: ${createDataHashResponse.status}`);
  }
  await storage.updateUserData(updatedUser);
};
