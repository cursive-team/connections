import { UserData } from "@/lib/storage/types";

export const ProfileImage = ({ user }: { user: UserData }) => {
  if (!user) return null;
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
    user.username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colorPalette.length;

  const backgroundColor = colorPalette[colorIndex];

  return (
    <div
      className={`size-10 rounded-full border border-quaternary/10 flex items-center justify-center`}
      style={{ backgroundColor }}
    >
      <span
        className={`text-lg font-normal text-primary`}
        style={{
          fontFamily: `"Times New Roman", Times, serif`,
        }}
      >
        {(() => {
          const nameParts = user.displayName.split(" ");
          if (nameParts.length >= 2) {
            return (
              nameParts[0][0] + nameParts[nameParts.length - 1][0]
            ).toUpperCase();
          } else {
            return user.displayName.slice(0, 2).toUpperCase();
          }
        })()}
      </span>
    </div>
  );
};
