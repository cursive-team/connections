import { Icons } from "@/components/Icons";
import { AppButton } from "@/components/ui/Button";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import {
  getProfileBackgroundColor,
  ProfileImage,
} from "@/components/ui/ProfileImage";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import Link from "next/link";
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
  }, []);

  return (
    <AppLayout
      withContainer={false}
      headerDivider
      headerContainer={false}
      header={
        <div className="flex flex-col w-full">
          <div
            className="h-[60px] w-full relative"
            style={{
              background: `linear-gradient(90deg, #FFF 0%, ${getProfileBackgroundColor(
                user?.userData as UserData
              )} 100%)`,
            }}
          >
            <div className="absolute left-4 top-[40px]">
              <ProfileImage user={user?.userData as UserData} />
            </div>
            <div className="absolute right-4 top-[70px]">
              <Link href="/profile/edit">
                <AppButton variant="outline" className="w-fit">
                  <Icons.Pencil className="mr-2" />{" "}
                  <span className="text-[14px]">Edit</span>
                </AppButton>
              </Link>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-3 mt-[46px]">
        <div className="flex flex-col px-4">
          <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans">
            {user?.userData.displayName}
          </span>
          <span className="text-[14px] font-medium font-sans text-tertiary">
            {`${user?.userData.username}`}
          </span>
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
      </div>
    </AppLayout>
  );
}
