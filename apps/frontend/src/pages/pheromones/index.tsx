import { NavTab } from "@/components/ui/NavTab";
import AppLayout from "@/layouts/AppLayout";
import { useState } from "react";
import { PheromonesCreate } from "./sections/PheromonesCreate";
import { PheromonesMatches } from "./sections/PheromonesMatches";
import { PheromonesSent } from "./sections/PheromonesSent";
import { PheromonesReceived } from "./sections/PheromonesReceived";

enum ActiveTab {
  CREATE,
  SENT,
  RECEIVED,
  MATCHES,
}

export default function PheromonesPage() {
  const [activeTab, setActiveTab] = useState(ActiveTab.CREATE);

  const ViewMapping: Record<ActiveTab, any> = {
    [ActiveTab.CREATE]: PheromonesCreate,
    [ActiveTab.SENT]: PheromonesSent,
    [ActiveTab.RECEIVED]: PheromonesReceived,
    [ActiveTab.MATCHES]: PheromonesMatches,
  };

  return (
    <AppLayout
      seoTitle="Digital pheromones"
      header={
        <div className="flex flex-col">
          <span className="text-label-primary text-xl leading-none font-bold tracking-[-0.1px] py-4">
            Digital pheromones
          </span>
          <div className="py-3 flex gap-6">
            <NavTab
              active={activeTab === ActiveTab.CREATE}
              onClick={() => {
                setActiveTab(ActiveTab.CREATE);
              }}
            >
              Create
            </NavTab>
            <NavTab
              active={activeTab === ActiveTab.SENT}
              onClick={() => {
                setActiveTab(ActiveTab.SENT);
              }}
            >
              Sent
            </NavTab>
            <NavTab
              active={activeTab === ActiveTab.RECEIVED}
              onClick={() => {
                setActiveTab(ActiveTab.RECEIVED);
              }}
            >
              Received
            </NavTab>
            <NavTab
              active={activeTab === ActiveTab.MATCHES}
              onClick={() => {
                setActiveTab(ActiveTab.MATCHES);
              }}
            >
              Matches
            </NavTab>
          </div>
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        </div>
      }
      withContainer={false}
    >
      <div className="flex flex-col items-center justify-center px-3">
        <span className="text-sm font-sans text-label-quaternary font-medium p-2">
          Multi-party computation enables{" "}
          <span className="font-bold">digital pheromones</span>, the ability to
          coordinate in a p2p way using lightweight, privacy-preserving signals.
        </span>
        <div className="flex flex-col py-4 w-full">
          {ViewMapping?.[activeTab]?.() ?? null}
        </div>
      </div>
    </AppLayout>
  );
}
