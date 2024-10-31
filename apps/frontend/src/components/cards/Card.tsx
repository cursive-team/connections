import { classed } from "@tw-classed/react";
import { CSSProperties, HTMLAttributes, useEffect, useState } from "react";

const CardBase = classed.div("relative rounded overflow-hidden ", {
  variants: {
    variant: {
      primary: "bg-card-primary-bg border border-card-primary-border",
      secondary: "bg-card-secondary-bg border border-secondary-border",
      tertiary: "bg-card-tertiary-bg border border-secondary-border",
      gray: "bg-card-gray",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const CardTitle = classed.h1("text-sm leading-5 text-black");
const CardDescription = classed.span("text-xs leading-4 text-black");

export const CardProgressLine = classed.div(
  "absolute bottom-0 left-0 right-0 h-1",
  {
    variants: {
      color: {
        white: "bg-white",
        black: "bg-[#323232]",
      },
    },
    defaultVariants: {
      color: "white",
    },
  }
);

const CardProgress = ({ style }: HTMLAttributes<HTMLDivElement>) => {
  const [delayStyle, setDelayStyle] = useState<CSSProperties>({ width: "0%" });

  useEffect(() => {
    // delay the style to allow the progress line to animate
    setTimeout(() => {
      setDelayStyle({ ...style });
    }, 100);
  }, [style]);

  return (
    <div className="absolute bottom-0 right-0 left-0 h-1">
      <CardProgressLine
        color="white"
        className="delay-50 duration-500 w-0"
        style={{
          zIndex: 1,
          ...delayStyle,
        }}
      />
      <CardProgressLine color="black" className="w-full" />
    </div>
  );
};

const Card = {
  displayName: "Card",
  Base: CardBase,
  Title: CardTitle,
  Description: CardDescription,
  Progress: CardProgress,
};

export { Card };
