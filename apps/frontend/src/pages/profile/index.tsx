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
import ImportStravaButton from "@/features/oauth/ImportStravaButton";
import AddNotificationButton from "@/features/notification/AddNotificationButton";
import ToggleSwitch from "@/components/ui/Switch";
import useSettings from "@/hooks/useSettings";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { toggleTheme, darkTheme } = useSettings();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { user, session } = await storage.getUserAndSession();
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

  const hasStravaToAdd =
    !user.oauth || !Object.keys(user.oauth).includes("strava");
  const hasGithubToAdd =
    !user.oauth || !Object.keys(user.oauth).includes("github");
  const hasOauthToAdd = hasStravaToAdd || hasGithubToAdd;
  const hasDataToAdd = hasOauthToAdd || !user.userData.tensionsRating;

  const hasVaultData =
    (user.oauth && Object.keys(user.oauth).length > 0) ||
    user.userData.tensionsRating;

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
                <span className="text-[30px] font-semibold tracking-[-0.22px] font-sans text-primary">
                  {`${user?.userData.username}`}
                </span>
                <span className="text-[14px] font-medium font-sans text-tertiary">
                  {user?.userData.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/profile/overview">
                  <AppButton className="w-fit">
                    <span className="text-[14px]">View profile</span>
                  </AppButton>
                </Link>
                <Link href="/activity">
                  <AppButton variant="outline" className="w-fit">
                    <span className="text-[14px]">Activity</span>
                  </AppButton>
                </Link>
                <div className="w-fit">
                  <AddNotificationButton />
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
                      {hasStravaToAdd && (
                        <div
                          onClick={() =>
                            logClientEvent("user-profile-strava-clicked", {})
                          }
                        >
                          <ImportStravaButton />
                        </div>
                      )}
                      {hasGithubToAdd && (
                        <div
                          onClick={() =>
                            logClientEvent("user-profile-github-clicked", {})
                          }
                        >
                          <ImportGithubButton />
                        </div>
                      )}
                    </div>
                  </div>
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
                        Practice your decision making skills by playing the
                        Tensions game, match with residents who hold opposing
                        views to learn new perspectives.
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
                    {`Change which features use your data or remove your data altogether.`}
                  </span>
                </div>
                {user.oauth && Object.keys(user.oauth).length > 0 && (
                  <div className="py-2">
                    <div className="w-full flex gap-2 overflow-x-auto">
                      {Object.keys(user.oauth).includes("strava") && (
                        <div>
                          <ImportStravaButton addElement={false} />
                        </div>
                      )}
                      {Object.keys(user.oauth).includes("github") && (
                        <div>
                          <ImportGithubButton addElement={false} />
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
                        Practice your decision making skills by playing the
                        Tensions game, match with residents who hold opposing
                        views to learn new perspectives.
                      </span>
                    </div>
                  </Card.Base>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-6">
          <ToggleSwitch
            label="Dark theme"
            checked={darkTheme}
            onChange={() => {
              toggleTheme();
            }}
          />
        </div>
        <div className="px-4 py-6">
          <AppButton onClick={handleLogout} variant="outline">
            Log out
          </AppButton>
        </div>
      </AppLayout>
    </>
  );
};

export default ProfilePage;
