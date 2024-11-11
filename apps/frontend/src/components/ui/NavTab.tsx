import { classed } from "@tw-classed/react";

export const NavTab = classed.button("text-sm duration-200", {
  variants: {
    active: {
      true: "font-semibold underline underline-offset-8 text-label-primary",
      false: "font-normal text-label-quaternary",
    },
  },
});
