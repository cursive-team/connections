import React, { useState, useEffect } from "react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Connection, User } from "@/lib/storage/types";
import AppLayout from "@/layouts/AppLayout";
import { MdKeyboardArrowRight as ArrowRight } from "react-icons/md";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { Banner } from "@/components/cards/Banner";
import useSettings from "@/hooks/useSettings";
import { getUnregisteredUser } from "@/lib/storage/localStorage/user";
import { useRouter } from "next/router";
import { NavTab } from "@/components/ui/NavTab";
import { cn } from "@/lib/frontend/util";
import Image from "next/image";
import { logClientEvent } from "@/lib/frontend/metrics";
import { Icons } from "@/components/icons/Icons";
import { flowerSize, flowerType } from "@/lib/garden";
import { exportConnectionsToCSV } from "@/lib/exports";

function sortConnections(connections: Record<string, Connection>) {
  return Object.entries(connections)
    .sort(
      ([, a], [, b]) =>
        b.taps[b.taps.length - 1].timestamp.getTime() -
        a.taps[a.taps.length - 1].timestamp.getTime()
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

enum ActiveTab {
  GARDEN,
  LIST,
}
const PeoplePage: React.FC = () => {
  const router = useRouter();

  const { darkTheme } = useSettings();
  const [activeTab, setActiveTab] = useState(ActiveTab.GARDEN);
  const [connections, setConnections] = useState<Record<string, Connection>>(
    {}
  );
  const [psiSize, setPSISize] = useState<Record<string, number>>({});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      const user = await storage.getUser();
      const unregisteredUser = await getUnregisteredUser();
      if (!user && !unregisteredUser) {
        router.push("/");
        return;
      }

      if (user?.userData?.connectionPSISize) {
        setPSISize(user?.userData?.connectionPSISize);
      }

      let sortedConnections = {};
      if (user) {
        sortedConnections = sortConnections(user.connections);
        setUser(user);
      } else if (unregisteredUser) {
        sortedConnections = sortConnections(unregisteredUser.connections);
      }
      setConnections(sortedConnections);
    };

    fetchConnections();
  }, [router]);

  const handleExportConnectionsToCSV = async () => {
    if (window.confirm("Are you sure you want to export your connections?")) {
      await exportConnectionsToCSV();
    }
  };

  const ViewMapping: Record<ActiveTab, React.ReactNode> = {
    [ActiveTab.LIST]: (
      <ul className="flex flex-col">
        {Object.values(connections).map((connection, index) => (
          <li
            key={connection.user.username}
            className="p-4"
            style={{
              borderTop:
                index === 0 && darkTheme
                  ? "0.5px solid rgba(255, 255, 255, 0.20)"
                  : "0.5px solid rgba(0, 0, 0, 0.20)",
              // for some reason tailwind not applying
              borderBottom: darkTheme
                ? "0.5px solid rgba(255, 255, 255, 0.20)"
                : "0.5px solid rgba(0, 0, 0, 0.20)",
            }}
          >
            <Link
              className="grid grid-cols-[1fr_20px] items-center gap-4"
              href={`/people/${connection.user.username}`}
            >
              <div className="flex items-center gap-4">
                <ProfileImage user={connection.user} />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-label-primary">
                    {connection.user.displayName}
                  </span>
                  <span className="text-xs text-label-secondary font-medium">
                    @{connection.user.username}
                  </span>
                </div>
              </div>
              <ArrowRight className="ml-auto" />
            </Link>
          </li>
        ))}
      </ul>
    ),
    [ActiveTab.GARDEN]: (
      <ul className="grid grid-cols-2 gap-[1px]">
        {Object.values(connections).map((connection) => {
          let flowerStage = "sprout";
          if (psiSize && psiSize[connection.user.username]) {
            flowerStage = flowerSize(psiSize[connection.user.username]);
          }

          const flowerIndex = flowerType(
            connection.user.username,
            user?.userData?.username
          );

          const flowerImage = `/flowers/flower-${flowerIndex}-${flowerStage}.svg`;

          return (
            <li key={connection.user.username} className=" bg-pink">
              <div className="grid grid-cols-[1fr_65px] h-[124px] items-center gap-0.5 pt-2 px-4">
                <div className="flex w-full h-full">
                  <div className="flex flex-col gap-1 pb-2 h-full">
                    <div className="flex items-center gap-5">
                      {connection?.user?.telegram?.username && (
                        <Link
                          href={`https://t.me/${connection.user.telegram.username}`}
                        >
                          <Icons.Telegram
                            size={24}
                            className={cn(
                              darkTheme ? "text-black" : "text-white"
                            )}
                          />
                        </Link>
                      )}
                      {connection?.user?.twitter?.username && (
                        <div
                          onClick={() => {
                            logClientEvent("user-profile-twitter-clicked", {});
                          }}
                        >
                          <Link
                            href={`https://twitter.com/${connection.user.twitter.username}`}
                          >
                            <Icons.Twitter
                              size={24}
                              className={cn(
                                darkTheme ? "text-black" : "text-white"
                              )}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-base leading-[22px] font-bold mt-auto line-clamp-2 break-words",
                        darkTheme ? "text-black" : "text-white"
                      )}
                    >
                      <Link
                        className="mt-auto"
                        href={`/people/${connection.user.username}`}
                      >
                        {(
                          connection.user.displayName ||
                          connection.user.username
                        )
                          .split(" ")
                          .map((word, index) =>
                            word.length > 8 && index === 0
                              ? `${word.slice(0, 8)}-${word.slice(8)}`
                              : word
                          )
                          .join(" ")}
                      </Link>
                    </span>
                  </div>
                </div>
                <div className="mt-auto relative w-full h-full">
                  <Link
                    className="mt-auto"
                    href={`/people/${connection.user.username}`}
                  >
                    <Image
                      fill
                      className=" object-cover bg-cover w-full"
                      alt={`${flowerIndex} ${flowerStage}`}
                      src={flowerImage}
                    />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    ),
  };

  return (
    <AppLayout
      seoTitle="People"
      header={
        <div className="flex flex-col">
          <span className="text-label-primary text-xl leading-none font-bold tracking-[-0.1px] py-4 inline-flex">
            {`Connections (${Object.keys(connections)?.length})`}
            <div className="justify-start items-center gap-[40-px] flex">
              <button className="relative" onClick={handleExportConnectionsToCSV}>
                <Image
                  width={30}
                  height={30}
                  alt="download connections"
                  src="/images/download.svg"
                />
              </button>
            </div>
          </span>
          <div className="py-3 flex gap-6">
            <NavTab
              active={activeTab === ActiveTab.GARDEN}
              onClick={() => {
                setActiveTab(ActiveTab.GARDEN);
              }}
            >
              Garden
            </NavTab>
            <NavTab
              active={activeTab === ActiveTab.LIST}
              onClick={() => {
                setActiveTab(ActiveTab.LIST);
              }}
            >
              List
            </NavTab>
          </div>
        </div>
      }
      className="mx-auto"
      withContainer={false}
    >
      {activeTab === ActiveTab.LIST && (
        <div className="w-full px-4 py-4">
          <Banner
            className="justify-center"
            italic={false}
            title={
              <span className="!font-normal text-center">
                <b>Grow your garden </b> by discovering overlap after tap!
                Troubleshoot tapping{" "}
                <a
                  href="https://cursive.team/tap-help"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </span>
            }
          />
        </div>
      )}
      {Object.keys(connections).length === 0 ? (
        <div className="p-4 text-center text-label-secondary px-16">
          {`No connections yet.`}
        </div>
      ) : (
        ViewMapping?.[activeTab]
      )}
    </AppLayout>
  );
};

export default PeoplePage;
