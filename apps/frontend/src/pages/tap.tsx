import { useEffect } from "react";
import { useRouter } from "next/router";
import { TapParams, ChipTapResponse, errorToString, ChipIssuer } from "@types";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import {
  tapChip,
  updateTapLeaderboardEntry,
  updateWorkoutLeaderboardEntry,
} from "@/lib/chip";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import {
  ERROR_SUPPORT_CONTACT,
  LANNA_HALLOWEEN_LOCATION_IDS_ARRAY,
} from "@/constants";

const TapPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleTap = async () => {
      logClientEvent("tap-chip", {});
      const { chipId } = router.query;

      if (!chipId || typeof chipId !== "string") {
        logClientEvent("tap-chip-invalid-chip-id", {});
        toast.error("Invalid tap! Please try again.");
        router.push("/");
        return;
      }

      const user = await storage.getUser();
      const session = await storage.getSession();

      try {
        const tapParams: TapParams = { chipId };
        const response: ChipTapResponse = await tapChip(tapParams);

        if (response.chipIsRegistered) {
          // Chip is registered and tapped successfully
          logClientEvent("tap-chip-registered", {});
          if (response.isLocationChip) {
            // Process valid location taps
            if (!response.locationTap || !response.locationTap.locationId) {
              // This shouldn't happen, but handle it just in case
              logClientEvent("tap-location-chip-missing-tap-data", {});
              console.error("Chip is registered but tap data is missing");
              toast.error("Bad tap!");
              router.push("/");
              return;
            }

            // If user is not logged in, direct them to sign in
            // TODO: Allow users to tap without being signed in
            if (!user || !session || session.authTokenExpiresAt < new Date()) {
              logClientEvent("tap-location-chip-not-logged-in", {});
              toast.error("You must be logged in to tap this chip!");
              router.push("/login");
              return;
            }

            // Save tap to local storage
            await storage.addLocationTap(response);

            // Update workout leaderboard entry if the chip issuer is Edge City Lanna
            if (response.chipIssuer === ChipIssuer.EDGE_CITY_LANNA) {
              await updateWorkoutLeaderboardEntry();
            }

            // Save tap to populate modal upon redirect
            await storage.saveTapInfo({ tapParams, tapResponse: response });

            // Routes for halloween party
            if (
              LANNA_HALLOWEEN_LOCATION_IDS_ARRAY.includes(
                response.locationTap.locationId
              )
            ) {
              logClientEvent("tap-halloween-chip", {
                id: response.locationTap.locationId,
              });
              router.push(`/halloween`);
            } else {
              router.push(`/locations/${response.locationTap.locationId}`);
            }
            return;
          } else {
            // Process valid user taps
            if (!response.userTap || !response.userTap.ownerUsername) {
              // This shouldn't happen, but handle it just in case
              logClientEvent("tap-chip-missing-tap-data", {});
              console.error("Chip is registered but tap data is missing");
              toast.error("Bad tap!");
              router.push("/");
              return;
            }

            // If user is not logged in, direct them to tap a new chip to register
            // TODO: Allow users to tap without being signed in
            if (!user || !session) {
              logClientEvent("tap-chip-not-logged-in", {});
              toast.error("Please tap a new chip to register!");
              router.push("/");
              return;
            }

            // If the auth token is expired, tell them to sign in again
            if (session.authTokenExpiresAt < new Date()) {
              logClientEvent("tap-chip-session-expired", {});
              toast.error("Your session has expired! Please sign in again.");
              router.push("/login");
              return;
            }

            if (user.userData.username === response.userTap.ownerUsername) {
              logClientEvent("tap-chip-same-user", {});
              router.push("/halloween");
              return;
            }

            // Save tap to local storage
            await storage.addUserTap(response);

            // Update leaderboard entry
            await updateTapLeaderboardEntry(response.chipIssuer);

            // Save tap to populate modal upon redirect
            await storage.saveTapInfo({ tapParams, tapResponse: response });
            router.push(`/people/${response.userTap.ownerUsername}`);
            return;
          }
        } else {
          // Chip is not registered
          logClientEvent("tap-chip-not-registered", {});
          // If user is not logged in, direct them to registration
          if (response.isLocationChip !== true && !session) {
            // Save tap to populate registration flow data
            logClientEvent("tap-chip-not-registered-not-logged-in", {});
            await storage.saveTapInfo({ tapParams, tapResponse: response });
            router.push("/register");
            return;
          } else {
            // For now, we do not allow users to register chips after account creation
            // TODO: Allow users to register chips after account creation
            logClientEvent("tap-chip-not-registered-logged-in", {});
            toast.error(
              "This chip is not registered yet. Please tell your friend to register it first!"
            );
            router.push("/profile");
            return;
          }
        }
      } catch (error) {
        console.error("Error tapping chip:", error);
        toast(
          SupportToast(
            "",
            true,
            "Error tapping chip",
            ERROR_SUPPORT_CONTACT,
            errorToString(error)
          )
        );
        router.push("/");
      }
    };

    if (router.isReady) {
      handleTap();
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <CursiveLogo isLoading />
      </div>
    </div>
  );
};

export default TapPage;
