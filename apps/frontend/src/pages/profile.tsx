import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { Session, User } from "@/lib/storage/types";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { AppButton } from "@/components/ui/Button";
import { MdOutlineModeEditOutline as IconEdit } from "react-icons/md";
import { AppInput } from "@/components/ui/AppInput";
import { LinkCardBox } from "@/components/ui/LinkCardBox";

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (user && session) {
        setUser(user);
        setSession(session);
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
      setSession(newSession);
      setIsEditingSocials(false);
      toast.success("Socials updated successfully!");
    } catch (error) {
      console.error("Error updating socials:", error);
      toast.error("Failed to update socials.");
    }
  };

  if (!user) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col pt-4">
            <span className=" text-[30px] font-semibold tracking-[-0.22px] font-sans">{`@${user.userData.username}`}</span>
            <span className="text-sm font-medium font-sans text-tertiary">
              {user.userData.displayName}
            </span>
          </div>
          <div className="size-10 bg-button-secondary rounded-full border border-quaternary/10"></div>
        </div>
      }
      className="container mx-auto px-4 py-8"
    >
      <div className="py-4">
        <AppButton
          className="!rounded-full max-w-[140px] self-start"
          variant="outline"
          onClick={() => setIsEditingSocials(true)}
        >
          <IconEdit className="mr-1" />
          <span>Edit Socials</span>
        </AppButton>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <span className="text-sm font-semibold text-primary font-sans">
          Socials
        </span>
        <div className="flex flex-col gap-4">
          <LinkCardBox
            label="Telegram"
            value={user.userData.telegram?.username || "Not set"}
          />
          <LinkCardBox
            label="X"
            value={user.userData.twitter?.username || "Not set"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <span className="text-sm font-semibold text-primary font-sans">
          Bio
        </span>
        <span className="text-sm text-tertiary font-normal font-sans">
          {user.userData.bio}
        </span>
      </div>
      <div className="flex flex-col gap-2 py-4">
        <span className="text-sm font-semibold text-primary">Interests</span>
      </div>
      <div>
        <div className="space-y-4">
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
      </div>
      <AppButton
        className="mt-4"
        onClick={() => {
          console.log("Session:", session);
          console.log("User:", user);
        }}
      >
        Log Session and User
      </AppButton>
    </AppLayout>
  );
};

export default ProfilePage;
