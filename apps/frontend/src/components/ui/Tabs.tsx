import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { classed } from "@tw-classed/react";

interface TabProps {
  label: string;
  badge?: boolean;
  children: React.ReactNode;
}

export interface TabsProps {
  items: TabProps[];
}

const TabButton = classed.div("font-medium px-3 py-[6px] rounded-[3px]", {
  variants: {
    selected: {
      true: "text-label-primary bg-surface-primary",
      false: "text-label-secondary",
    },
  },
  defaultVariants: {
    selected: false,
  },
});

const TabBadge = classed.div(
  "absolute -top-0.5 -right-2 bg-[#D40018] rounded-full text-label-primary w-[6px] h-[6px] text-[8px]"
);

const Tabs = ({ items }: TabsProps) => {
  return (
    <TabGroup>
      <TabList className="flex relative">
        {items.map(({ label, badge }, index) => {
          return (
            <Tab className="outline-none" key={index}>
              {({ selected }) => (
                <div className="relative">
                  <TabButton selected={selected}>
                    <span className="relative">
                      {label}
                      {badge && <TabBadge />}
                    </span>
                  </TabButton>
                  {selected && (
                    <div className="absolute bg-iron-950 bottom-0 h-[1px] w-full z-[1]"></div>
                  )}
                </div>
              )}
            </Tab>
          );
        })}
        <div className="absolute bg-iron-50 bottom-0 h-[1px] w-full z-0"></div>
      </TabList>
      <TabPanels className="pt-2 xs:pt-4">
        {items.map(({ children }, index) => {
          return <TabPanel key={index}>{children}</TabPanel>;
        })}
      </TabPanels>
    </TabGroup>
  );
};

Tabs.displayName = "Tabs";

export { Tabs };
