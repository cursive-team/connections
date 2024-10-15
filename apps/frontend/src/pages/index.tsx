import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppCopy } from "@/components/ui/AppCopy";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { storage } from "@/lib/storage";
import { AppButton } from "@/components/ui/Button";
import useSettings from "@/hooks/useSettings";

export default function Home() {
  const router = useRouter();
  const { pageHeight } = useSettings();

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (user && session && session.authTokenExpiresAt > new Date()) {
        router.push("/profile");
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <div
      className="min-h-screen bg-gray-100 flex flex-col"
      style={{
        minHeight: `${pageHeight}px`,
      }}
    >
      <HeaderCover />
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col grow">
          <RegisterHeader
            title="Hold your Cursive chip to your phone until you get a notification."
            description={
              <>
                <p className="mb-4">
                  iPhone: Hold card against the top of your phone and unlock the
                  screen.
                </p>
                <p>
                  Android: Unlock your phone and hold card against the center of
                  your phone. Ensure NFC is turned on in your settings.
                </p>
              </>
            }
          />
          <AppButton
            variant="outline"
            className="mt-auto"
            onClick={() => router.push("/login")}
          >
            I already have an account
          </AppButton>
        </div>
      </div>
      <AppCopy className="text-center py-4" />
    </div>
  );
}
