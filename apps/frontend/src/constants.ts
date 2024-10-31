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
  main: "48ff59fe-1053-4130-a0c6-c5939b329a8b",
  astrology: "4d705b93-ff03-46f0-9f8f-956cb8e853b0",
  freak: "eb57152c-bc4d-4466-9b4e-ad418889909a",
  fortune: "670015ae-0fd4-4450-ac5b-a814eaf30ca2",
};
export const LANNA_HALLOWEEN_LOCATION_IDS_ARRAY = [
  LANNA_HALLOWEEN_LOCATION_IDS.main,
  LANNA_HALLOWEEN_LOCATION_IDS.astrology,
  LANNA_HALLOWEEN_LOCATION_IDS.freak,
  LANNA_HALLOWEEN_LOCATION_IDS.fortune,
];
