// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CardBox = ({ label, value, }: any) => {
  return (
    <div className="grid items-center grid-cols-[auto_1fr_auto] gap-1">
      <span className="text-[14px] text-tertiary font-sans font-normal leading-6">
        {label}
      </span>
      <div className="h-[1px] bg-stroke-quaternary w-full"></div>
      <span className="text-[14px] text-right text-tertiary">
        {value ?? "N/A"}
      </span>
    </div>
  );
};