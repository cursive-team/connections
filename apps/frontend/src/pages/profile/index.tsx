import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { User, UserData } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { NextSeo } from "next-seo";
import { Card } from "@/components/cards/Card";
import { logoutUser } from "@/lib/auth";
import { logClientEvent } from "@/lib/frontend/metrics";
import ImportGithubButton from "@/features/oauth/ImportGithubButton";
import ImportStravaButton from "@/features/oauth/ImportStravaButton";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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
                Share data for connection
              </span>
              <span className="text-sm font-normal text-tertiary">
                Your data is private to you & you have full control over how it
                is used in the app.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="py-2">
                <div className="w-full flex gap-2 overflow-x-auto">
                  <div
                    onClick={() =>
                      logClientEvent("user-profile-strava-clicked", {})
                    }
                  >
                    <ImportStravaButton />
                  </div>
                  <div
                    onClick={() =>
                      logClientEvent("user-profile-github-clicked", {})
                    }
                  >
                    <ImportGithubButton />
                  </div>
                </div>
              </div>
              {/* <Card.Base
                variant="gray"
                className="p-4 !rounded-lg"
                onClick={() => toast.info("Coming soon!")}
              >
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icons.Clip />
                      <span className="text-sm text-primary font-medium">
                        Frontier tech: over or underrated 🧪
                      </span>
                    </div>
                    <Icons.Plus />
                  </div>
                  <span className="text-xs font-medium text-tertiary">
                    Share your hot takes on frontier tech to discover residents
                    who have similar interests or qualms.
                  </span>
                </div>
              </Card.Base> */}
              {!user.userData.tensionsRating && (
                <Card.Base
                  variant="gray"
                  className="p-4 !rounded-lg"
                  onClick={() => {
                    logClientEvent("start_tensions", {});
                    router.push("/tensions");
                  }}
                >
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icons.Clip />
                        <span className="text-sm text-primary font-medium">
                          Tensions 🪢
                        </span>
                      </div>
                      <Icons.Plus />
                    </div>
                    <span className="text-xs font-medium text-tertiary">
                      Practice your decision making skills by playing the
                      Tensions game, match with residents who hold opposing
                      views to learn new perspectives.
                    </span>
                  </div>
                </Card.Base>
              )}
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
            </div>
            {user.userData.tensionsRating && (
              <Card.Base
                variant="gray"
                className="p-4 !rounded-lg"
                onClick={() => {
                  logClientEvent("edit_tensions", {});
                  router.push("/tensions");
                }}
              >
                <div className="flex flex-col gap-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Icons.Clip />
                      <span className="text-sm text-primary font-medium">
                        Tensions 🪢
                      </span>
                    </div>
                    <Icons.Pencil />
                  </div>
                  <span className="text-xs font-medium text-tertiary">
                    Practice your decision making skills by playing the Tensions
                    game, match with residents who hold opposing views to learn
                    new perspectives.
                  </span>
                </div>
              </Card.Base>
            )}
            <Card.Base
              variant="gray"
              className="p-4 !rounded-lg"
              onClick={() => toast.info("Coming soon!")}
            >
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Icons.Clip />
                    <span className="text-sm text-primary font-medium">
                      How you want to connect 👥
                    </span>
                  </div>
                  <Icons.Pencil />
                </div>
                <span className="text-xs font-medium text-tertiary">
                  Interests shared during registration, used to seed private
                  overlap computation with other attendees.
                </span>
              </div>
            </Card.Base>
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
