import { generateSignatureKeyPair } from "../src/lib/util";
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
    })),
    skipDuplicates: true,
  });

  const testEdgeCityLannaChips = [
    { chipId: "TESTLANNA001" },
    { chipId: "TESTLANNA002" },
    { chipId: "TESTLANNA003" },
    { chipId: "TESTLANNA004" },
    { chipId: "TESTLANNA005" },
  ];

  await prisma.chip.createMany({
    data: testEdgeCityLannaChips.map((chip) => ({
      chipIssuer: "EDGE_CITY_LANNA",
      chipId: chip.chipId,
      chipVariant: "NTAG212",
      chipIsRegistered: false,
      chipTapCount: 0,
    })),
    skipDuplicates: true,
  });

  const testDevcon2024Chips = [
    { chipId: "TESTDEVCON001" },
    { chipId: "TESTDEVCON002" },
    { chipId: "TESTDEVCON003" },
    { chipId: "TESTDEVCON004" },
    { chipId: "TESTDEVCON005" },
    { chipId: "04A28DEA637380" },
    { chipId: "04479DEA637380" },
    { chipId: "042D66D2141990" },
  ];

  await prisma.chip.createMany({
    data: testDevcon2024Chips.map((chip) => ({
      chipIssuer: "DEVCON_2024",
      chipId: chip.chipId,
      chipVariant: "NTAG424",
      chipIsRegistered: false,
      chipTapCount: 0,
    })),
    skipDuplicates: true,
  });

  const testEthIndia2024Chips = [
    { chipId: "TESTETHINDIA001" },
    { chipId: "TESTETHINDIA002" },
    { chipId: "TESTETHINDIA003" },
    { chipId: "TESTETHINDIA004" },
    { chipId: "TESTETHINDIA005" },
  ];

  await prisma.chip.createMany({
    data: testEthIndia2024Chips.map((chip) => ({
      chipIssuer: "ETH_INDIA_2024",
      chipId: chip.chipId,
      chipVariant: "NTAG212",
      chipIsRegistered: false,
      chipTapCount: 0,
    })),
    skipDuplicates: true,
  });

  const testLocationChips = [
    { chipId: "TESTLOC001" },
    { chipId: "TESTLOC002" },
    { chipId: "TESTLOC003" },
    { chipId: "TESTLOC004" },
    { chipId: "TESTLOC005" },
  ];

  await prisma.chip.createMany({
    data: testLocationChips.map((chip) => {
      const { signingKey, verifyingKey } = generateSignatureKeyPair();
      return {
        chipIssuer: "TESTING",
        chipId: chip.chipId,
        chipVariant: "NTAG212",
        chipIsRegistered: true,
        chipPublicKey: verifyingKey,
        chipPrivateKey: signingKey,
        chipTapCount: 0,
        isLocationChip: true,
        locationId: chip.chipId,
        locationName: `Test Location ${chip.chipId}`,
        locationDescription: `Test Description ${chip.chipId}`,
      };
    }),
    skipDuplicates: true,
  });

  console.log("Seeded database with test user and location chips");
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
