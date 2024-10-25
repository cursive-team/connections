import { Icons } from "@/components/Icons";
import { Tag } from "@/components/ui/Tag";
import { FRONTEND_URL } from "@/config";
import Link from "next/link";

const ImportStravaButton = () => {
  return (
    <Link
      href={`https://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_ID}&response_type=code&state=strava&redirect_uri=${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`}
    >
      <Tag
        emoji={<Icons.Strava />}
        variant="transparent"
        text="Strava"
        className="!bg-[#FC4C01] !text-white self-start min-w-max pl-4 pr-8"
        addElement
      />
    </Link>
  );
};

export default ImportStravaButton;
