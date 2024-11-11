import { Banner } from "@/components/cards/Banner";
import AppLayout from "@/layouts/AppLayout";
import { useEffect } from "react";
import { storage } from "@/lib/storage";
import { useRouter } from "next/router";

export default function NarrowcastPage() {
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
      seoTitle="Narrowcast"
      header={
        <>
          <span className="text-label-primary font-medium">Narrowcasting</span>
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
              <div>
                <b>Coming soon</b>: Narrowcast events & opportunities to{" "}
                <i>only your most relevant connections</i> instead of
                broadcasting to the whole community or making dozens of group
                chats.
              </div>
              <div>
                Learn more about narrowcasting and other upcoming features like{" "}
                <b>digital pheromones</b> and <b>superconnectors</b>{" "}
                <a
                  href="https://cursive.team/lanna"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </div>
            </div>
          }
          textCenter={false}
        />
      </div>
    </AppLayout>
  );
}
