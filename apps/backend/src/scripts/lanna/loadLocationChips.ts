import { PrismaClient } from "@prisma/client";
import { generateSignatureKeyPair } from "../../lib/util";
import { LocationChip } from "./locationChips";
import { v4 as uuidv4 } from "uuid";
// import { EDGE_CITY_LANNA_LOCATION_CHIPS } from "./locationChips";

const prisma = new PrismaClient();

async function loadLocationChips() {
  try {
    console.log("Starting to load location chips...");
    // const chipSource: LocationChip[] = EDGE_CITY_LANNA_LOCATION_CHIPS;
    const chipSource: LocationChip[] = [];
    const chipsToCreate = chipSource
      .map(({ uid, name, description }) => {
        const { signingKey, verifyingKey } = generateSignatureKeyPair();
        return {
          chipId: uid,
          chipIssuer: "EDGE_CITY_LANNA",
          chipVariant: "NTAG212",
          chipIsRegistered: true,
          chipPublicKey: verifyingKey,
          chipPrivateKey: signingKey,
          chipTapCount: 0,
          isLocationChip: true,
          locationId: uuidv4(),
          locationName: name,
          locationDescription: description,
        };
      })
      .filter((chip) => chip !== null);

    await prisma.chip.createMany({
      data: chipsToCreate,
      skipDuplicates: true,
    });

    console.log("Finished loading location chips.");
  } catch (error) {
    console.error("Error loading location chips:", error);
  } finally {
    await prisma.$disconnect();
  }
}

loadLocationChips();
