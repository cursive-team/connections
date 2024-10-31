import { Icons } from "./icons/Icons";

interface CheckInWeekProps {
  checkInCount: number;
  activeDaysIndexes?: number[];
  label?: string;
}
export const CheckInWeek = ({
  checkInCount,
  activeDaysIndexes = [],
  label = "Check-ins",
}: CheckInWeekProps) => {
  const days = [
    { abbr: "Su", full: "Sunday", index: 0 },
    { abbr: "M", full: "Monday", index: 1 },
    { abbr: "T", full: "Tuesday", index: 2 },
    { abbr: "W", full: "Wednesday", index: 3 },
    { abbr: "Th", full: "Thursday", index: 4 },
    { abbr: "F", full: "Friday", index: 5 },
    { abbr: "Sa", full: "Saturday", index: 6 },
  ];

  return (
    <div className="flex flex-col gap-2 w-full ">
      <h2 className="text-base text-primary font-bold pt-2">{label}</h2>
      <div className="flex justify-between items-center text-4xl">
        <b>{checkInCount}</b>
      </div>
      <div className="flex flex-col gap-4 pb-4 mt-2">
        <div className="flex items-center">
          <Icons.Calendar className="text-quaternary" />
          <span className="text-xs font-bold text-quaternary ml-2">
            This week
          </span>
        </div>
        <div className="flex justify-between items-center">
          {days.map((day) => {
            const isActive = activeDaysIndexes?.includes(day?.index);

            return (
              <button
                key={day.abbr}
                className={`min-w-10 h-6 py-2 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? "bg-black text-white" : "bg-black/20 text-white"
                }`}
                aria-label={day.full}
              >
                {day.abbr}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
