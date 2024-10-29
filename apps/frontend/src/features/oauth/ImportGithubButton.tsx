import { Icons } from "@/components/Icons";
import { Tag } from "@/components/ui/Tag";
import { FRONTEND_URL } from "@/config";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

const ImportGithubButton = ({
  addElement = true,
}: {
  addElement?: boolean;
}) => {
  return (
    <Link
      href={`https://www.github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID}&state=github&response_type=code&redirect_uri=${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`}
    >
      <Tag
        emoji={<Icons.GitHub />}
        variant="gray"
        text="GitHub"
        className={cn("min-w-max pl-4", addElement ? "pr-8" : "pr-4")}
        addElement={addElement}
      />
    </Link>
  );
};

export default ImportGithubButton;
