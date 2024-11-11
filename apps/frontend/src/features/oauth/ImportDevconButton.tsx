import { FaEthereum as Ethereum } from "react-icons/fa";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

const ImportDevconButton = ({
  addElement = true,
  fullWidth = false,
}: {
  addElement?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <Link
      href="/imports/devcon"
    >
      <Tag
        emoji={<Ethereum />}
        variant="gray"
        text="Devcon"
        className={cn("pl-4 pr-8", fullWidth ? "w-full" : "min-w-max")}
        addElement={addElement}
        refresh={!addElement}
        fullWidth={fullWidth}
      />
    </Link>
  );
};

export default ImportDevconButton;
