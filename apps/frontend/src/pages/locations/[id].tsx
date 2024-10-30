"use client";
import { CheckInWeek } from "@/components/CheckInWeek";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { Icons } from "@/components/Icons";
import AppLayout from "@/layouts/AppLayout";
import { logClientEvent } from "@/lib/frontend/metrics";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import dynamic from "next/dynamic";
import locationSuccess from "../../../public/animations/location-success.json";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Location, User } from "@/lib/storage/types";
import { TapParams, ChipTapResponse } from "@types";

// Dynamically import the Lottie component with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

enum TapState {
  SUCCESS,
  ERROR,
  ALREADY_CHECKED,
}
interface LocationTapModalProps {
  username: string;
  locationName: string;
  tapDate: Date;
  tapState: TapState;
  onClose: () => void;
}

const LocationTapModal: React.FC<LocationTapModalProps> = ({
  username,
  locationName,
  tapDate,
  tapState,
  onClose,
}) => {
  const TapStateTitleMapping: Record<TapState, string> = {
    [TapState.SUCCESS]: "You're checked in!",
    [TapState.ERROR]: `${username}, your wristband is not valid.`,
    [TapState.ALREADY_CHECKED]: `${username}, you already checked-in.`,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[200]">
      <div className="flex flex-col bg-white p-6 pb-10 rounded-[32px] w-full min-h-[80vh] max-w-[80vw] overflow-y-auto relative">
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
                  {locationName}
                </span>
                <span className="text-base text-primary leading-none">
                  {tapDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  {tapDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
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
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [tapInfo, setTapInfo] = useState<{
    tapParams: TapParams;
    tapResponse: ChipTapResponse;
  } | null>(null);
  const [tapState, setTapState] = useState(TapState.SUCCESS);
  const [seeFullLeaderboard, setSeeFullLeaderboard] = useState(false);
  const [showTapModal, setShowTapModal] = useState(true);
  const [weeklyTapDays, setWeeklyTapDays] = useState<number[]>([]);

  useEffect(() => {
    const fetchLocationAndTapInfo = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      const location = user?.locations?.[id as string];
      if (!user || !session || !location) {
        console.error("Location not found");
        toast.error("Location not found");
        router.push("/profile");
        return;
      }
      setUser(user);
      setLocation(location);

      // Compute the days of the week that the user has tapped in
      const tapDays = computeWeeklyTapDays(
        location.taps?.map((tap) => new Date(tap.timestamp))
      );
      setWeeklyTapDays(tapDays);

      const savedTapInfo = await storage.loadSavedTapInfo();
      // Delete saved tap info after fetching
      await storage.deleteSavedTapInfo();
      // Show tap modal if tap info is for current location
      if (
        savedTapInfo &&
        savedTapInfo.tapResponse.locationTap?.locationId === id
      ) {
        logClientEvent("location-tap-chip-modal-shown", {});
        setTapInfo(savedTapInfo);
        setTapState(TapState.SUCCESS);
        setShowTapModal(true);
      }
    };

    fetchLocationAndTapInfo();
  }, [id, router]);

  // Compute the days of the week that the user has tapped in
  const computeWeeklyTapDays = (tapDates: Date[]): number[] => {
    // Get start of current week (Sunday) in user's timezone
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const tapDays: number[] = [];
    const today = now.getDay();

    // Check each day from Sunday up to today
    for (let day = 0; day <= today; day++) {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + day);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const hasTap = tapDates.some((tapDate) => {
        return tapDate >= dayStart && tapDate <= dayEnd;
      });

      if (hasTap) {
        tapDays.push(day);
      }
    }

    return tapDays;
  };

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
                    People who already have a ring are marked with a 💍.
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

  const username = user?.userData?.username;
  const locationName = location?.name;
  const tapDate = tapInfo?.tapResponse.locationTap?.timestamp;
  return (
    <>
      {showTapModal && username && locationName && tapDate && (
        <LocationTapModal
          username={username}
          locationName={locationName}
          tapDate={tapDate}
          tapState={tapState}
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
                {`${locationName || "Location"}`}
              </span>
              <span className="text-sm text-tertiary font-normal">
                {location?.description || "No description"}
              </span>
            </div>
            <CheckInWeek
              checkInCount={location?.taps?.length || 0}
              activeDaysIndexes={weeklyTapDays}
            />
          </div>
          {/* <div className="flex flex-col gap-4">
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
          </div> */}
        </div>
      </AppLayout>
    </>
  );
}
