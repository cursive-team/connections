import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LinkCardBox = ({ label, value, href }: any) => {
  return (
    <Link href={href ?? "#"} target="_blank">
      <div className="grid items-center grid-cols-[auto_1fr_auto] gap-1">
        <span className="text-[14px] text-label-tertiary font-sans font-normal leading-6">
          {label}
        </span>
        <div className="h-[1px] bg-stroke-quaternary w-full"></div>
        <span className="text-[14px] text-right" style={{ color: "#FF9DF8" }}>
          {value ?? "N/A"}
        </span>
      </div>
    </Link>
  );
};
