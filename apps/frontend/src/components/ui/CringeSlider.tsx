import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/frontend/util";

export function CringeSlider({
  label = "",
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { darkTheme } = useSettings();
  return (
    <div
      className={cn(
        "px-4 py-4 bg-card-gray rounded-lg flex flex-col gap-4",
        darkTheme && "!border !border-white"
      )}
    >
      <span>{label}</span>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between ">
          <span>🔥</span>
          <span>😬</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          value={value}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between ">
          <span className="text-label-tertiary text-xs font-bold text-left">
            Based
          </span>
          <span className="text-label-tertiary text-xs font-bold text-center">
            Neutral
          </span>
          <span className="text-label-tertiary text-xs font-bold text-right">
            Cringe
          </span>
        </div>
      </div>
    </div>
  );
}
