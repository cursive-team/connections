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

  await prisma.chip.createMany({
    data: testChips.map((chip) => ({
      chipIssuer: "TESTING",
      chipId: chip.chipId,
      chipVariant: "NTAG212",
      chipIsRegistered: false,
      chipTapCount: 0,
      chipAttendance: ["WEEK1", "WEEK2", "WEEK3", "WEEK4"],
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
