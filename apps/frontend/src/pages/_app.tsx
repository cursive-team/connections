import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { toast, Toaster } from "sonner";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { logoutUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";
import PlausibleProvider from "next-plausible";
import OnlyMobileLayout from "@/layouts/OnlyMobileLayout";
import { DefaultSeo } from "next-seo";
// import { AnimatePresence, motion } from "framer-motion";
import { preMigrationSignaturePublicKeys } from "@/common/constants";
import { fetchMessages } from "@/lib/message";
import { cn } from "@/lib/frontend/util";
import { usePathname } from "next/navigation";
import useSettings from "@/hooks/useSettings";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

/* const pageTransitionAnimation = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}; */

export default function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPreMigrationSessionChecked, setIsPreMigrationSessionChecked] =
    useState(false);

  const { darkTheme } = useSettings();

  let isFortunePage: boolean = false;
  if (pathname?.includes("/fortune")) {
    isFortunePage = pathname.includes("/fortune");
  }

  // Refresh messages when the page is refreshed
  useEffect(() => {
    const refreshMessages = async () => {
      console.log("Refreshing messages...");
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (!user || !session) {
        return;
      }

      const messages = await fetchMessages({
        authToken: session.authTokenValue,
        lastMessageFetchedAt: user.lastMessageFetchedAt,
      });
      console.log(`Found ${messages.length} messages`);
      if (messages.length > 0) {
        await storage.processNewMessages(messages);
      }
    };

    refreshMessages();
  }, []);

  // Check if the user is a pre-migration user and logout if so
  useEffect(() => {
    const checkSession = async () => {
      const MIGRATION_CHECK_STORAGE_KEY = "preMigrationSessionChecked";
      // Check if we've already performed this check
      const hasAlreadyChecked = localStorage.getItem(
        MIGRATION_CHECK_STORAGE_KEY
      );

      if (hasAlreadyChecked) {
        setIsPreMigrationSessionChecked(true);
        return;
      }

      const user = await storage.getUser();
      if (
        user &&
        preMigrationSignaturePublicKeys?.includes(
          user.userData.signaturePublicKey
        )
      ) {
        await logoutUser();
        toast(
          "You registered early! Please tap your chip to register for the main experience.",
          {
            duration: 5000,
            className: "font-sans text-label-primary bg-background",
          }
        );
        router.push("/");
      }

      // Mark that we've performed the check
      localStorage.setItem(MIGRATION_CHECK_STORAGE_KEY, "true");
      setIsPreMigrationSessionChecked(true);
    };

    if (!isPreMigrationSessionChecked) {
      checkSession();
    }
  }, [router, isPreMigrationSessionChecked]);

  return (
    <main
      className={cn(
        `${dmSans.className} ${dmSans.variable}`,
        darkTheme && "dark-theme"
      )}
    >
      <DefaultSeo titleTemplate="%s | Cursive Connections" />
      <PlausibleProvider
        domain={process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN!}
        trackOutboundLinks
      >
        <OnlyMobileLayout ignoreMobile={isFortunePage}>
          <Component {...pageProps} />
        </OnlyMobileLayout>
      </PlausibleProvider>
      <Analytics />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          className: "font-sans bg-background text-label-primary",
        }}
      />
    </main>
  );
}
