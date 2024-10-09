"use client";

import { FullPageBanner } from "@/components/FullPageBanner";
import useSettings from "@/hooks/useSettings";
import React, { useState } from "react";
import OnlyMobileLayout from "./OnlyMobileLayout";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { cn } from "@/lib/frontend/util";

interface AppLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  withContainer?: boolean;
  className?: string;
  header?: React.ReactNode;
}

export default function AppLayout({
  children,
  showFooter = true,
  showHeader = false,
  header = null,
  className = "",
  withContainer = true,
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
      {header && (
        <div className="flex items-center relative min-h-12 px-3">{header}</div>
      )}
      {showHeader && (
        <AppHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}
      <div className={cn(withContainer && "px-3", className)}>{children}</div>
      {!isMenuOpen && showFooter && <AppFooter />}
    </OnlyMobileLayout>
  );
}
