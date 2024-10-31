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
  main: "db43acf0-dcb8-41f2-a98d-edc66233382a",
  astrology: "0e7990b1-736a-4680-9dd2-463865972161",
  freak: "26c55736-40ac-4ef9-95c2-1134b7c71125",
  fortune: "abf7fe0c-a4e1-46ef-96ec-a73f36345e6b",
};
export const LANNA_HALLOWEEN_LOCATION_IDS_ARRAY = [
  LANNA_HALLOWEEN_LOCATION_IDS.main,
  LANNA_HALLOWEEN_LOCATION_IDS.astrology,
  LANNA_HALLOWEEN_LOCATION_IDS.freak,
  LANNA_HALLOWEEN_LOCATION_IDS.fortune,
];
