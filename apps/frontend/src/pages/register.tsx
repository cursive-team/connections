import RegisterDevcon from "@/features/register/devcon/Register";
import RegisterEthIndia from "@/features/register/ethindia/Register";
import { logClientEvent } from "@/lib/frontend/metrics";
import { storage } from "@/lib/storage";
import { TapInfo } from "@/lib/storage/types";
import { ChipIssuer } from "@types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Register: React.FC = () => {
  const router = useRouter();
  const [attemptedToLoadSavedTap, setAttemptedToLoadSavedTap] = useState(false);
  const [savedTap, setSavedTap] = useState<TapInfo | null>(null);

  useEffect(() => {
    const loadSavedTap = async () => {
      const tap = await storage.loadSavedTapInfo();
      if (!tap) {
        // TODO: Enable registration without a saved tap
        logClientEvent("register-no-saved-tap", {});
        toast.error("No saved tap found!");
        router.push("/");
        return;
      } else {
        await storage.deleteSavedTapInfo();

        if (tap.tapResponse.chipIsRegistered) {
          logClientEvent("register-chip-already-registered", {});
          toast.error("Chip is already registered!");
          router.push("/");
          return;
        }

        if (tap.tapResponse.chipIssuer === ChipIssuer.EDGE_CITY_LANNA) {
          toast.error("Edge City Lanna registration has ended.");
          router.push("/");
          return;
        }

        setSavedTap(tap);
      }
      setAttemptedToLoadSavedTap(true);
    };
    loadSavedTap();
  }, [router]);

  if (!attemptedToLoadSavedTap || !savedTap) {
    return null;
  }

  if (savedTap.tapResponse.chipIssuer === ChipIssuer.DEVCON_2024) {
    return <RegisterDevcon savedTap={savedTap} />;
  }

  if (savedTap.tapResponse.chipIssuer === ChipIssuer.ETH_INDIA_2024) {
    return <RegisterEthIndia savedTap={savedTap} />;
  }

  return null;
};

export default Register;
