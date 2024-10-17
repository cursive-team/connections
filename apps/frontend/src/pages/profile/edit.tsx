import { AppInput } from "@/components/ui/AppInput";
import AppLayout from "@/layouts/AppLayout";
import { useForm } from "react-hook-form";
import { storage } from "@/lib/storage";
import { LannaDesiredConnections, User } from "@/lib/storage/types";
import { AppTextarea } from "@/components/ui/Textarea";
import { AppButton } from "@/components/ui/Button";
import { useState } from "react";
import { EMOJI_MAPPING } from "@/common/constants";
import { Tag } from "@/components/ui/Tag";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";
import {
  FaTelegram as TelegramIcon,
  FaTwitter as TwitterIcon,
} from "react-icons/fa";
import { ProfileImage } from "@/components/ui/ProfileImage";

const ProfileEdit = () => {
  const { register, handleSubmit } = useForm<Partial<User["userData"]>>({
    defaultValues: async () => {
      const user = await storage.getUser();
      return {
        username: user?.userData?.username,
        displayName: user?.userData?.displayName,
        bio: user?.userData?.bio,
        twitter: user?.userData?.twitter,
        telegram: user?.userData?.telegram,
        lanna: user?.userData?.lanna,
      };
    },
  });

  const [connections, setConnections] = useState<LannaDesiredConnections>({
    getHealthy: false,
    cowork: false,
    enjoyMeals: false,
    learnFrontierTopics: false,
    findCollaborators: false,
    goExploring: false,
    party: false,
    doMentalWorkouts: false,
  });

  const handleToggle = (key: keyof LannaDesiredConnections) => {
    setConnections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onHandleSubmit = () => {};

  // const onHandleSubmit = (formData: Partial<User["userData"]>) => {
  //   // TODO: implement
  // };

  return (
    <AppLayout
      back={{
        href: "/profile",
        label: "Back",
      }}
      headerDivider
      showFooter={false}
    >
      <form
        onSubmit={handleSubmit(onHandleSubmit)}
        className="flex flex-col gap-4 pt-4 pb-6"
      >
        <div className="flex items-center justify-between gap-4 bg-surface-quaternary p-4">
          <AppButton className="max-w-[130px]">Edit image</AppButton>
          <div>
            <ProfileImage user={null as any} />
          </div>
        </div>
        <AppInput
          variant="secondary"
          placeholder="Display name"
          {...register("displayName")}
        />
        <AppInput
          placeholder="Username"
          variant="secondary"
          {...register("username")}
        />
        <AppInput
          placeholder="Telegram"
          variant="secondary"
          icon={<TelegramIcon className="text-icon-primary/50" />}
          {...register("telegram")}
        />
        <AppInput
          placeholder="Lanna"
          variant="secondary"
          {...register("lanna")}
        />
        <AppInput
          placeholder="Twitter"
          variant="secondary"
          icon={<TwitterIcon className="text-icon-primary/50" />}
          {...register("twitter")}
        />
        <AppTextarea
          placeholder="Bio"
          variant="secondary"
          {...register("bio")}
        />
        <div className="flex flex-col gap-4 bg-surface-quaternary p-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Interests
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(connections).map(([key, value]) => {
              return (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() =>
                      handleToggle(key as keyof LannaDesiredConnections)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded hidden"
                  />
                  <Tag
                    variant={value ? "active" : "default"}
                    emoji={EMOJI_MAPPING?.[key]}
                    onClick={() =>
                      handleToggle(key as keyof LannaDesiredConnections)
                    }
                    text={
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
        <AppButton>Save</AppButton>
      </form>
      <div className="flex flex-col gap-4 py-6 border-t border-t-quaternary">
        <Icons.Cursive />
        <span className={cn("text-tertiary text-xs font-medium font-sans")}>
          Cursive Connections is an app experience for tapping into serendipity.{" "}
          <Link
            href="https://www.cursive.team/"
            target="_blank"
            className="underline font-bold"
          >
            Built by Cursive.
          </Link>
        </span>
        <AppButton className="max-w-[120px] self-start" variant="outline">
          Sign Out
        </AppButton>
      </div>
    </AppLayout>
  );
};

export default ProfileEdit;
