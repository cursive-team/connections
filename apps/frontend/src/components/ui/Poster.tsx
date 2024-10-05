import type * as Classed from "@tw-classed/react";
import { classed } from "@tw-classed/react";

const PosterBase = classed.div("flex min-h-[270px] rounded-[5px] p-6", {
  variants: {
    variant: {
      primary: "bg-surface-content-primary",
      cinnamon: "bg-cinnamon",
    },
    full: {
      true: "w-full",
      false: "max-w-[180px] w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    full: false,
  },
});

const Circle = classed.div("size-[22px] rounded-full", {
  variants: {
    variant: {
      primary: "bg-icon-notice-primary",
      cinnamon: "bg-icon-notice-secondary",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type PosterVariants = Classed.VariantProps<typeof PosterBase>;

interface PosterProps extends PosterVariants {
  label: string;
  description?: string;
  full?: boolean;
}

export const Poster = ({
  label,
  description,
  full = false,
  variant = "primary",
}: PosterProps) => {
  return (
    <PosterBase variant={variant} full={full}>
      <div className="mt-auto flex flex-col gap-5">
        <Circle variant={variant} />
        <div className="flex flex-col gap-2">
          {label && (
            <span className="text-primary text-lg font-inter font-medium leading-6">
              {label}
            </span>
          )}
          {description && (
            <span className="text-primary text-sm font-inter font-normal tracking-[-0.084px] leading-[18px]">
              {description}
            </span>
          )}
        </div>
      </div>
    </PosterBase>
  );
};
