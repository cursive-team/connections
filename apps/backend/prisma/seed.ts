import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const testChips = [
    { chipId: "TEST001" },
    { chipId: "TEST002" },
    { chipId: "TEST003" },
    { chipId: "TEST004" },
    { chipId: "TEST005" },
  ];

<<<<<<< HEAD
  await prisma.chip.createMany({
=======
  await prisma.userChip.createMany({
>>>>>>> 0d1ba92 (backend implementation of chip registration and tapping)
    data: testChips.map((chip) => ({
      chipIssuer: "TESTING",
      chipId: chip.chipId,
      chipVariant: "NTAG212",
      chipIsRegistered: false,
      chipTapCount: 0,
    })),
    skipDuplicates: true,
  });

  console.log("Seeded database with test UserChip values");
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
