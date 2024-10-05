import { useEffect } from "react";
import { useRouter } from "next/router";
import { tapChip } from "@/lib/chip/tap";
import { TapParams, ChipTapResponse } from "@types";
import { toast } from "sonner";
import { storage } from "@/lib/storage";

const TapPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleTap = async () => {
      const { chipId } = router.query;

      if (typeof chipId !== "string") {
        console.error("Invalid chipId");
        toast.error("Invalid tap!");
        router.push("/");
        return;
      }

      const session = await storage.getSession();

      try {
        const tapParams: TapParams = { chipId };
        const response: ChipTapResponse = await tapChip(tapParams);

        if (response.chipIsRegistered) {
          // Chip is registered and tapped successfully
          if (!response.tap) {
            // This shouldn't happen, but handle it just in case
            console.error("Chip is registered but tap data is missing");
            toast.error("Bad tap!");
            router.push("/");
            return;
          }

          // If user is not logged in, direct them to tap a new chip to register
          // TODO: Allow users to tap without being signed in
          if (!session) {
            toast.error("Please tap a new chip to register!");
            router.push("/");
            return;
          }

          // Save tap to local storage
          await storage.addTap(response);

          // Save tap to populate modal upon redirect
          await storage.saveTapResponse(response);
          router.push(`/people/${response.tap.ownerUsername}`);
          return;
        } else {
          // Chip is not registered
          // If user is not logged in, direct them to registration
          if (!session) {
            // Save tap to populate registration flow data
            await storage.saveTapResponse(response);
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

    handleTap();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Processing Tap...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we process your tap.
        </p>
      </div>
    </div>
  );
};

export default TapPage;
