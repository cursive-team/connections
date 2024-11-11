import { AppInput } from "@/components/ui/AppInput";
import AppLayout from "@/layouts/AppLayout";
import { useForm } from "react-hook-form";
import { storage } from "@/lib/storage";
import { UserData } from "@/lib/storage/types";
import { AppButton } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { SupportToast } from "@/components/ui/SupportToast";
import { errorToString } from "@types";
import { ERROR_SUPPORT_CONTACT } from "@/constants";
import { devFetchSchedule } from "@/lib/imports/integrations/devcon";
import { updateUserData } from "@/lib/storage/localStorage/user/userData";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import Link from "next/link";


type UsernameSubmission = {
  username: string;
};

async function FetchAndSaveDevconSchedule(username: string): Promise<boolean> {
  const { user } = await storage.getUserAndSession();

  // Fetch schedule
  const schedule = await devFetchSchedule(username)
  if (!schedule) {
    return false;
  }

  // Update userdata
  let userData: UserData = user.userData;

  if (!userData.devcon) {
    userData.devcon = {};
  }
  userData.devcon.username = username;
  userData.devcon.schedule = schedule;

  await updateUserData(userData);
  return true;
}

const DevconScheduleImportPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } =  useForm<UsernameSubmission>();


  const onHandleSubmit = async (formData: UsernameSubmission) => {
    setLoading(true);
    const {
      username,
    } = formData;
    try {
      const succeeded = await FetchAndSaveDevconSchedule(username);
      if (!succeeded) {
        toast.error("No schedule imported, are you sure your username was correct?")
        setLoading(false);
        return;
      }
      toast.success("Successfully imported Devcon schedule.");
      router.push("/profile");
    } catch (error) {
      console.error(error);
      toast(
        SupportToast(
          "",
          true,
          "Error importing Devcon schedule.",
          ERROR_SUPPORT_CONTACT,
          errorToString(error)
        )
      );
    }
    setLoading(false);
  };

  return (
    <>
      { !loading ? (
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-label-primary">
                <b>Submit</b> your Devcon username to import your schedule.
              </span>
              <span className="text-[16px] text-label-secondary py-3">
                To import your schedule there are a few manual steps:
                <br/>
                <ul>
                  <li>
                    - Navigate to your account settings.
                  </li>
                  <li>
                     - Go to Schedule tab.
                  </li>
                  <li>
                     - Toggle share personal schedule.
                  </li>
                  <li>
                    - Update your username, and submit here.
                  </li>
                </ul>
              </span>
              <Link href={"https://app.devcon.org/account/settings"} target="_blank">
                <AppButton size="md" className="w-fit" variant="outline">
                  Navigate to Devcon settings
                </AppButton>
              </Link>
            </div>
          </div>
          <AppInput
            label="Devcon Username"
            variant="primary"
            placeholder="Username"
            {...register("username")}
          />
          <AppButton
            type="submit"
            loading={loading}
            onClick={handleSubmit(onHandleSubmit)}
          >
            Submit
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

export default DevconScheduleImportPage;
