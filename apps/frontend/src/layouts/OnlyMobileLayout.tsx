"use client";

import MobileDetect from "mobile-detect";
import React, { useEffect, useRef } from "react";
import { FullPageBanner } from "@/components/FullPageBanner";
import { APP_CONFIG } from "@/config";
import detectIncognito from "detectincognitojs";
import router from "next/router";

interface OnlyMobileProps {
  children?: React.ReactNode;
}

export default function OnlyMobileLayout({ children }: OnlyMobileProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const md = useRef<any>();
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isIncognito, setIsIncognito] = React.useState(false);
  const [isVanadium, setIsVanadium] = React.useState(false);

  useEffect(() => {
    async function checkIncognitoStatus() {
      const isIncognito = await detectIncognito();
      if (isIncognito.isPrivate) {
        setIsIncognito(true);
        return;
      }
    }

    checkIncognitoStatus();
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      md.current = new MobileDetect(window?.navigator?.userAgent);
      setIsMobile(md.current?.mobile());
      setIsLoaded(true);
      setIsVanadium(
        window.navigator.userAgent.toLowerCase().includes("vanadium")
      );
    }
  }, []);

  const validMobile = APP_CONFIG.IS_MOBILE_ONLY && isMobile;
  const validIncognito = !APP_CONFIG.ALLOW_INCOGNITO && !isIncognito;

  const canUseApp = validMobile && validIncognito && !isVanadium;

  if (!isLoaded) return null;

  return (
    <>
      {!canUseApp ? (
        <FullPageBanner
          description={`${APP_CONFIG.APP_NAME} is only available on mobile devices. Please visit the website on your phone in order to take part in the experience.`}
          isVanadium={isVanadium}
        />
      ) : (
        children
      )}
    </>
  );
}
