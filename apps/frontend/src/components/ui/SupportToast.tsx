import Link from "next/link";
import { logClientEvent } from "@/lib/frontend/metrics";

export const SupportToast = (
  className: string,
  isError: boolean,
  toastMessage: string,
  messageTarget: string,
  errorInfo: string
) => {
  const params = `text=Toast msg: ${toastMessage};\nError info: ${errorInfo};`;
  const msg = encodeURI(`${messageTarget}?${params}`);
  return (
    <span className={className}>
      <div style={{ display: "ruby" }}>
        {isError && (
          <svg
            style={{ marginRight: "6px" }}
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            height="20"
            width="20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {`${toastMessage}${toastMessage.endsWith(".") ? "" : "."} `}
        <Link
          href={msg}
          // Open link in new tab -- turns out this is pretty important, without it errors occur in tg link
          target="_blank"
          className="underline font-bold"
          onClick={() => {
            logClientEvent("error-support-link-clicked", {});
          }}
        >
          Send this error to our team for support here
        </Link>
        .
      </div>
    </span>
  );
};
