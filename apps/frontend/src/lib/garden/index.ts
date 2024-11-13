import { sha256 } from "js-sha256";


export const flowerSize = (size: number): string => {
  if (size > 1000) {
    return "large";
  } else if (size > 500) {
    return "medium";
  } else if (size > 50) {
    return "small";
  } else {
    return "sprout";
  }
}

export const flowerType = (username: string): string => {
  return (parseInt(sha256(username).slice(0, 10), 16) % 10).toString();
}