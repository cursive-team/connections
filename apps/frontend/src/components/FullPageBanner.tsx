import { APP_CONFIG } from "@/config";
import useSettings from "@/hooks/useSettings";
import { Card } from "./cards/Card";

interface FullPageBannerProps {
  description: string;
  title?: string;
  iconSize?: number;
}

const FullPageBanner = ({
  description,
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  iconSize = 80,
}: FullPageBannerProps) => {
  const { pageHeight } = useSettings();
  return (
    <div
      style={{
        minHeight: `${pageHeight}px`,
      }}
      className="flex text-center h-full bg-white"
    >
      <div className="flex flex-col gap-2 my-auto mx-auto px-10">
        <div className="flex flex-col gap-2">
          <span className="text-[36px] font-giorgio text-center">
            {APP_CONFIG.APP_NAME}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {title && <Card.Title className="!text-lg">{title}</Card.Title>}
          <Card.Base className="p-2">
            <Card.Description>
              <span className=" text-sm">{description}</span>
            </Card.Description>
          </Card.Base>
        </div>
      </div>
    </div>
  );
};

FullPageBanner.displayName = "FullPageBanner";

export { FullPageBanner };
