import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import { MdOutlineModeEditOutline as IconEdit } from "react-icons/md";
import { AppInput } from "@/components/ui/AppInput";
import { LinkCardBox } from "@/components/ui/LinkCardBox";
import { Tag } from "@/components/ui/Tag";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";
import { EMOJI_MAPPING } from "@/common/constants";
import { Icons } from "@/components/Icons";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  const enableEditing = false;

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

  const handleUpdateSocials = async () => {
    if (!user) return;

    if (
      twitterUsername === user.userData.twitter?.username &&
      telegramUsername === user.userData.telegram?.username
    ) {
      setIsEditingSocials(false);
      return;
    }

    try {
      const updatedUserData = {
        ...user.userData,
        twitter: { username: twitterUsername || undefined },
        telegram: { username: telegramUsername || undefined },
      };

      await storage.updateUserData(updatedUserData);

      const newUser = await storage.getUser();
      const newSession = await storage.getSession();
      if (!newUser || !newSession) {
        throw new Error("User or session not found");
      }
      setUser(newUser);
      setIsEditingSocials(false);
      toast.success("Socials updated successfully!");
    } catch (error) {
      console.error("Error updating socials:", error);
      toast.error("Failed to update socials.");
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  return (
    <AppLayout
      withContainer={false}
      headerDivider
      header={
        <div className="flex flex-col gap-2 py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="text-[24px] font-semibold tracking-[-0.22px] font-sans">{`${user?.userData.username}`}</span>
              <span className="text-[14px] font-medium font-sans text-tertiary">
                {user?.userData.displayName}
              </span>
            </div>
            <ProfileImage user={user?.userData as UserData} />
          </div>
          <div>
            <Link href="/profile/edit">
              <AppButton variant="outline" className="w-fit">
                <Icons.Pencil className="mr-2" />{" "}
                <span className="text-[14px]">Edit details</span>
              </AppButton>
            </Link>
          </div>
        </div>
      }
      className="mx-auto pb-4"
    >
      {enableEditing && (
        <div className="py-4">
          <AppButton
            className="!rounded-full max-w-[140px] self-start "
            variant="outline"
            onClick={() => setIsEditingSocials(true)}
          >
            <IconEdit className="mr-1" />
            <span>Edit Socials</span>
          </AppButton>
        </div>
      )}

      <div className="!divide-y !divide-quaternary/20 flex flex-col">
        <div className="flex flex-col gap-2 py-4 px-4">
          <span className="text-sm font-semibold text-primary font-sans">
            Socials
          </span>
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2 py-4 px-4">
            <span className="text-sm font-semibold text-primary font-sans">
              Bio
            </span>
            <span className="text-sm text-tertiary font-normal font-sans">
              {user?.userData.bio}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 py-4 px-4">
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
        {enableEditing && (
          <div className="space-y-4 px-4">
            <span className="text-sm font-semibold text-primary">
              Update socials
            </span>
            <div className="space-y-2">
              {isEditingSocials && (
                <>
                  <AppInput
                    type="text"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    placeholder="Twitter username"
                  />
                  <AppInput
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="Telegram username"
                  />
                  <div className="flex space-x-2">
                    <AppButton onClick={handleUpdateSocials}>Save</AppButton>
                    <AppButton
                      variant="outline"
                      onClick={() => setIsEditingSocials(false)}
                    >
                      Cancel
                    </AppButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
