"use client";
import { Card } from "@/components/cards/Card";
import { Icons } from "@/components/icons/Icons";
import { CircleCard } from "@/components/ui/CircleCard";
import { FeedContent } from "@/components/ui/FeedContent";
import Link from "next/link";
import { MdKeyboardArrowRight as ArrowIcon } from "react-icons/md";

export const PheromonesCreate = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <span className="font-sans font-medium text-label-primary text-sm">
          Narrowcast{" "}
          <span className="italic">(private queries on social graph)</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/pheromones/cv" className="col-span-1">
            <Card.Base
              variant="gray"
              className="p-4 flex flex-col h-full gap-[10px]"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Clip className="text-icon-primary size-5" />
                  <span className="font-sans font-medium text-label-primary text-sm">
                    CV
                  </span>
                </div>
                <Icons.Plus className="text-icon-primary size-5" />
              </div>
              <span className="font-sans font-medium text-label-tertiary text-xs">
                Find jobs you qualify for.
              </span>
            </Card.Base>
          </Link>
          <Link href="/pheromones/jobs" className="col-span-1">
            <Card.Base
              variant="gray"
              className="p-4 flex flex-col h-full gap-[10px]"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Job className="text-icon-primary size-5" />
                  <span className="font-sans font-medium text-label-primary text-sm">
                    Job
                  </span>
                </div>
                <Icons.Plus className="text-icon-primary size-5" />
              </div>
              <span className="font-sans font-medium text-label-tertiary text-xs">
                Get matched with qualified candidates.
              </span>
            </Card.Base>
          </Link>
          <Card.Base
            variant="gray"
            className="p-4 flex flex-col gap-[10px] col-span-2 h-full"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Icons.Star className="text-icon-primary size-5" />
                <span className="font-sans font-medium text-label-primary text-sm">
                  Complimentary skill match
                </span>
              </div>
              <Icons.Plus className="text-icon-primary size-5" />
            </div>
            <span className="font-sans font-medium text-label-tertiary text-xs">
              Get matched with qualified candidates.
            </span>
          </Card.Base>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-sans font-medium text-label-primary text-sm">
          {`I'm Feeling Serendipitous`}
        </span>
        <Link href="/pheromones">
          <Card.Base
            variant="gray"
            className="p-4 flex flex-col gap-[10px] h-full"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Icons.Hourglass className="text-icon-primary size-5" />
                <span className="font-sans font-medium text-label-primary text-sm">
                  Meet someone new this hour
                </span>
              </div>
              <Icons.Plus className="text-icon-primary size-5" />
            </div>
            <span className="font-sans font-medium text-label-tertiary text-sm">
              Get matched with qualified candidates.
            </span>
          </Card.Base>
        </Link>
      </div>
    </div>
  );
};
