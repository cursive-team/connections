import { AppButton } from "@/components/ui/Button";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tensionPairs } from "@/common/constants";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { cn } from "@/lib/frontend/util";
import useSettings from "@/hooks/useSettings";

export default function TensionsPage() {
  const router = useRouter();
  const [sliderValues, setSliderValues] = useState<number[]>(
    tensionPairs.map(() => 50)
  );
  const [revealAnswers, setRevealAnswers] = useState(false);
  const [contributeAnonymously, setContributeAnonymously] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view your profile.");
        router.push("/");
        return;
      }

      if (user.userData.tensionsRating) {
        setSliderValues(
          user.userData.tensionsRating.tensionRating ??
            tensionPairs.map(() => 50)
        );
        setRevealAnswers(user.userData.tensionsRating.revealAnswers ?? false);
        setContributeAnonymously(
          user.userData.tensionsRating.contributeAnonymously ?? false
        );
      }
    };

    checkUser();
  }, [router]);

  const handleSliderChange = (index: number, value: number) => {
    setSliderValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    console.log(sliderValues);
  };

  const handleSave = async () => {
    setLoading(true);

    // Implement save functionality here
    console.log("Reveal answers:", revealAnswers);
    console.log("Contribute anonymously:", contributeAnonymously);
    // You can add logic to save these preferences to your backend or local storage

    const user = await storage.getUser();
    if (!user) {
      toast.error("Please log in to submit your tensions.");
      router.push("/");
      return;
    }

    try {
      await storage.updateUserData({
        ...user.userData,
        tensionsRating: {
          tensionRating: sliderValues,
          revealAnswers,
          contributeAnonymously,
        },
      });

      logClientEvent("submit_tensions", {});

      toast.success("Tensions saved successfully!");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Failed to save tensions. Please try again",
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
            Tensions
          </span>
          <span className="text-[14px] font-normal text-label-tertiary">
            Play the Tensions game from Summer of Protocols to practice your
            decision making skills. Upon tap, discover where you disagree to
            learn new perspectives. Use the slider to express how strongly you
            lean towards one of the two options.
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {tensionPairs.map((pair, index) => (
            <TensionSlider
              key={index}
              leftOption={pair[0]}
              rightOption={pair[1]}
              value={sliderValues[index]}
              onChange={(value) => handleSliderChange(index, value)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={revealAnswers}
              onChange={(e) => setRevealAnswers(e.target.checked)}
              className="form-checkbox h-5 w-5 text-label-primary"
            />
            <span className="text-sm text-label-primary">
              Reveal opposing answers when discovering overlap with someoone
              else.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={contributeAnonymously}
              onChange={(e) => setContributeAnonymously(e.target.checked)}
              className="form-checkbox h-5 w-5 text-label-primary"
            />
            <span className="text-sm text-label-primary">
              Anonymously contribute my answers to community dashboards.
            </span>
          </label>
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
