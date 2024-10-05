"use client";

import MobileDetect from "mobile-detect";
import React, { useEffect, useRef } from "react";
import { FullPageBanner } from "@/components/FullPageBanner";
import { APP_CONFIG } from "@/config";

interface OnlyMobileProps {
  children?: React.ReactNode;
}

export default function OnlyMobileLayout({ children }: OnlyMobileProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const md = useRef<any>();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      md.current = new MobileDetect(window?.navigator?.userAgent);
      setIsMobile(md.current?.mobile());
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) return null;
  if (!APP_CONFIG.IS_MOBILE_ONLY) return children;
  return (
    <>
      {!isMobile ? (
        <FullPageBanner
          description={`${APP_CONFIG.APP_NAME} is only available on mobile devices. Please visit the website on your phone in order to take part in the experience.`}
        />
      ) : (
        children
      )}
    </>
  );
}
