import { Icons } from "@/components/Icons";
import { Tag } from "@/components/ui/Tag";
import { FRONTEND_URL } from "@/config";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

const ImportStravaButton = ({
  addElement = true,
  fullWidth = false,
}: {
  addElement?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <Link
      href={`https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_ID}&response_type=code&state=strava&redirect_uri=${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`}
    >
      <Tag
        emoji={<Icons.Strava />}
        variant="transparent"
        text="Strava"
        className={cn(
          "!bg-[#FC4C01] !text-white self-start pl-4",
          addElement ? "pr-8" : "pr-4",
          fullWidth ? "w-full" : "min-w-max"
        )}
        addElement={addElement}
        fullWidth={fullWidth}
      />
    </Link>
  );
};

export default ImportStravaButton;
