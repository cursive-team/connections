import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { NextSeo } from "next-seo";
import { Card } from "@/components/cards/Card";
import { logoutUser } from "@/lib/auth";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

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
          <div className="flex flex-col pt-4 px-1 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans">{`${user?.userData.username}`}</span>
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
        <div className="!divide-y !divide-quaternary/20 flex flex-col">
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-primary font-sans">
                Add data for connection
              </span>
              <span className="text-sm font-normal text-tertiary">
                Your data is private to you & you have full control over how it
                is used in the app.
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
                Edit your data
              </span>
              <span className="text-sm font-normal text-tertiary">
                {`Change which features use your data or remove your data altogether.`}
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
        </div>
        <div className="p-4">
          <AppButton onClick={handleLogout} variant="outline">
            Log out
          </AppButton>
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;
