import { ReactNode } from "react";

interface ContentCardProps {
  label?: string;
  children: ReactNode;
}

export const ContentCard = ({ label, children }: ContentCardProps) => {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-[6px] border border-stroke-secondary">
      {label && (
        <span className=" text-tertiary font-sans text-sm">{label}</span>
      )}
      {children}
    </div>
  );
};
