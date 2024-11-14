import { AppButton } from "@/components/ui/Button";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { hotTakeLabels } from "@/common/constants";
import { logClientEvent } from "@/lib/frontend/metrics";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { CringeSlider } from "@/components/ui/CringeSlider";

export default function TensionsPage() {
  const router = useRouter();
  const [sliderValues, setSliderValues] = useState<number[]>(
    hotTakeLabels.map(() => 1)
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

      if (user.userData.hotTakesRating) {
        setSliderValues(
          user.userData.hotTakesRating.rating ??
          hotTakeLabels.map(() => 1)
        );
        setRevealAnswers(user.userData.hotTakesRating.revealAnswers ?? false);
        setContributeAnonymously(
          user.userData.hotTakesRating.contributeAnonymously ?? false
        );
      }
    };

    checkUser();
  }, [router]);

  const handleSliderChange = (index: number, value: number) => {
    setSliderValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      console.log(newValues);
      return newValues;
    });
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
        hotTakesRating: {
          rating: sliderValues,
          revealAnswers,
          contributeAnonymously,
        },
      });

      logClientEvent("submit_tensions", {});

      toast.success("Hot takes saved successfully!");
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
            Ethereum Hot Takes
          </span>
          <span className="text-[14px] font-normal text-label-tertiary">
            Slide the scale to discover intersections with others when you perform private set intersection.
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {hotTakeLabels.map((label, index) => (
            <CringeSlider
              label={label}
              key={index}
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
              Reveal my answers when running PSI with someone else.
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
