import { cn } from "@/lib/frontend/util";
import Link from "next/link";

export const AppCopy = ({ className }: any) => {
  return (
    <span
      className={cn(className, "text-tertiary text-xs font-medium font-sans")}
    >
      Built by{" "}
      <Link
        href="https://www.cursive.team/"
        target="_blank"
        className="underline font-bold"
      >
        Cursive
      </Link>
      .
    </span>
  );
};
