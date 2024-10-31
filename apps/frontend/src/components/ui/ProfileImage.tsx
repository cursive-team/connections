import { cn } from "@/lib/frontend/util";
import { UserData } from "@/lib/storage/types";
import { Goudy_Bookletter_1911 } from "next/font/google";

const goudyBookletter = Goudy_Bookletter_1911({
  weight: "400",
  subsets: ["latin"],
});

export const getProfileBackgroundColor = (user: UserData) => {
  const colorPalette = [
    "#FF9DF8", // Light Pinkish Purple
    "#FFF59D", // Light Yellow
    "#9DFFB3", // Light Green
    "#FFC69D", // Light Orange
    "#FF9DAF", // Light Pink
    "#9DE8FF", // Light Blue
    "#D49DF5", // Light Purple
    "#FFF59D", // Light Yellow
    "#F5D49D", // Light Beige Orange
    "#F59DFF", // Soft Magenta
    "#9DF5E8", // Light Aqua
    "#9DAFFF", // Soft Lavender Blue
    "#F5A89D", // Soft Coral
  ];

  const colorIndex =
    user?.username
      .trim()
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorPalette.length;

  return colorPalette[colorIndex];
};

export const ProfileImage = ({
  user,
  size = 12,
}: {
  user: UserData;
  size?: number;
}) => {
  const halloweenMode: boolean = true;

  if (!user || Object.keys(user)?.length === 0)
    return (
      <div
        className="rounded-full bg-quaternary/20"
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      ></div>
    );

  let className: string = "rounded-full border border-quaternary/10 flex items-center justify-center";

  if (halloweenMode) {
    className += " bg-[#ff9df8]/30";
  }

  const backgroundColor = getProfileBackgroundColor(user);

  return (
    <div
      className={className}
      style={{
        backgroundColor: (!halloweenMode) ? backgroundColor : "",
        width: `${size * 4}px`,
        height: `${size * 4}px`,
      }}
    >
      <span
        className={cn(
          `text-primary ${goudyBookletter.className}`,
          size === 16
            ? "text-[25px] leading-[1] font-bold"
            : "font-normal text-[18px] leading-[1]"
        )}
      >
        {(() => {
          if (!user.displayName || user.displayName.length <= 2) {
            return user.username.slice(0, 2).toUpperCase();
          }

          const nameParts = user.displayName
            .trim()
            .split(" ")
            .filter((part) => part.length > 0);

          if (nameParts.length >= 2) {
            return (
              nameParts[0][0] + nameParts[nameParts.length - 1][0]
            ).toUpperCase();
          } else {
            return user.displayName?.slice(0, 2).toUpperCase();
          }
        })()}
      </span>
    </div>
  );
};
