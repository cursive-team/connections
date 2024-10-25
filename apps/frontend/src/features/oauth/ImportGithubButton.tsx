import { Icons } from "@/components/Icons";
import { Tag } from "@/components/ui/Tag";
import { FRONTEND_URL } from "@/config";
import Link from "next/link";

const ImportGithubButton = () => {
  return (
    <Link
      href={`https://www.github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID}&state=github&response_type=code&redirect_uri=${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`}
    >
      <Tag
        emoji={<Icons.GitHub />}
        variant="gray"
        text="GitHub"
        className="min-w-max pl-4 pr-8"
        addElement
      />
    </Link>
  );
};

export default ImportGithubButton;
