import { AppInput } from "@/components/ui/AppInput";
import AppLayout from "@/layouts/AppLayout";
import { useForm } from "react-hook-form";
import { storage } from "@/lib/storage";
import { Session, User } from "@/lib/storage/types";
import { AppTextarea } from "@/components/ui/Textarea";
import { AppButton } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import {
  FaInstagram as InstagramIcon,
  FaTelegram as TelegramIcon,
  FaTwitter as TwitterIcon,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { updateChip } from "@/lib/chip/update";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";

type ChipEditFormData = {
  displayName?: string;
  bio?: string;
  twitterUsername?: string;
  telegramUsername?: string;
  signalUsername?: string;
  instagramUsername?: string;
  farcasterUsername?: string;
  pronouns?: string;
};

const ProfileEdit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { register, handleSubmit, reset } = useForm<ChipEditFormData>();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (user && session) {
        setUser(user);
        setSession(session);
        reset({
          displayName: user.userData?.displayName || "",
          bio: user.userData?.bio || "",
          twitterUsername: user.userData?.twitter?.username || "",
          telegramUsername: user.userData?.telegram?.username || "",
          signalUsername: user.userData?.signal?.username || "",
          instagramUsername: user.userData?.instagram?.username || "",
          farcasterUsername: user.userData?.farcaster?.username || "",
          pronouns: user.userData?.pronouns || "",
        });
      } else {
        toast.error("User not found");
        router.push("/");
      }
    };

    fetchUser();
  }, [router, reset]);

  const onHandleSubmit = async (formData: ChipEditFormData) => {
    setLoading(true);
    const {
      displayName,
      bio,
      twitterUsername,
      telegramUsername,
      signalUsername,
      instagramUsername,
      farcasterUsername,
      pronouns,
    } = formData;
    try {
      await updateChip({
        authToken: session!.authTokenValue,
        tapParams: { chipId: user!.chips[0].id },
        ownerDisplayName: displayName ?? null,
        ownerBio: bio ?? null,
        ownerTwitterUsername: twitterUsername ?? null,
        ownerTelegramUsername: telegramUsername ?? null,
        ownerSignalUsername: signalUsername ?? null,
        ownerInstagramUsername: instagramUsername ?? null,
        ownerFarcasterUsername: farcasterUsername ?? null,
        ownerPronouns: pronouns ?? null,
      });
      toast.success("Chip updated successfully");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Error updating chip",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    }
    setLoading(false);
  };

  return (
    <>
      {user ? (
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
            className="flex flex-col gap-4 pt-4 pb-6 px-2"
          >
            {/* <div className="flex items-center justify-between gap-4 bg-surface-quaternary p-4">
              <AppButton className="max-w-[130px]">Edit image</AppButton>
              <div>
                <ProfileImage user={user.userData} />
              </div>
            </div> */}

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-label-primary">
                  <b>Editing</b> Edge City Wristband
                </span>
                <span className="text-[14px] text-label-tertiary">
                  This information is shared when someone taps your NFC chip
                  with their phone.
                </span>
              </div>
            </div>
            <AppInput
              label="Full name"
              variant="primary"
              placeholder="Full name"
              {...register("displayName")}
            />
            <AppInput
              label="Pronouns"
              variant="primary"
              placeholder="They/them, She/her, He/him"
              {...register("pronouns")}
            />
            <AppInput
              label="Telegram"
              placeholder="Telegram"
              variant="primary"
              icon={<TelegramIcon className=" invert" />}
              {...register("telegramUsername")}
            />
            <AppInput
              label="Twitter"
              placeholder="Twitter"
              variant="primary"
              icon={<TwitterIcon className=" invert" />}
              {...register("twitterUsername")}
            />
            <AppInput
              label="Instagram"
              placeholder="Instagram"
              variant="primary"
              icon={<InstagramIcon className=" invert" />}
              {...register("instagramUsername")}
            />
            <AppInput
              label="Signal"
              placeholder="Signal"
              variant="primary"
              {...register("signalUsername")}
            />
            <AppInput
              label="Farcaster"
              placeholder="Farcaster"
              variant="primary"
              {...register("farcasterUsername")}
            />
            <AppTextarea
              label="Bio"
              placeholder="Bio"
              variant="primary"
              {...register("bio")}
            />
            <AppButton
              type="submit"
              loading={loading}
              onClick={handleSubmit(onHandleSubmit)}
            >
              Save
            </AppButton>
          </form>
        </AppLayout>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <CursiveLogo isLoading />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
