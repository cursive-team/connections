"use client";

import { CircleCard } from "@/components/ui/CircleCard";
import { FeedContent } from "@/components/ui/FeedContent";
import Link from "next/link";
import { MdKeyboardArrowRight as ArrowIcon } from "react-icons/md";

export const PheromonesReceived = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-2">
        <span className="text-[12px] text-label-quaternary font-semibold">
          Date
        </span>
        <ul className="w-full">
          <Link href="">
            <FeedContent
              color="transparent"
              className="!grid-cols-[1fr_140px]"
              title={
                <span className="text-label-tertiary">Lorem, ipsum dolor.</span>
              }
              icon={<CircleCard color="transparent" icon="received" />}
              description={
                <div className="items-center flex gap-1 ml-auto">
                  <span className="text-xs font-medium leading-4 text-label-tertiary font-sans ">
                    opt-in to match
                  </span>
                  <ArrowIcon />
                </div>
              }
            />
            <FeedContent
              color="transparent"
              className="!grid-cols-[1fr_140px]"
              title={
                <span className="text-label-tertiary">Lorem, ipsum dolor.</span>
              }
              icon={<CircleCard color="transparent" icon="received" />}
              description={
                <div className="items-center flex gap-1 ml-auto">
                  <span className="text-xs font-medium leading-4 text-label-tertiary font-sans ">
                    opt-in to match
                  </span>
                  <ArrowIcon />
                </div>
              }
            />
          </Link>
        </ul>
      </div>
    </div>
  );
};
