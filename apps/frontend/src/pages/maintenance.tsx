import { AppCopy } from "@/components/ui/AppCopy";
import { HeaderCover } from "@/components/ui/HeaderCover";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { logoutUser } from "@/lib/auth";
import { useEffect } from "react";

export default function MaintenancePage() {
  useEffect(() => {
    const handleLogout = async () => {
      await logoutUser();
    };
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-4">
      <HeaderCover />
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col grow">
          <RegisterHeader
            title="Cursive is under maintenance."
            subtitle="We will be back soon!"
            description={
              <span>
                In the meantime, learn about upcoming features{" "}
                <a
                  href="https://cursive.team/lanna"
                  className="text-[#FF9DF8] font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>{" "}
                and follow Cursive on{" "}
                <a
                  href="https://x.com/cursive_team"
                  className="text-[#FF9DF8] font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                !
              </span>
            }
          />
        </div>
      </div>
      <AppCopy className="mt-auto mx-auto" />
    </div>
  );
}
