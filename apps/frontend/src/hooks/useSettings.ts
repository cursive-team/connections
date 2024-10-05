import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { detectIncognito } from "detectincognitojs";
import { APP_CONFIG } from "@/config";

export default function useSettings() {
  const router = useRouter();
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isIncognito, setIsIncognito] = useState(false);

  useEffect(() => {
    if (APP_CONFIG.ALLOW_INCOGNITO) return;
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
    setPageWidth(window?.innerWidth);
    setPageHeight(window?.innerHeight);
  }, []);

  return { pageWidth, pageHeight, isIncognito };
}
