import useSettings from "@/hooks/useSettings";
import AppLayout from "@/layouts/AppLayout";
import { cn } from "@/lib/frontend/util";

interface ShopCardProps {
  fullscreen?: boolean;
  label?: string;
  taps?: number;
}

const ShopCard = ({
  fullscreen = false,
  label = "-",
  taps = 0,
}: ShopCardProps) => {
  const { darkTheme } = useSettings();
  return (
    <div
      className={cn(
        "flex flex-col border-b-[0.5px] border-r-[0.5px] first-of-type:border-t-[0.5px]",
        fullscreen ? "col-span-2" : "col-span-1",
        darkTheme
          ? "border-b-white/50 border-r-white/50 first-of-type:border-t-white/50"
          : "border-b-black/50 border-r-black/50 first-of-type:border-t-black/50"
      )}
    >
      <div
        className={cn(
          "aspect-square border-b-[0.5px] p-4 flex items-center justify-center",
          darkTheme ? "border-b-white/50" : "border-b-black/50"
        )}
      >
        <img src="https://prd.place/300" alt="" />
      </div>
      <div
        className="flex flex-col gap-1 px-5 py-4"
        style={{
          background: "rgba(255, 157, 248, 0.10)",
        }}
      >
        <span className="text-sm font-normal text-label-primary leading-none line-clamp-1 overflow-hidden">
          {label}
        </span>
        <span className="text-sm font-medium text-label-primary leading-none">
          {`${taps} taps`}
        </span>
      </div>
    </div>
  );
};

export default function ShopPage() {
  return (
    <AppLayout
      withContainer={false}
      showFooter={false}
      back={{
        href: "/community",
        label: "Back",
        content: (
          <div
            className="absolute left-0 right-0 bottom-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
            }}
          ></div>
        ),
      }}
    >
      <div className={cn("flex flex-col overflow-hidden")}>
        <div className="flex flex-col gap-1 p-4">
          <span className="text-label-primary text-xl font-bold leading-none font-sans tracking-[-0.1px]">
            Museum merch store
          </span>
          <span className="text-sm text-label-tertiary font-normal">
            Featuring hand-made NFC necklaces, locally sourced NFC bracelets,
            and historical cryptography T-shirts. Pick it up from our museum
            booth near the registration desks!
          </span>
        </div>
        <div className={cn("grid grid-cols-2")}>
          <ShopCard fullscreen />
          <ShopCard label="productproductproductproductproductproductproduct" />
          <ShopCard label="product" />
          <ShopCard fullscreen label="product" />
          <ShopCard label="product" />
          <ShopCard label="product" />
          <ShopCard label="product" />
          <ShopCard label="product" />
          <ShopCard label="product" />
          <ShopCard label="product" />
        </div>
      </div>
    </AppLayout>
  );
}
