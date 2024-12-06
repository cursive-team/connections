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
import { cn } from "@/lib/frontend/util";
import { usePathname } from "next/navigation";
import useSettings from "@/hooks/useSettings";
import { refreshData } from "@/lib/imports";
import { SocketProvider } from "@/lib/socket";
import { refreshMessages } from "@/lib/message";
import { getUser, getUnregisteredUser } from "@/lib/storage/localStorage/user";
import { getSession } from "@/lib/storage/localStorage/session";
import { backfillEdgesForUserWithFeatureAlreadyEnabled } from "@/lib/storage/localStorage/graph";
import { logClientEvent } from "@/lib/frontend/metrics";
import Link from "next/link";
import { FRONTEND_URL } from "@/config";

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
  const [isToastDisabled, setIsToastDisabled] =
    useState(false);

  const { darkTheme } = useSettings();

  let isFortunePage: boolean = false;
  if (pathname?.includes("/fortune")) {
    isFortunePage = pathname.includes("/fortune");
  }

  useEffect(() => {
    const backfillEdgesOnceForEnabledUser = async () => {
      const user = getUser();
      const session = getSession();
      if (user && session && user.tapGraphEnabled && !user.edgesBackfilledForUsersWithEnabledFeature) {
        await backfillEdgesForUserWithFeatureAlreadyEnabled(user, session);
      }
    }
    backfillEdgesOnceForEnabledUser();
  });

  useEffect(() => {
    const gateUnregisteredUser = async () => {
      const user = getUser();
      const session = getSession();
      const unregisteredUser = getUnregisteredUser();

      // If session exists, it means a corresponding user also exists. Redirect to login.
      if (session && session.authTokenExpiresAt < new Date()) {
        router.push("/login");
      }

      if (!user && !session && unregisteredUser) {
        // Unregistered is only allowed onto:
        // - login view
        // - people view
        // - contact view
        // - tap flow
        // - register flow
        // - about page
        // - login page

        // If it's not on a valid page, show error toast
        if (!(router.pathname.match("/people") || router.pathname.match("/tap") || router.pathname === "/" || router.pathname.match("/register") || router.pathname.match("/about") || router.pathname.match("/login"))) {
          // Ensure toast only called once
          setIsToastDisabled(false);

          if (!isToastDisabled) {
            toast(<div>
              {"Unregistered users can only collect contacts. Get a chip at the Cursive booth near entrance to access" +
                " other features! If you already have an account, "}
              <Link
                href={`${FRONTEND_URL}/login`}
                className="underline font-bold"
                onClick={() => {
                  logClientEvent("error-toast-login-link-clicked", {});
                }}
              >
                login here.
              </Link>
            </div>, {duration: 6000});
          }
          router.push("/people");
        } else {
          // On valid page
          setIsToastDisabled(true);
        }
      }

      if (user && session && unregisteredUser) {
        // If user and session are active, ensure unregisteredUser is cleaned up
        await storage.deleteUnregisteredUser();
      }

    }
    gateUnregisteredUser();
  });


  // Note: this is becoming the de facto client event loop
  // Refresh imports when the page is refreshed
  useEffect(() => {
    const refreshImports = async () => {
      const user = await storage.getUser();
      const session = await storage.getSession();
      if (!user || !session) {
        return;
      }

      refreshData();
    }
    refreshImports();
  });

  // Refresh messages when the page is refreshed
  useEffect(() => {
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
      <SocketProvider>
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN!}
          trackOutboundLinks>
          <OnlyMobileLayout ignoreMobile={isFortunePage}>
            <Component {...pageProps} />
          </OnlyMobileLayout>
        </PlausibleProvider>
      </SocketProvider>
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
