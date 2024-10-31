import { ChipIssuer } from "@types";

export const communitiesEnum: { [key: string]: string } = {
  lanna: ChipIssuer.EDGE_CITY_LANNA,
  devcon: ChipIssuer.DEVCON_2024,
  testing: ChipIssuer.TESTING,
};

export const communitiesHumanReadable: { [key: string]: string } = {
  lanna: "Edge City Lanna",
  devcon: "Dev Con 2014",
  testing: "Testing",
};

export const ERROR_SUPPORT_CONTACT = "https://t.me/stevenelleman";

export const LANNA_HALLOWEEN_LOCATION_IDS = {
  main: "70d27858-3fde-4abe-bfc3-cbfe245a0f44",
  astrology: "49d0f233-3c72-471e-81c5-d37ea7d755a9",
  freak: "5f2712b1-cebc-49bf-9fe1-dc1dd8a133a6",
  fortune: "804cf423-da6d-44b5-997b-b78365070ea8",
};
export const LANNA_HALLOWEEN_LOCATION_IDS_ARRAY = [
  LANNA_HALLOWEEN_LOCATION_IDS.main,
  LANNA_HALLOWEEN_LOCATION_IDS.astrology,
  LANNA_HALLOWEEN_LOCATION_IDS.freak,
  LANNA_HALLOWEEN_LOCATION_IDS.fortune,
];
