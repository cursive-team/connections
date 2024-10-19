import { cn } from "@/lib/frontend/util";
import Image from "next/image";

interface HeaderCoverProps {
  isLoading?: boolean;
  className?: string;
}

export const CursiveLogo = ({
  isLoading = false,
  className = "",
}: HeaderCoverProps) => {
  return (
    <Image
      src="/images/cursive-logo.png"
      alt="cursive logo"
      className={cn(className, isLoading && "animate-pulse-scale")}
      width={68}
      height={68}
    />
  );
};

export const HeaderCover = ({ isLoading = false }: HeaderCoverProps) => {
  return (
    <div className="relative w-full top-0 pb-5">
      <div className="relative h-full">
        <Image
          src="/images/edge-city-logo.png"
          alt="edge city logo"
          className=" absolute left-4 top-4"
          width={96}
          height={57}
        />
        <Image
          src="/images/register-main-cover-compressed.svg"
          alt="register main"
          className=" object-cover w-full"
          width={100}
          height={200}
        />
        <CursiveLogo
          className="position absolute -bottom-8 left-1/2 -ml-[30px]"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
