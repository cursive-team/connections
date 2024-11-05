import { AppButton } from "@/components/ui/Button";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GO_DEEPER_DETAILED_MAPPING } from "@/common/constants";
import { GoDeeperSchema } from "@/lib/storage/types/user/userData/lannaData";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { cn } from "@/lib/frontend/util";
import useSettings from "@/hooks/useSettings";
import { z, ZodObject } from "zod";

export default function GoDeeperPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  type GoDeeper = z.infer<typeof GoDeeperSchema>;
  const [journeys, setjourneys] = useState<GoDeeper>({
    adhd: false,
    asd: false,
    bipolar: false,
    depression: false,
    eatingDisorder: false,
    generalizedAnxiety: false,
    ocd: false,
    ptsd: false,
    schizophrenia: false,
    personalityDisorder: false,
  });

  useEffect(() => {
    const checkUser = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view your profile.");
        router.push("/");
        return;
      }

      if (user.userData.journeys) {
        setjourneys({
          ...journeys,
          ...user.userData.journeys
        });
      }
    };

    checkUser();
  }, [router]);
  const handleCheckboxChange = (journey: keyof GoDeeper) => {
    setjourneys((prevState) => ({
      ...prevState,
      [journey]: !prevState[journey]
    }));
  };


  const handleSave = async () => {
    setLoading(true);


    const user = await storage.getUser();
    if (!user) {
      toast.error("Please log in to submit your tensions.");
      router.push("/");
      return;
    }

    try {
      await storage.updateUserData({
        ...user.userData,
        journeys: journeys,
      });

      logClientEvent("submit_journeys", {});

      toast.success("journeys saved successfully!");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Failed to save journeys. Please try again",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      withContainer={false}
      showFooter={false}
      back={{ label: "Back", href: "/profile" }}
    >
      <div className="flex flex-col p-4 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-semibold text-label-primary">
          Go Deeper
          </span>
          <span className="text-[14px] font-normal text-label-tertiary">
          Find your community among others who share your mental health 
          and/or neurodivergent journeys, creating genuine bonds in a private, 
          supportive environment.
          </span>
        </div>
        <div className="flex flex-col gap-4">
        {Object.keys(journeys).map((journey) => (
        <div key={journey}>
          <label>
            <input
              type="checkbox"
              checked={journeys[journey as keyof GoDeeper]}
              onChange={() => handleCheckboxChange(journey as keyof GoDeeper)}
            />
            {GO_DEEPER_DETAILED_MAPPING[journey]}
          </label>
        </div>
      ))}
        </div>
        <AppButton
          type="button"
          onClick={handleSave}
          size="md"
          variant="primary"
          className="mt-4"
          loading={loading}
        >
          Save
        </AppButton>
      </div>
    </AppLayout>
  );
}

export function TensionSlider({
  leftOption,
  rightOption,
  value,
  onChange,
}: {
  leftOption: string;
  rightOption: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const { darkTheme } = useSettings();
  return (
    <div
      className={cn(
        "px-4 py-4 bg-card-gray rounded-lg flex flex-col gap-4",
        darkTheme && "!border !border-white"
      )}
    >
      <div className="text-right text-primary text-xs font-medium">
        {rightOption}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-left text-primary text-xs font-medium">
        {leftOption}
      </div>
    </div>
  );
}
