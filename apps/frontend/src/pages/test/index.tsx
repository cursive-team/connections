import { Card } from "@/components/cards/Card";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";

export default function TestPage() {
  const { darkTheme } = useSettings();
  const verifiedIntersection = {
    contacts: [],
  };
  return (
    <div className="container py-4">
      <Card.Base
        variant="gray"
        className={cn(
          "px-2 pt-2 pb-4 rounded-lg w-full  flex-col justify-start items-start gap-2 inline-flex",
          darkTheme ? "border !border-white" : "border border-black/80"
        )}
      >
        <div className="text-sm font-semibold text-label-primary font-sans">
          📇 Common contacts
        </div>
        {verifiedIntersection.contacts.length === 0 ? (
          <div className="text-sm text-label-primary font-sans font-normal">
            No common contacts.
          </div>
        ) : (
          <div className="text-sm text-link-primary font-sans font-normal">
            {verifiedIntersection.contacts.map((contact, index) => (
              <>
                <span className="text-label-primary">
                  {index !== 0 && " | "}
                </span>
                <Link href={`/people/${contact}`}>{contact}</Link>
              </>
            ))}
          </div>
        )}
      </Card.Base>
    </div>
  );
}
