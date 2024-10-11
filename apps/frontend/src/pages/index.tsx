import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppCopy } from "@/components/ui/AppCopy";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { storage } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-100 flex flex-col pb-4">
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
        </div>
      </div>
      <AppCopy className="mt-auto mx-auto" />
    </div>
  );
}
