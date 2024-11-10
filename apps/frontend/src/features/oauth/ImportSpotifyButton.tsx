import { Icons } from "@/components/icons/Icons";
import { Tag } from "@/components/ui/Tag";
import { FRONTEND_URL } from "@/config";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

const ImportSpotifyButton = ({
  addElement = true,
  fullWidth = false,
}: {
  addElement?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <Link
      href={`https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_SPOTIFY_CLIENT_ID}&state=github&response_type=code&redirect_uri=${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`}
    >
      <Tag
        emoji={<Icons.Github />}
        variant="gray"
        text="Spotify"
        className={cn("pl-4 pr-8", fullWidth ? "w-full" : "min-w-max")}
        addElement={addElement}
        refresh={!addElement}
        fullWidth={fullWidth}
      />
    </Link>
  );
};

export default ImportSpotifyButton;
