import { EMOJI_MAPPING } from "@/common/constants";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Tag } from "@/components/ui/Tag";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import router from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileOverview() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await storage.getUser();
      if (user) {
        setUser(user);
      } else {
        toast.error("User not found");
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <AppLayout
      withContainer={false}
      showFooter={false}
      back={{
        href: "/profile",
        label: "Back",
      }}
    >
      <div className="">
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex flex-col">
            <span className="text-[24px] font-semibold tracking-[-0.22px] font-sans">{`${user?.userData.username}`}</span>
            <span className="text-[14px] font-medium font-sans text-tertiary">
              {user?.userData.displayName}
            </span>
          </div>
          <ProfileImage user={user?.userData as UserData} />
        </div>

        <div className="flex flex-col gap-2 p-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Socials
          </span>
          <div className="flex flex-col gap-2">
            {!user?.userData.telegram?.username &&
              !user?.userData.twitter?.username && (
                <span className="text-sm text-secondary font-sans font-normal">
                  Add socials by editing your chip details!
                </span>
              )}
            {user?.userData.telegram?.username && (
              <LinkCardBox
                label="Telegram"
                value={user?.userData.telegram.username}
                href={`https://t.me/${user.userData.telegram.username}`}
              />
            )}
            {user?.userData.twitter?.username && (
              <LinkCardBox
                label="Twitter"
                value={user?.userData.twitter.username}
                href={`https://twitter.com/${user.userData.twitter.username}`}
              />
            )}
          </div>
        </div>
        {user?.userData.bio !== "" && (
          <div className="flex flex-col gap-2 p-4">
            <span className="text-sm font-semibold text-primary font-sans">
              Bio
            </span>
            <span className="text-sm text-tertiary font-normal font-sans">
              {user?.userData.bio}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 p-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Interests
          </span>
          {user?.userData.lanna && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(user?.userData.lanna.desiredConnections).map(
                ([key, value]) =>
                  value && (
                    <Tag
                      key={key}
                      variant={"active"}
                      closable={false}
                      emoji={EMOJI_MAPPING?.[key]}
                      text={
                        key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")
                      }
                    />
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
