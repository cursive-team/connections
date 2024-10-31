import Link from "next/link";
import { Icons } from "./icons/Icons";
import { cn } from "@/lib/frontend/util";
import { classed } from "@tw-classed/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

interface AppHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const Title = classed.h3("block font-base text-black", {
  variants: {
    size: {
      small: "text-base leading-1 font-semibold",
      medium: "text-[21px] leading-5 font-medium",
    },
  },
  defaultVariants: {
    size: "small",
  },
});
const Description = classed.span("text-sm text-black leading-5");

const ContentWrapper = classed.div("flex flex-col gap-3 mt-3 xs:gap-4 xs:mt-6");

interface AppHeaderContentProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

interface AppBackHeaderProps {
  redirectTo?: string; // redirect to this page instead of back
  onBackClick?: () => void;
  actions?: ReactNode;
  label?: string;
  sticky?: boolean;
}

export const AppBackHeader = ({
  redirectTo,
  onBackClick,
  actions,
  label,
  sticky = false,
}: AppBackHeaderProps) => {
  const router = useRouter();

  return (
    <div
      className={cn("flex justify-between items-center h-[50px] xs:h-[60px]", {
        "sticky top-0 bg-main": sticky,
      })}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-primary"
        onClick={() => {
          if (typeof onBackClick === "function") {
            onBackClick?.();
          } else {
            if (redirectTo) {
              router.push(redirectTo);
            } else {
              router.back();
            }
          }
        }}
      >
        <Icons.ArrowLeft />
        <span className="text-sm font-normal text-primary">
          {label || "Back"}
        </span>
      </button>
      {actions}
    </div>
  );
};
const AppHeaderContent = ({
  isMenuOpen,
  setIsMenuOpen,
}: AppHeaderContentProps) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  if (!isMenuOpen) return null;

  const MenuItems: { label: string; children: ReactNode }[] = [
    {
      label: "Profile & settings",
      children: null,
    },
    {
      label: "About",
      children: (
        <>
          <ContentWrapper>
            <Title>About the app</Title>
            <Description>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              facilis aperiam facere maiores accusantium non laboriosam odit.
              Enim, fugiat totam.
            </Description>
          </ContentWrapper>
        </>
      ),
    },
  ];

  const showBackButton = activeMenuIndex !== null;

  const onBack = () => {};

  return (
    <div className="fixed inset-0 w-full overflow-auto px-3 xs:px-4 z-100 h-full bg-white">
      <div className="flex xs:h-[60px] py-5">
        {showBackButton && (
          <button
            onClick={onBack}
            type="button"
            className="flex gap-2 items-center text-primary"
          >
            <Icons.ArrowLeft />
            <span>Back</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setActiveMenuIndex(null);
          }}
          className="flex gap-3 items-center ml-auto text-primary"
        >
          <span>Close</span>
          {isMenuOpen ? <Icons.Close /> : <Icons.Burgher />}
        </button>
      </div>
      <div className="mt-2">
        <div className="flex flex-col gap-6">
          {MenuItems.map((item, index) => {
            if (activeMenuIndex !== null) return null;
            return (
              <Title
                key={item.label}
                size="medium"
                onClick={() => {
                  setActiveMenuIndex(index);
                }}
              >
                {item.label}
              </Title>
            );
          })}
        </div>

        {activeMenuIndex !== null && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {MenuItems[activeMenuIndex].children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AppHeader = ({ isMenuOpen, setIsMenuOpen }: AppHeaderProps) => {
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
  };

  return (
    <div
      className={cn("flex w-full items-center p-3 py-5 xs:p-4 z-50", {
        "bg-white": isMenuOpen,
        "bg-transparent": !isMenuOpen,
      })}
    >
      {!isMenuOpen && (
        <Link href="/">
          <button type="button" className="flex gap-2 items-center">
            logo
          </button>
        </Link>
      )}

      <div className="flex gap-4 items-center ml-auto">
        <span className="text-primary">{isMenuOpen && "Close"}</span>
        <button className="text-primary" onClick={toggleMenu}>
          {isMenuOpen ? (
            <Icons.Close className="text-primary" />
          ) : (
            <Icons.Burgher className="text-primary" />
          )}
        </button>
      </div>

      <AppHeaderContent isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </div>
  );
};

AppHeader.displayName = "AppHeader";

export { AppHeader };
