import { classed } from "@tw-classed/react";

const getFirstTwoLetters = (content: string) => {
  const words = content.trim().split(/\s+/);

  const firstLetters = words.slice(0, 2).map((word) => word.charAt(0));

  while (firstLetters.length < 2) {
    firstLetters.push(firstLetters[0]);
  }

  return firstLetters.join("").toUpperCase(); // Optionally convert to uppercase
};
const AvatarBase = classed.div(
  "size-10 rounded-full flex flex-col items-center justify-center bg-surface-content-primary"
);

interface AvatarProps {
  label: string;
  src?: string;
}

export const Avatar = ({ src = undefined, label = "" }: AvatarProps) => {
  if (!src) {
    return <AvatarBase>{getFirstTwoLetters(label)}</AvatarBase>;
  }

  return (
    <AvatarBase
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
      }}
    ></AvatarBase>
  );
};
