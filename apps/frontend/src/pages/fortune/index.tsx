import { cn } from "@/lib/frontend/util";
import { Ephesis, Poppins } from "next/font/google";
import React from "react";

const ephesis = Ephesis({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-ephesis",
});

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function FortunePage() {
  const score = 0;
  return (
    <div
      style={{
        backgroundImage: `url('/images/desktop-halloween.png')`,
      }}
      className={cn(
        "flex flex-col h-screen items-center justify-center bg-cover gap-10 lg:gap-2"
      )}
    >
      <span
        className={cn(
          "text-[80px] lg:text-[200px] text-[#FF8F3F] font-normal tracking-[-5.1px] rotate-[-10deg] text-center -mt-10",
          ephesis.variable,
          ephesis.className
        )}
      >
        Harmonized
      </span>
      <span
        className={cn(
          poppins?.variable,
          poppins?.className,
          "text-bold text-white text-[48px] lg:text-[96px] leading-none text-center -mt-10"
        )}
      >
        {`similarity score: ${score}`}
      </span>
    </div>
  );
}
