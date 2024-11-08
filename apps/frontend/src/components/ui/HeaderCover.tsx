import { cn } from "@/lib/frontend/util";
import Image from "next/image";

interface HeaderCoverProps {
  isLoading?: boolean;
  className?: string;
  size?: number;
  image?: "edge-city" | "devcon";
}

export const CursiveLogo = ({
  isLoading = false,
  className = "",
  size = 68,
}: HeaderCoverProps) => {
  return (
    <Image
      src="/images/cursive-logo.png"
      alt="cursive logo"
      className={cn(className, isLoading && "animate-pulse-scale")}
      width={size}
      height={size}
    />
  );
};

export const HeaderCover = ({ isLoading = false, image }: HeaderCoverProps) => {
  return (
    <div className="relative w-full top-0 pb-5">
      <div className="relative h-full">
        {image === "edge-city" && (
          <Image
            src="/images/edge-city-logo.png"
            alt="edge city logo"
            className=" absolute left-4 top-4"
            width={96}
            height={57}
          />
        )}
        {image === "edge-city" && (
          <Image
            src="/images/lanna_register_cover_compressed.svg"
            alt="edge city register main"
            className=" object-cover w-full"
            width={100}
            height={200}
          />
        )}
        {image === "devcon" && (
          <>
            <Image
              src="/images/devcon_register_cover.png"
              alt="devcon register main"
              className="object-cover w-full"
              width={400}
              height={300}
            />
            <CursiveLogo
              className="position absolute -bottom-9 left-1/2 -ml-[30px]"
              isLoading={isLoading}
              image={image}
            />
          </>
        )}
        {image === undefined && (
          <Image
            src="/images/default_header_cover.svg"
            alt="default cover"
            className=" object-cover w-full"
            width={100}
            height={200}
          />
        )}
      </div>
    </div>
  );
};
