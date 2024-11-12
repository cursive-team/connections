

export const flowerSize = (size: number): string => {
  if (size > 1000) {
    return "large";
  } else if (size > 500) {
    return "medium";
  } else if (size > 100) {
    return "small";
  } else {
    return "sprout";
  }
}