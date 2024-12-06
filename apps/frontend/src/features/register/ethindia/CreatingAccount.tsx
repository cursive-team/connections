import React, { useState } from "react";
import { MdOutlineArrowBackIosNew as ArrowBack } from "react-icons/md";

import { AppButton } from "@/components/ui/Button";
import { cn } from "@/lib/frontend/util";
import useSettings from "@/hooks/useSettings";
import { AppCopy } from "@/components/ui/AppCopy";
import Image from "next/image";

interface CreatingAccountProps {
  isCreatingAccount: boolean;
  handleFinishCreatingAccount: () => void;
}

const CreatingAccount: React.FC<CreatingAccountProps> = ({
  isCreatingAccount,
  handleFinishCreatingAccount,
}) => {
  const { darkTheme } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      title: "Build a private & verifiable social graph",
      description:
        "With a simple tap, you can share socials and a verifiable proof of meeting for use in ZK apps. This social graph is private to you and exportable.",
      image: "/images/social-graph-wide.png",
    },
    {
      title: "Discover commonalities, grow your garden!",
      description:
        "Use MPC to find out common contacts & interests without revealing anything else. The more overlap, the more a shared digital flower will grow!",
      image: "/images/week-wide.png",
    },
    {
      title: "Import data for richer connections",
      description:
        "Add hot takes and data from GitHub to discover more meaningful commonalities with other attendees! All the data you import is private to you.",
      image: "/images/buildclub_wide.png",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col grow">
      <div className="flex flex-col py-4">
        <span className="text-md italic text-center font-sans text-label-primary">
          {isCreatingAccount ? "Setting up your account…" : "Account created!"}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "flex flex-col gap-4 bg-background rounded-lg p-4",
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

            <div className="flex flex-col gap-2 min-h-[100px]">
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
        </div>
      </div>
      <div className="flex flex-col mt-auto gap-4">
        <AppButton
          className="pt-3"
          disabled={currentSlide !== totalSlides - 1 || isCreatingAccount}
          onClick={handleFinishCreatingAccount}
        >
          Start discovering connections
        </AppButton>
        <AppCopy className="text-center py-4" />
      </div>
    </div>
  );
};

export default CreatingAccount;
