import {
  LeaderboardDetails,
  LeaderboardEntries,
  LeaderboardEntry,
} from "@types";

interface LeaderboardProps {
  leaderboardEntries: LeaderboardEntries;
  leaderboardDetails: LeaderboardDetails;
  prize?: boolean;
}

const CURSIVE_USERNAMES = [
  "vivek",
  "rachel",
  "Tessla",
  "stevenelleman",
  "andrew",
];

export function Leaderboard({
  leaderboardEntries,
  leaderboardDetails,
  prize = false,
}: LeaderboardProps) {
  let lastTapCount = -1;
  let tiedPosition = -1;
  let cursiveCount = 0;

  return (
    <div>
      <div className="px-4 py-2 bg-white items-center justify-between items-start inline-flex w-full">
        <div className="grid grid-cols-[40px_1fr_1fr] justify-start items-start gap-3 flex w-full">
          <div className="text-[#090909]/40 text-xs text-center font-medium leading-[140%]">
            #
          </div>
          <div className="text-[#090909]/40 text-xs font-medium leading-[140%]">
            User name
          </div>
          <div className="text-right text-[#090909]/40 text-xs font-medium leading-[140%]">
            Total taps
          </div>
        </div>
      </div>

      {leaderboardEntries.entries.map((entry: LeaderboardEntry, index) => {
        let position = index + 1;

        // Handle ties
        if (entry.tapCount == lastTapCount) {
          // If equal, use tiedPosition (which is the first position, not last, of the tied entries)
          position = tiedPosition;
        } else {
          // If not equal, update tiedPosition
          tiedPosition = position;
        }

        // Update lastTapCount
        lastTapCount = entry.tapCount;

        const styling = {
          positionColor: "bg-black/20",
          positionTextColor: "",
          fontStyling: "text-[#090909]/60 text-[14px] font-normal",
          divider: false,
        };

        const adjustedIndex = prize ? index - cursiveCount : index;

        if (adjustedIndex > 9) {
          styling.fontStyling = "text-[#090909]/40 text-[14px] font-normal";
        }
        if (adjustedIndex == 9) {
          styling.divider = true;
        }

        let username = entry.username;
        if (CURSIVE_USERNAMES.includes(entry.username)) {
          cursiveCount++;
        }
        const tapCount = entry.tapCount;

        if (position == 1) {
          styling.positionColor = "bg-[#090909]";
          styling.positionTextColor = "text-white";
          styling.fontStyling = "text-[#090909] text-[16px] font-medium";
        }

        if (entry.username == leaderboardDetails.username) {
          styling.positionColor = "bg-[#FF9DF8]";
          styling.positionTextColor = "text-black";
          styling.fontStyling = "text-[#090909] text-[16px]font-medium";
          username += " (me)";

          if (leaderboardDetails.userPosition != tiedPosition) {
            // Update position if you're tied with another user
            leaderboardDetails.username = entry.username;
            leaderboardDetails.userPosition = tiedPosition;
          }
        }

        return (
          <div key={index}>
            <div className="h-6 px-4 justify-between items-center inline-flex w-full mb-1 mt-1">
              <div className="grow shrink basis-0 justify-start items-center gap-3 flex">
                <div
                  className={`w-10 h-6 px-1 py-2 ${styling.positionColor} rounded-[67px] justify-center items-center gap-2 flex`}
                >
                  <div
                    className={`text-center ${styling.positionTextColor} text-sm font-medium leading-[140%]`}
                  >
                    {position}
                  </div>
                </div>
                <div
                  className={`flex flex-row grow shrink basis-0 ${styling.fontStyling} leading-[140%]`}
                >
                  {username}
                  {prize && CURSIVE_USERNAMES.includes(username) && (
                    <>{" 💍"}</>
                  )}
                </div>
                <div className="justify-start items-start gap-[5px] flex">
                  <div
                    className={`text-right ${styling.fontStyling} font-['DM Sans'] leading-[140%]`}
                  >
                    {tapCount}
                  </div>
                </div>
              </div>
            </div>
            {styling.divider && (
              <div className="py-2">
                <div className="h-[0px] border border-black/20"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
