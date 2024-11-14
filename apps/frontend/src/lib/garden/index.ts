import { sha256 } from "js-sha256";

export const flowerSize = (size: number): string => {
  console.log(size);
  if (size > 200) {
    return "large";
  } else if (size > 100) {
    return "medium";
  } else if (size > 50) {
    return "small";
  } else {
    return "sprout";
  }
};

export const flowerType = (
  contactUsername: string,
  userUsername: string | undefined
): string => {
  if (!userUsername) {
    return (parseInt(sha256(contactUsername).slice(0, 10), 16) % 10).toString();
  } else {
    return contactUsername < userUsername
      ? (
          parseInt(sha256(contactUsername + userUsername).slice(0, 10), 16) % 10
        ).toString()
      : (
          parseInt(sha256(userUsername + contactUsername).slice(0, 10), 16) % 10
        ).toString();
  }
};
