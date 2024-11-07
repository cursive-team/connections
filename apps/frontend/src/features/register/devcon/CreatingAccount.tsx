import React, { useState } from "react";
import { MdOutlineArrowBackIosNew as ArrowBack } from "react-icons/md";

import { AppButton } from "@/components/ui/Button";
import { cn } from "@/lib/frontend/util";
import useSettings from "@/hooks/useSettings";
import { AppCopy } from "@/components/ui/AppCopy";
import Image from "next/image";

const CreatingAccount: React.FC = () => {
  const { darkTheme } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      title: "Share and connect effortlessly",
      description:
        "We've securely encrypted your info. With a simple tap, you can share your details and make connections instantly—without compromising security.",
      image: "/images/devcon_register_cover.png",
    },
    {
      title: "Second slide title",
      description: "Description for the second slide goes here.",
      image: "/images/devcon_register_cover.png",
    },
    {
      title: "Final slide title",
      description: "Description for the final slide goes here.",
      image: "/images/devcon_register_cover.png",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col gap-3 grow pt-2">
      <span className="italic text-sm font-sans text-center text-label-primary">
        Setting up your account…
      </span>
      <div
        className={cn(
          "flex flex-col gap-3 bg-background rounded-lg p-4",
          darkTheme ? "border border-white/30" : "border border-black/20"
        )}
      >
        <div className="h-[120px] bg-black/10 w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={slides[currentSlide]?.image}
            height={120}
            width={400}
            alt={`slide image ${currentSlide}`}
            className="w-full object-cover aspect-video"
          />
        </div>

        <div className="flex flex-col gap-1 min-h-[100px]">
          <h2 className="text-lg text-label-primary font-semibold leading-none">
            {slides[currentSlide]?.title}
          </h2>
          <p className="text-label-tertiary text-sm font-sans font-normal">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-full  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowBack className="w-3 h-3 text-icon-primary" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index
                    ? "bg-icon-primary"
                    : "bg-icon-primary opacity-30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={cn(
              "p-2 rounded-full  disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ArrowBack className="w-3 h-3 rotate-180 text-icon-primary" />
          </button>
        </div>
      </div>

      <AppButton className="pt-3" disabled={currentSlide !== totalSlides - 1}>
        Start discovering connections
      </AppButton>

      <div className="text-center">
        <AppCopy />
      </div>
    </div>
  );
};

export default CreatingAccount;
