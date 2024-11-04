import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { detectIncognito } from "detectincognitojs";
import { APP_CONFIG } from "@/config";

const THEME_ID_KEY = "cursive-connections-theme";
export default function useSettings() {
  const router = useRouter();
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isIncognito, setIsIncognito] = useState(false);

  const [darkTheme, setDarkTheme] = useState(false);

  const toggleBodyClass = async (hasDarkTheme: boolean) => {
    if (!hasDarkTheme) {
      document.getElementsByTagName("body")[0].classList.remove("dark");
    } else {
      document.getElementsByTagName("body")[0].classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const currentTheme = localStorage.getItem(THEME_ID_KEY) ?? "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_ID_KEY, newTheme);
    window?.location?.reload();
  };

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
    const theme: string = localStorage.getItem(THEME_ID_KEY) ?? "light";
    localStorage.setItem(THEME_ID_KEY, theme);
    setDarkTheme(theme === "dark");
    toggleBodyClass(theme === "dark");
  }, []);

  useEffect(() => {
    setPageWidth(window?.innerWidth);
    setPageHeight(window?.innerHeight);
  }, []);

  return { pageWidth, pageHeight, isIncognito, darkTheme, toggleTheme };
}
