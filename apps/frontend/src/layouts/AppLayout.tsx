"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";
import { IoIosArrowBack as BackIcon } from "react-icons/io";

interface AppLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  withContainer?: boolean;
  className?: string;
  back?: {
    label: string;
    href: string;
  };
  header?: React.ReactNode;
  headerDivider?: boolean;
}

export default function AppLayout({
  children,
  showFooter = true,
  showHeader = false,
  header = null,
  headerDivider = false,
  className = "",
  back = undefined,
  withContainer = true,
}: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {back && (
        <div className={cn(
          "sticky top-0 h-12 flex items-center bg-white z-20",
          headerDivider && "border-b border-b-quaternary/20"
        )}
        >
          <div className="px-4">
            <Link className="flex gap-1 items-center" href={back?.href ?? "/"}>
              <BackIcon size={12} />
              <span className="text-sm">{back?.label}</span>
            </Link>
          </div>
        </div>
      )}
      {header && (
        <div
          className={cn(
            "flex items-center relative min-h-12 px-3",
            headerDivider && "border-b border-b-quaternary/20"
          )}
        >
          {header}
        </div>
      )}
      {showHeader && (
        <AppHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}
      <div
        className={cn(
          withContainer && "px-3",
          showFooter && "mb-[78px]",
          className
        )}
      >
        {children}
      </div>
      {!isMenuOpen && showFooter && <AppFooter />}
    </div>
  );
}
