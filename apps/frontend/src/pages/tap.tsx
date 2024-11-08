import { useEffect } from "react";
import { useRouter } from "next/router";
import { ChipTapResponse, errorToString, ChipIssuer } from "@types";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import {
  registerChip,
  tapChip,
  updateTapLeaderboardEntry,
  updateLannaWorkoutLeaderboardEntry,
} from "@/lib/chip";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { shareableUserDataToJson } from "@/lib/user";
import { hasRecentAddChipRequest } from "@/lib/chip/addChip";

const TapPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleTap = async () => {
      logClientEvent("tap-chip", {});
      const tapParams = Object.fromEntries(
        Object.entries(router.query)
          .filter(([, value]) => typeof value === "string")
          .map(([key, value]) => [key, value as string])
      );

      if (Object.keys(tapParams).length === 0) {
        logClientEvent("tap-chip-invalid-tap-params", {});
        toast.error("Invalid tap! Please try again.");
        router.push("/");
        return;
      }

      const user = await storage.getUser();
      const session = await storage.getSession();

      // If the auth token is expired, tell them to sign in again
      if (session && session.authTokenExpiresAt < new Date()) {
        logClientEvent("tap-chip-session-expired", {});
        toast.error("Your session has expired! Please sign in again.");
        router.push("/login");
        return;
      }

      try {
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
            if (!user || !session) {
              logClientEvent("tap-location-chip-not-logged-in", {});
              toast.error("You must be logged in to tap this chip!");
              router.push("/login");
              return;
            }

            // Save tap to local storage
            await storage.addLocationTap(response);

            // Update workout leaderboard entry if the chip issuer is Edge City Lanna
            if (response.chipIssuer === ChipIssuer.EDGE_CITY_LANNA) {
              await updateLannaWorkoutLeaderboardEntry();
            }

            // Save tap to populate modal upon redirect
            await storage.saveTapInfo({ tapParams, tapResponse: response });

            router.push(`/locations/${response.locationTap.locationId}`);
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

            if (user.userData.username === response.userTap.ownerUsername) {
              logClientEvent("tap-chip-same-user", {});
              router.push("/community");
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
          } else if (response.isLocationChip !== true && session) {
            if (!user?.userData) {
              toast.error("Please sign in to bind a new chip!");
              router.push("/login");
              return;
            }

            const wantsToAddChip = hasRecentAddChipRequest();
            if (!wantsToAddChip) {
              logClientEvent(
                "tap-chip-logged-in-bind-new-chip-no-add-request",
                {}
              );
              toast.error(
                `Please tell your friend to tap their chip first! If you are adding a new chip, go to your profile and click "Add Chip" first!`
              );
              router.push("/profile");
              return;
            }

            // User logged in and unregistered chip is not locationChip, allow user to bind new chip to profile
            logClientEvent("tap-chip-logged-in-bind-new-chip", {});

            // Only include shareable data
            const shareableUserData = shareableUserDataToJson(user.userData);

            await registerChip({
              authToken: session.authTokenValue,
              tapParams: tapParams,
              ownerUsername: user.userData.username,
              ownerDisplayName: user.userData.displayName,
              ownerBio: user.userData.bio,
              ownerSignaturePublicKey: user.userData.signaturePublicKey,
              ownerEncryptionPublicKey: user.userData.encryptionPublicKey,
              ownerPsiPublicKeyLink: user.userData.psiPublicKeyLink,
              ownerUserData: shareableUserData,
            });

            toast.success("Successfully bound a new chip to your account");
            router.push("/profile");
            return;
          } else if (response.isLocationChip === true) {
            toast.error(
              "Cannot register a location chip, please pick up your NFC chip."
            );
            if (session) {
              router.push("/profile");
              return;
            } else {
              router.push("/");
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error tapping chip:", error);
        toast(
          SupportToast(
            "",
            true,
            errorToString(error),
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
