import { PrismaClient } from "@prisma/client";
import {LeaderboardEntry, ChipIssuer} from "@types";
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const prisma = new PrismaClient();

// To run from backend directory: `ts-node -r tsconfig-paths/register prisma/testing/leaderboardEntries.ts`

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  // Update for number of entries to create
  const count = 20

  const mapEntries = new Array<LeaderboardEntry>(count);

  for (let i = 0; i < count; i++) {
    mapEntries[i] = {
      username: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
      chipIssuer: ChipIssuer.TESTING,
      tapCount: randomInt(0, 200),
    };
  }

  await prisma.leaderboardEntry.createMany({
    data: mapEntries,
    skipDuplicates: true,
  });

  console.log("Seeded database with test LeaderboardEntry values");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
