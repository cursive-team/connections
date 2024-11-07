import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import { errorToString } from "@types";
import { storage } from "@/lib/storage";
import { importData } from "@/lib/imports";

const OAuthAccessTokenPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const runImportData = async () => {
      // TODO: Add some kind of timer, otherwise in theory could poll indefinitely
      const { code, state } = router.query;

      const user = await storage.getUser();
      if (!user) {
        toast.error("User not found");
        router.push("/profile");
        return;
      }

      if (code && state) {
        const app = String(state);
        const authCode = String(code);

        try {
          await importData(app, authCode);
        } catch (error) {
          console.error("Data import failed:", errorToString(error));
          router.push("/profile");
          return;
        }

        router.push("/profile");
      }
    };

    runImportData();
  }, [router]);

  return (
    <div className="flex min-h-screen justify-center items-center text-center">
      <CursiveLogo isLoading />
    </div>
  );
};

export default OAuthAccessTokenPage;
