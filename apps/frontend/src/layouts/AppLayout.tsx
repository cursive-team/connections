"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { cn } from "@/lib/frontend/util";
import Link from "next/link";
import { IoIosArrowBack as BackIcon } from "react-icons/io";
import { NextSeo } from "next-seo";

interface AppLayoutProps {
  children?: React.ReactNode;
  showFooter?: boolean;
  showHeader?: boolean;
  withContainer?: boolean;
  className?: string;
  seoTitle?: string;
  back?: {
    label: string;
    href: string;
    content?: React.ReactNode;
  };
  header?: React.ReactNode;
  footer?: React.ReactNode;
  headerDivider?: boolean;
  headerContainer?: boolean;
}

export default function AppLayout({
  children,
  showFooter = true,
  showHeader = false,
  header = null,
  headerDivider = false,
  headerContainer = true,
  className = "",
  back = undefined,
  withContainer = true,
  seoTitle = undefined,
  footer = undefined,
}: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {seoTitle && <NextSeo title={seoTitle} />}
      {back && (
        <div
          className={cn(
            "sticky top-0 h-12 flex items-center border-b border-b-quaternary/20 bg-background z-20"
          )}
        >
          <div className="px-4">
            <Link className="flex gap-1 items-center" href={back?.href ?? "/"}>
              <BackIcon className="text-label-primary" size={12} />
              <span className="text-sm text-label-primary">{back?.label}</span>
            </Link>
          </div>
          {back?.content}
        </div>
      )}
      {header && (
        <div
          className={cn(
            "flex items-center relative min-h-12 w-full",
            headerDivider && "border-b border-b-quaternary/20",
            headerContainer && "px-3"
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
      {footer}
    </div>
  );
}
