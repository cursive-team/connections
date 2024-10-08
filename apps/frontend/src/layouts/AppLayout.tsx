"use client";

import { FullPageBanner } from "@/components/FullPageBanner";
import useSettings from "@/hooks/useSettings";
import React, { useState } from "react";
import OnlyMobileLayout from "./OnlyMobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

interface AppLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
}

export default function AppLayout({
  children,
  showFooter = true,
  showHeader = true,
}: AppLayoutProps) {
  const { isIncognito } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (isIncognito) {
    return (
      <FullPageBanner description="You're in an incognito tab. Please copy this link into a non-incognito tab in order to take part in the experience!" />
    );
  }

  return (
    <OnlyMobileLayout>
      {showHeader && (
        <AppHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}
      <div className="px-3">{children}</div>
      {!isMenuOpen && showFooter && <AppFooter />}
    </OnlyMobileLayout>
  );
}
