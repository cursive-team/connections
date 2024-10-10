import { AppCopy } from "@/components/ui/AppCopy";
import { RegisterHeader } from "@/features/register/RegisterHeader";
import { logoutUser } from "@/lib/auth";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const handleLogout = async () => {
      await logoutUser();
    };
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-4">
      <div className="w-full top-0">
        <Image
          src="/images/register-main.png"
          alt="register main"
          layout="responsive"
          className=" object-cover"
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          width={100}
          height={375}
        />
      </div>
      <div className="flex-grow flex px-6 center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col grow">
          <RegisterHeader
            title="Cursive Connections will launch soon."
            subtitle="We will share more updates at opening ceremony on Oct 11th!"
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
