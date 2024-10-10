import { ReactNode } from "react";

interface RegisterHeaderProps {
  title: ReactNode;
  subtitle?: string;
  description?: ReactNode;
}
export const RegisterHeader = ({
  title,
  subtitle,
  description,
}: RegisterHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      {typeof title === "string" ? (
        <span className="font-sans py-4 text-left text-[30px] leading-[30px] font-semibold text-primary tracking-[-0.22px]">
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
