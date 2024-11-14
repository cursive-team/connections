import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import {
  getProfileBackgroundColor,
  ProfileImage,
} from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";
import { Icons } from "@/components/icons/Icons";
import { NextSeo } from "next-seo";
import { Card } from "@/components/cards/Card";
import { logoutUser } from "@/lib/auth";
import { logClientEvent } from "@/lib/frontend/metrics";
import ImportGithubButton from "@/features/oauth/ImportGithubButton";
import ImportDevconButton from "@/features/oauth/ImportDevconButton";
import ToggleSwitch from "@/components/ui/Switch";
import useSettings from "@/hooks/useSettings";
import { storeAddChipRequest } from "@/lib/chip/addChip";
import { toggleGraphConsent } from "@/lib/storage/localStorage/graph";
import { DataImportSource } from "@types";
import { deleteImports } from "@/lib/imports/delete";
import AddNotificationButton from "@/features/notification/AddNotificationButton";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { toggleTheme, darkTheme } = useSettings();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const toggleGraph = async () => {
    await toggleGraphConsent();
  };

  const handleImportDeletion = async () => {
    if (window.confirm("Are you sure you want to delete all imports?")) {
      toast.info("Data can be reimported by reenabling application imports.");
      await deleteImports();
    }
    router.push("/profile");
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Gate off unregistered users

      const user = await storage.getUser();
      const unregisteredUser = await storage.getUnregisteredUser();
      if (unregisteredUser) {
        router.push("/people")
        return;
      }
      if (!user) {
        router.push("/");
        return;
      }

      const { session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view your profile.");
        router.push("/");
        return;
      }
      setUser(user);
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

  const hasGithubToAdd =
    !user.oauth || !Object.keys(user.oauth).includes(DataImportSource.GITHUB);
  const hasDevconToAdd = !Object.keys(user.userData).includes("devcon");

  console.log("To add?", hasDevconToAdd);
  const hasOauthToAdd = hasGithubToAdd || hasDevconToAdd;
  const hasDataToAdd = hasOauthToAdd || !user.userData.tensionsRating;

  const hasVaultData =
    (user.oauth && Object.keys(user.oauth).length > 0) ||
    user.userData.tensionsRating ||
    user.userData.devcon;

  return (
    <>
      <NextSeo title="Profile" />
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
                  user?.userData
                )} 100%)`,
              }}
            >
              <div className="absolute left-4 top-[30px]">
                <ProfileImage size={16} user={user?.userData as UserData} />
              </div>
            </div>
          </div>
        }
        className="mx-auto pb-4"
      >
        <div className="flex flex-col">
          <div className="flex flex-col  mt-[38px] px-3 pb-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col">
                <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans text-label-primary">
                  {user?.userData.displayName}
                </span>
                <span className="text-[14px] font-medium font-sans text-label-tertiary">
                  {`${user?.userData.username}`}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <div className="shrink-0">
                  <Link href="/profile/overview">
                    <AppButton size="lg" className="w-fit">
                      <span className="text-[14px]">View profile</span>
                    </AppButton>
                  </Link>
                </div>
                <div className="shrink-0">
                  <Link href="/activity">
                    <AppButton
                      icon={<Icons.Activity size={16} className="mr-1" />}
                      variant="outline"
                      className="w-fit"
                      size="sm"
                    >
                      <span className="text-[14px]">Activity</span>
                    </AppButton>
                  </Link>
                </div>
                <div className="shrink-0">
                  <AppButton
                    icon={
                      <Icons.Sparkles
                        size={16}
                        className="mr-1 text-icon-primary"
                      />
                    }
                    onClick={() => {
                      storeAddChipRequest();
                      toast.success("Please tap your new chip to add it!");
                    }}
                    size="sm"
                    variant="outline"
                    className="w-fit"
                  >
                    <span className="text-[14px]">Add Chip</span>
                  </AppButton>
                </div>
              </div>
            </div>
          </div>

          {hasDataToAdd && (
            <div className="flex flex-col gap-2 p-4">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-label-primary font-sans">
                  Add data to connect with others
                </span>
                <span className="text-sm font-normal text-label-tertiary">
                  Your data is private to you and you have full control over how
                  it is used in the app.
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {hasOauthToAdd && (
                  <div className="py-2">
                    <div className="w-full flex gap-2 overflow-x-auto">
                      {hasGithubToAdd && (
                        <div
                          onClick={() =>
                            logClientEvent("user-profile-github-clicked", {})
                          }
                        >
                          <ImportGithubButton />
                        </div>
                      )}
                      {hasDevconToAdd && <ImportDevconButton />}
                    </div>
                  </div>
                )}

                {!user.userData.tensionsRating && (<Card.Base
                  variant="gray"
                  className="p-4 !rounded-lg !border !border-white"
                  onClick={() => {
                    logClientEvent("start_hot_takes", {});
                    router.push("/hot-takes");
                  }}
                >
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icons.Clip className="text-icon-primary"/>
                        <span className="text-sm text-label-primary font-medium">
                          Ethereum Hot Takes 🔥
                        </span>
                      </div>
                      <Icons.Plus className="text-icon-primary"/>
                    </div>
                    <span className="text-xs font-medium text-label-tertiary">
                      Weigh in on the *most important* topics in the community: based or cringe?
                    </span>
                  </div>
                </Card.Base>
                )}

                {!user.userData.tensionsRating && (
                  <Card.Base
                    variant="gray"
                    className="p-4 !rounded-lg !border !border-white"
                    onClick={() => {
                      logClientEvent("start_tensions", {});
                      router.push("/tensions");
                    }}
                  >
                    <div className="flex flex-col gap-[10px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Icons.Clip className="text-icon-primary" />
                          <span className="text-sm text-label-primary font-medium">
                            Tensions 🪢
                          </span>
                        </div>
                        <Icons.Plus className="text-icon-primary" />
                      </div>
                      <span className="text-xs font-medium text-label-tertiary">
                        Play the Tensions game from Summer of Protocols to
                        practice your decision making skills. Upon tap, discover
                        where you disagree to learn new perspectives.
                      </span>
                    </div>
                  </Card.Base>
                )}
              </div>
            </div>
          )}

          {hasVaultData && (
            <div className="p-4">
              <div className="flex flex-col gap-2 ">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-label-primary font-sans">
                    Your vault
                  </span>
                  <span className="text-sm font-normal text-label-tertiary">
                    {`This data can be used to discover commonalities and try digital pheromone experiments.`}
                  </span>
                </div>
                {((user.oauth && Object.keys(user.oauth).length > 0) ||
                  !hasDevconToAdd) && (
                  <div className="py-2">
                    <div className="w-full flex gap-2 overflow-x-auto">
                      {Object.keys(user.oauth || {}).includes(
                        DataImportSource.GITHUB
                      ) && (
                        <div>
                          <ImportGithubButton addElement={false} />
                        </div>
                      )}
                      {!hasDevconToAdd && (
                        <div>
                          <ImportDevconButton addElement={false} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {user.userData.tensionsRating && (
                <Card.Base
                  variant="gray"
                  className="p-4 !rounded-lg !border !border-white"
                  onClick={() => {
                    logClientEvent("edit_hot_takes", {});
                    router.push("/hot-takes");
                  }}
                >
                  <div className="flex flex-col gap-[10px] ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icons.Clip className="text-icon-primary" />
                        <span className="text-sm text-label-primary font-medium">
                          Ethereum Hot Takes 🔥
                        </span>
                      </div>
                      <Icons.Pencil className="text-icon-primary" />
                    </div>
                    <span className="text-xs font-medium text-label-tertiary">
                      Weigh in on the *most important* topics in the community: based or cringe?
                    </span>
                  </div>
                </Card.Base>
                )}
                {user.userData.tensionsRating && (
                  <Card.Base
                    variant="gray"
                    className="p-4 !rounded-lg !border !border-white"
                    onClick={() => {
                      logClientEvent("edit_tensions", {});
                      router.push("/tensions");
                    }}
                  >
                    <div className="flex flex-col gap-[10px] ">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Icons.Clip className="text-icon-primary" />
                          <span className="text-sm text-label-primary font-medium">
                            Tensions 🪢
                          </span>
                        </div>
                        <Icons.Pencil className="text-icon-primary" />
                      </div>
                      <span className="text-xs font-medium text-label-tertiary">
                        Play the Tensions game from Summer of Protocols to
                        practice your decision making skills. Upon tap, discover
                        where you disagree to learn new perespectives.
                      </span>
                    </div>
                  </Card.Base>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold text-label-primary font-sans">
                Settings
              </span>
            </div>

            <div className="py-0">
              <ToggleSwitch
                label="Dark theme"
                checked={darkTheme}
                onChange={() => {
                  toggleTheme();
                }}
              />
            </div>
            <div className="py-0">
              <ToggleSwitch
                label="Join anonymous tap graph exhibit"
                checked={!!user?.tapGraphEnabled}
                onChange={() => {
                  toggleGraph();
                }}
              />
            </div>
            <div className="">
              <AddNotificationButton buttonText="Add notifications" />
            </div>
            <div className="">
              <AppButton onClick={handleImportDeletion} variant="outline">
                Delete OAuth imports
              </AppButton>
            </div>
            <div className="pb-6">
              <AppButton onClick={handleLogout} variant="secondary">
                Log out
              </AppButton>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;
