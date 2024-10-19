import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import { ProfileImage } from "@/components/ui/ProfileImage";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/lib/frontend/util";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function CommunityDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [progress, setProgress] = useState(0);

  const progressPercentage = 50;
  const totalContributors = 200;
  const background = "/images/register-main-cover-compressed.png";
  const position = 0;
  const title = "Lorem ipsum";
  const description =
    "Feugiat elit ut consectetur sit sollicitudin felis posuere dolor id. Faucibus amet egestas sed elementum nulla mattis ornare.";
  const type = "active"; // 'active' for purple progress bar or 'community' for gray one

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout
      seoTitle=""
      showFooter={false}
      withContainer={false}
      back={{
        href: "/community",
        label: "Back",
      }}
    >
      <div className="flex flex-col divide-y divide-y-quaternary">
        <div className="flex flex-col gap-4 p-4">
          <div
            className="rounded-lg overflow-hidden h-[135px] w-full bg-gray-200"
            style={
              background
                ? {
                    backgroundSize: "cover",
                    background: `url(${background})`,
                  }
                : {}
            }
          ></div>
          <div className="flex flex-col flex-1">
            <p className="text-xs font-normal text-quaternary">{`${
              (position ?? 0) > 0 ? `#${position} of ` : ""
            } ${totalContributors} contributors`}</p>
            <h2 className="text-xl font-bold leading-none text-primary">
              {title}
            </h2>
            <div className="w-full bg-[#f1f1f1] rounded-full h-[7px] mt-2 mb-1 overflow-hidden">
              <div
                className={cn(
                  "h-[7px] rounded-full transition-all duration-1000 ease-out",
                  type === "active"
                    ? "bg-active-progress"
                    : "bg-community-progress"
                )}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        {description && (
          <div className="p-4">
            <p className="text-sm font-normal text-primary">{description}</p>
          </div>
        )}

        <div className="p-4">
          <div className="flex flex-col gap-2">
            <div className=" items-center flex justify-between">
              <span className="text-base font-bold text-primary font-sans">
                Top 5 contributors
              </span>
              <AppButton
                variant="outline"
                className="rounded-full max-w-[120px]"
                icon={<Icons.Star className="mr-2" />}
              >
                See all
              </AppButton>
            </div>
            <div></div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-primary font-sans">
              Organizer
            </span>
            <div className="flex items-center gap-4 py-4">
              <ProfileImage user={null as unknown} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-primary font-sans">
                  Name
                </span>
                <span className="text-xs font-medium text-secondary font-sans">
                  User
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
