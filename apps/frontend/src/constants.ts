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
