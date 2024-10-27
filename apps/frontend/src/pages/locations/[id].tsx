"use client";
import { CheckInWeek } from "@/components/CheckInWeek";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import AppLayout from "@/layouts/AppLayout";
import { logClientEvent } from "@/lib/frontend/metrics";
import { useRouter } from "next/router";
import { useState } from "react";
import React from "react";
import dynamic from "next/dynamic";
import locationSuccess from "../../../public/animations/location-success.json";

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

enum TapState {
  SUCCESS,
  ERROR,
  ALREADY_CHECKED,
}
interface LocationTapModalProps {
  onClose: () => void;
  username: string;
}

const LocationTapModal: React.FC<LocationTapModalProps> = ({
  onClose,
  username,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tapState, setTapState] = useState(TapState.SUCCESS);

  const TapStateTitleMapping: Record<TapState, string> = {
    [TapState.SUCCESS]: "You're checked in!",
    [TapState.ERROR]: `${username}, your wristband is not valid.`,
    [TapState.ALREADY_CHECKED]: `${username}, you already checked-in.`,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[200]">
      <div className="flex flex-col bg-white p-6 pb-10 rounded-[32px] w-full min-h-[90vh] max-w-[90vw] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors"
        >
          <Icons.XClose size={24} />
        </button>

        <div className="flex flex-col gap-6">
          <span className=" font-bold text-2xl tracking-[-0.144px] text-center pt-14">
            {TapStateTitleMapping?.[tapState]}
          </span>
          {tapState === TapState.SUCCESS && (
            <>
              <div className="flex flex-col gap-2 text-center">
                <span className="text-xl font-bold tracking-[-0.1px]">
                  {username}
                </span>
                <span className="text-base text-primary leading-none">
                  Lorem, ipsum dolor.
                </span>
                <span className="text-base text-primary leading-none">
                  Lorem, ipsum dolor.
                </span>
              </div>
              <Lottie
                animationData={locationSuccess}
                loop={true}
                autoplay={true}
              />
            </>
          )}
          {[TapState.ALREADY_CHECKED, TapState.ERROR].includes(tapState) && (
            <div className="mx-auto">
              <Icons.CloseLocation size={260} className="text-red-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LocationPage() {
  const router = useRouter();
  const { location } = router.query;
  const [seeFullLeaderboard, setSeeFullLeaderboard] = useState(false);
  const [showTapModal, setShowTapModal] = useState(true);

  // TODO: implement
  const leaderboardDetails = {
    totalValue: 0,
    userPosition: 0,
    totalContributors: 0,
    username: "test",
  };
  const leaderboardEntries = {
    entries: [],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prize: any = null;

  if (seeFullLeaderboard) {
    let contributorMsg = `You are #${leaderboardDetails?.userPosition} of ${leaderboardDetails?.totalContributors} contributors!`;

    if (leaderboardDetails.userPosition == -1) {
      contributorMsg = "You are not on the leaderboard yet.";
    }

    return (
      <AppLayout
        withContainer={false}
        showFooter={false}
        header={
          <div>
            <div className="flex-row w-full px-1 pt-8 pb-4 bg-white justify-between items-center inline-flex">
              <div className="text-[#090909] text-xl font-semibold font-['DM Sans'] leading-tight">
                {`Total (${
                  Number.isInteger(leaderboardDetails?.totalValue)
                    ? leaderboardDetails?.totalValue
                    : leaderboardDetails?.totalValue?.toFixed(2)
                })`}
              </div>
              <div className="ml-auto">
                <Icons.XClose
                  size={24}
                  onClick={() => setSeeFullLeaderboard(false)}
                />
              </div>
            </div>
            <div className="py-4 px-1 flex-col justify-center items-start gap-2 inline-flex">
              <div className="text-[#090909] text-base font-bold font-['DM Sans'] leading-snug">
                {contributorMsg}
              </div>
              {prize && (
                <>
                  <div className="self-stretch text-[#090909]/50 text-sm font-normal font-['DM Sans'] leading-tight">
                    Win an NFC ring by ranking in the top 10 this week! Winners
                    are announced at Sunday dinner.
                  </div>
                  <div className="self-stretch text-[#090909]/50 text-sm font-normal font-['DM Sans'] leading-tight">
                    Cursive team members are marked with a 💍.
                    {prize && " They do not count in the top 10."}
                  </div>
                </>
              )}
            </div>
          </div>
        }
        className="pb-8"
      >
        <Leaderboard
          leaderboardEntries={{
            entries: leaderboardEntries?.entries?.slice(0, 100),
          }}
          leaderboardDetails={leaderboardDetails}
          prize={prize}
        />
      </AppLayout>
    );
  }

  return (
    <>
      {showTapModal && (
        <LocationTapModal
          username="Example"
          onClose={() => {
            setShowTapModal(false);
          }}
        />
      )}
      <AppLayout
        seoTitle={`${location}`}
        back={{
          label: "Back",
          href: "/",
        }}
        className="mx-auto"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col pt-4">
            <div className="flex flex-col gap-4 pb-6">
              <span className="text-xl text-primary font-bold">
                [Location Name]
              </span>
              <span className="text-sm text-tertiary font-normal">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum,
                labore!
              </span>
            </div>
            <CheckInWeek activeDaysIndexes={[2, 4]} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <Icons.Menu className="text-quaternary" />
              <span className="text-xs font-bold text-quaternary ml-2">
                This week
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className=" items-center flex justify-between">
              <span className="text-base font-bold text-primary font-sans">
                Top 5 contributors
              </span>
              <AppButton
                variant="outline"
                className="rounded-full max-w-[120px]"
                icon={<Icons.Star className="mr-2" />}
                onClick={() => {
                  logClientEvent("dashboard-leaderboard-clicked", {
                    location: location as string,
                  });
                  setSeeFullLeaderboard(true);
                }}
              >
                See all
              </AppButton>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
