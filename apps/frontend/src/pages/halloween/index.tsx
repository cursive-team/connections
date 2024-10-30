import { HalloweenModal } from "@/components/modals/HalloweenModal";
import { ProfileImage } from "@/components/ui/ProfileImage";
import AppLayout from "@/layouts/AppLayout";
import { NextSeo } from "next-seo";
import React, { useState } from "react";
import { MdKeyboardArrowRight as ArrowRight } from "react-icons/md";

export default function HalloweenPage() {
  const [isModalOpen, setIsMenuOpen] = useState(true);
  return (
    <>
      <NextSeo title="Halloween" />
      <HalloweenModal setIsOpen={setIsMenuOpen} isOpen={isModalOpen} />
      <AppLayout
        showFooter={false}
        back={{
          href: "/",
          label: "Back",
        }}
        className="flex flex-col gap-4"
      >
        <div
          className="h-[135px] bg-slate-50 w-full rounded-lg overflow-hidden mt-4"
          style={{
            backgroundImage: `url('')`,
            backgroundSize: "cover",
          }}
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <span className="text-primary text-lg font-sans font-bold">
              [title]
            </span>
            <span className="text-tertiary text-base font-sans font-normal">
              [description]
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-primary text-base font-sans font-bold">
              Vault entries
            </span>
            <div className="flex flex-col">
              <div className="flex flex-col gap-1 bg-white/10 p-3">
                <span className="text-primary text-sm font-normal">
                  Lorem, ipsum.
                </span>
                <span className="text-tertiary text-sm font-normal">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-primary text-base font-sans font-bold">
              Connections
            </span>
            <span className="text-tertiary text-base font-sans font-normal">
              You have intersecting entries in your vaults. Message to meet up!
            </span>
            <div className="flex gap-4 items-center">
              <ProfileImage user={null as any} />
              <div className="flex flex-col">
                <span className="text-sm font-medium font-sans text-primary">
                  Lorem, ipsum dolor.
                </span>
                <span className="text-xs font-medium font-sans text-[#FF9DF8]">
                  @username
                </span>
              </div>
              <ArrowRight size={18} className="text-white ml-auto" />
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
