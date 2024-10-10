import { useEffect } from "react";
import { useRouter } from "next/router";
import { TapParams, ChipTapResponse } from "@types";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { tapChip, updateLeaderboardEntry } from "@/lib/chip";

const TapPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleTap = async () => {
      const { chipId } = router.query;

      if (!chipId || typeof chipId !== "string") {
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
          if (!response.tap || !response.tap.ownerUsername) {
            // This shouldn't happen, but handle it just in case
            console.error("Chip is registered but tap data is missing");
            toast.error("Bad tap!");
            router.push("/");
            return;
          }

          // If user is not logged in, direct them to tap a new chip to register
          // TODO: Allow users to tap without being signed in
          if (!user || !session) {
            toast.error("Please tap a new chip to register!");
            router.push("/");
            return;
          }

          // If the auth token is expired, tell them to sign in again
          if (session.authTokenExpiresAt < new Date()) {
            toast.error("Your session has expired! Please sign in again.");
            router.push("/");
            return;
          }

          if (user.userData.username === response.tap.ownerUsername) {
            router.push("/");
            return;
          }

          // Update leaderboard entry
          await updateLeaderboardEntry(
            response.tap.ownerUsername,
            response.chipIssuer
          );

          // Save tap to local storage
          await storage.addTap(response);

          // Save tap to populate modal upon redirect
          await storage.saveTapInfo({ tapParams, tapResponse: response });
          router.push(`/people/${response.tap.ownerUsername}`);
          return;
        } else {
          // Chip is not registered
          // If user is not logged in, direct them to registration
          if (!session) {
            // Save tap to populate registration flow data
            await storage.saveTapInfo({ tapParams, tapResponse: response });
            router.push("/register");
            return;
          } else {
            // For now, we do not allow users to register chips after account creation
            // TODO: Allow users to register chips after account creation
            toast.error(
              "This chip is not registered yet. Please tell your friend to register it first!"
            );
            router.push("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error tapping chip:", error);
        toast.error("Error tapping chip");
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
        <div className="animate-spin rounded-full size-10 border-t-2 border-primary mt-10"></div>
      </div>
    </div>
  );
};

export default TapPage;
