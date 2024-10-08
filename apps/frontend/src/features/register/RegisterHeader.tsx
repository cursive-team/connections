import { ReactNode } from "react";

interface RegisterHeaderProps {
  title: ReactNode;
  subtitle?: string;
  description?: string;
}
export const RegisterHeader = ({
  title,
  subtitle,
  description,
}: RegisterHeaderProps) => {
  return (
    <div className="flex flex-col gap-8">
      {typeof title === "string" ? (
        <span className="font-sans text-center text-[30px] leading-[30px] font-semibold text-primary tracking-[-0.22px]">
          {title}
        </span>
      ) : (
        title
      )}
      {(subtitle || description) && (
        <div className="flex flex-col gap-4">
          {subtitle && (
            <span className="text-lg text-primary tracking-[-0.1px] font-semibold">
              {subtitle}
            </span>
          )}
          {description && (
            <span className=" font-sans text-base text-tertiary font-medium">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
