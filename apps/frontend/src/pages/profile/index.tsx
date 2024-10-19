import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import { MdOutlineModeEditOutline as IconEdit } from "react-icons/md";
import { AppInput } from "@/components/ui/AppInput";
import { Tag } from "@/components/ui/Tag";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { NextSeo } from "next-seo";
import { Card } from "@/components/cards/Card";

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
    <>
      <NextSeo title="Profile" />
      <AppLayout
        withContainer={false}
        headerDivider
        header={
          <div className="flex flex-col gap-4 pt-4 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="text-[24px] font-semibold tracking-[-0.22px] font-sans">{`${user?.userData.username}`}</span>
                <span className="text-[14px] font-medium font-sans text-tertiary">
                  {user?.userData.displayName}
                </span>
              </div>
              <ProfileImage user={user?.userData as UserData} />
            </div>
            <div className="flex items-center gap-2 py-4">
              <Link href="/profile/edit">
                <AppButton className="w-fit">
                  <Icons.Pencil className="mr-2" />{" "}
                  <span className="text-[14px]">Edit chip</span>
                </AppButton>
              </Link>
              <Link href="/profile/overview">
                <AppButton variant="outline" className="w-fit">
                  <span className="text-[14px]">View profile</span>
                </AppButton>
              </Link>
              <Link href="/activity">
                <AppButton variant="outline" className="w-fit">
                  <span className="text-[14px]">Activity</span>
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
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-primary font-sans">
                Add your data
              </span>
              <span className="text-sm font-normal text-tertiary">
                It is never sold to advertisers and is always stored as an
                encrypted backup.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="py-2">
                <div className="w-full flex gap-2 overflow-x-auto">
                  <Tag
                    emoji="👨🏾‍💻"
                    variant="gray"
                    text="Lorem ipsum"
                    className="min-w-max"
                    addElement
                  />
                  <Tag
                    emoji="👨🏾‍💻"
                    variant="gray"
                    text="Lorem ipsum"
                    className="min-w-max"
                    addElement
                  />
                  <Tag
                    emoji="👨🏾‍💻"
                    variant="gray"
                    text="Lorem ipsum"
                    className="min-w-max"
                    addElement
                  />
                  <Tag
                    emoji="👨🏾‍💻"
                    variant="gray"
                    text="Lorem ipsum"
                    className="min-w-max"
                    addElement
                  />
                </div>
              </div>
              <Link href={`#`}>
                <Card.Base variant="gray" className="p-4 !rounded-lg">
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icons.Clip />
                        <span className="text-sm text-primary font-medium">
                          Edge City Application
                        </span>
                      </div>
                      <Icons.Plus />
                    </div>
                    <span className="text-xs font-medium text-tertiary">
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Doloribus dolorum deleniti maxime molestiae vitae ducimus,
                      quasi at fugit obcaecati cupiditate.
                    </span>
                  </div>
                </Card.Base>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-primary font-sans">
                Connect with others
              </span>
              <span className="text-sm font-normal text-tertiary">
                {`This is the data you’ve taken ownership of and are using to
                meaningfully connect with others!`}
              </span>
              <div className="py-2">
                <Tag
                  emoji="👨🏾‍💻"
                  variant="transparent"
                  text="Lorem ipsum"
                  className="!bg-[#FC4C01] !text-white self-start"
                  remove
                />
              </div>
            </div>
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

          <div className="p-4">
            <AppButton variant="outline">Sign Out</AppButton>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;
