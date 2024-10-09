import { PrismaClient } from "@prisma/client";
// import { EDGE_CITY_LANNA_CHIPS } from "./chips";

const prisma = new PrismaClient();

async function loadChips() {
  try {
    console.log("Starting to load chips...");
    // const chipSource: string[] = EDGE_CITY_LANNA_CHIPS;
    const chipSource: string[] = [];
    const chipsToCreate = chipSource
      .map((chipUrl) => {
        const uid = new URL(chipUrl).searchParams.get("uid");
        if (!uid) {
          console.error(`Invalid chip URL: ${chipUrl}`);
          return null;
        }
        return {
          chipId: uid,
          chipIssuer: "EDGE_CITY_LANNA",
          chipVariant: "NTAG212",
        };
      })
      .filter((chip) => chip !== null);

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
