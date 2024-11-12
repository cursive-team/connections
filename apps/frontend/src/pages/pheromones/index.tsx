import { Banner } from "@/components/cards/Banner";
import AppLayout from "@/layouts/AppLayout";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PheromonesPage() {
  const router = useRouter();

  useEffect(() => {
    const gateUser = async () => {
      // Gate off for users that are not logged in and don't have an unregistered user
      const user = await storage.getUser();
      const unregisteredUser = await storage.getUnregisteredUser();
      if (!user && !unregisteredUser) {
        router.push("/");
        return;
      }
    };

    gateUser();
  }, [router]);

  return (
    <AppLayout
      seoTitle="Digital pheromones"
      header={
        <>
          <span className="text-label-primary font-medium">
            Digital pheromones
          </span>
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        </>
      }
      withContainer={false}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <Banner
          italic={false}
          title={
            <div className="!font-normal flex flex-col gap-4">
              <div className="text-md">
                <b>Launching on Wednesday, Nov 13th!</b>
              </div>
              <div className="text-sm">
                Come by our{" "}
                <a
                  href="https://app.devcon.org/schedule/LMCG3V"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-primary"
                >
                  Digital Pheromones workshop
                </a>{" "}
                on 11/13 at 3:20pm in Classroom A to try a live demo and learn
                more.
              </div>
              <div className="text-sm">
                Multi-party computation enables <b>digital pheromones</b>, the
                ability to coordinate in a p2p way using lightweight,
                privacy-preserving signals.
              </div>
              <div className="text-sm">
                This enables new forms of communication like{" "}
                <b>narrowcasting</b>, where only people that satisfy specific
                private, verifiable criteria will be able to decrypt your
                message.
              </div>
            </div>
          }
          textCenter={false}
        />
      </div>
    </AppLayout>
  );
}
