import { ReactNode } from "react";

interface Item {
  children?: ReactNode;
  label?: string;
  description?: string;
}

interface NavigationMenuContentProps {
  left?: Item[];
  right?: Item[];
}

export const NavigationMenuContent = ({
  left = [],
  right = [],
}: NavigationMenuContentProps) => {
  return (
    <div
      className="grid grid-cols-2 gap-6 bg-surface-primary border border-stroke-quaternary p-6"
      style={{
        boxShadow: "0px 4px 6px 0px rgba(0, 0, 0, 0.09)",
      }}
    >
      <div className="flex flex-col gap-3">
        {left?.map(({ label, description, children = null }, index) => {
          return (
            <div key={index} className="flex flex-col gap-1">
              {label && (
                <span className="text-primary font-inter font-medium text-sm">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-tertiary font-inter font-normal text-sm">
                  {description}
                </span>
              )}
              {children}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        {right?.map(({ label, description, children = null }, index) => {
          return (
            <div key={index} className="flex flex-col gap-1">
              {label && (
                <span className="text-primary font-inter font-medium text-sm">
                  {label}
                </span>
              )}
              {description && (
                <span className="text-tertiary font-inter font-normal text-sm">
                  {description}
                </span>
              )}
              {children}
            </div>
          );
        })}
      </div>
    </div>
  );
};
