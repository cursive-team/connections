import { Icons } from "@/components/icons/Icons";
import { Tag } from "@/components/ui/Tag";
import { BASE_API_URL, FRONTEND_URL } from "@/config";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

const ImportTwitterButton = ({
  addElement = true,
  fullWidth = false,
}: {
  addElement?: boolean;
  fullWidth?: boolean;
}) => {
// replace with user id or any other identifier 
  const userId = "0x0";
  return (
    <Link
      href={`${BASE_API_URL}/reclaim?redirectUrl=${FRONTEND_URL}/home&userId=${userId}`}
    >
      <Tag
        emoji={<Icons.GitHub />}
        variant="gray"
        text="GitHub"
        className={cn("pl-4 pr-8", fullWidth ? "w-full" : "min-w-max")}
        addElement={addElement}
        refresh={!addElement}
        fullWidth={fullWidth}
      />
    </Link>
  );
};

export default ImportTwitterButton;
