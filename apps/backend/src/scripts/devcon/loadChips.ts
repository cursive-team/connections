import { PrismaClient } from "@prisma/client";
import {
  generateSignatureForPublicKey,
  generateSignatureKeyPair,
} from "../../lib/util";
// import { DEVCON_CHIP_UIDS } from "./chips";

const prisma = new PrismaClient();

async function loadChips() {
  try {
    console.log("Starting to load chips...");
    // const chipUids: string[] = DEVCON_CHIP_UIDS;
    const chipUids: string[] = [];
    const chipsToCreate = chipUids.map((uid) => {
      const { signingKey, verifyingKey } = generateSignatureKeyPair();
      const chipPublicKeySignature = JSON.stringify(
        generateSignatureForPublicKey(verifyingKey)
      );

      return {
        chipId: uid,
        chipIssuer: "DEVCON",
        chipVariant: "NTAG424",
        chipPrivateKey: signingKey,
        chipPublicKey: verifyingKey,
        chipPublicKeySignature,
      };
    });

    await prisma.chip.createMany({
      data: chipsToCreate,
      skipDuplicates: true,
    });

    console.log("Finished loading chips.");
  } catch (error) {
    console.error("Error loading chips:", error);
  } finally {
    await prisma.$disconnect();
  }
}

loadChips();
