"use client";

import MobileDetect from "mobile-detect";
import React, { useEffect, useRef } from "react";
import { ErrorFullPageBanner } from "@/components/ErrorFullPageBanner";
import { APP_CONFIG } from "@/config";
import detectIncognito from "detectincognitojs";

interface OnlyMobileProps {
  children?: React.ReactNode;
  ignoreMobile?: boolean;
}

export default function OnlyMobileLayout({
  children,
  ignoreMobile = false,
}: OnlyMobileProps) {
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
  }, []);

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
  const canUseApp =
    ignoreMobile || (validMobile && validIncognito && !isVanadium);

  if (!isLoaded) return null;

  return (
    <>
      {!canUseApp ? (
        <ErrorFullPageBanner
          isIncognito={!validIncognito}
          isVanadium={isVanadium}
          isNotMobile={!validMobile}
        />
      ) : (
        children
      )}
    </>
  );
}
