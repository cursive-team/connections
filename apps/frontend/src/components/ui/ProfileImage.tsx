import { UserData } from "@/lib/storage/types";

export const ProfileImage = ({ user }: { user: UserData }) => {
  const backgroundColor = `#${user.username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(16)
    .slice(0, 6)}`;

  const isDarkColor = (color: string): boolean => {
    const hex = color.replace(/^#/, "");
    const rgb = parseInt(hex, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  };

  const textColor = isDarkColor(backgroundColor) ? "white" : "black";

  return (
    <div
      className={`size-10 rounded-full border border-quaternary/10 flex items-center justify-center`}
      style={{ backgroundColor }}
    >
      <span className={`text-lg font-semibold text-${textColor}`}>
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
