"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { ChipIssuer } from "@types";
import { AppButton } from "@/components/ui/Button";
import { CursiveLogo } from "@/components/ui/HeaderCover";
import LannaCommunityPage from "@/features/community/LannaCommunityPage";
import DevconCommunityPage from "@/features/community/DevconCommunityPage";
import { Metadata } from "next";
import { NextSeo } from "next-seo";
import AppLayout from "@/layouts/AppLayout";

export const metadata: Metadata = {
  title: "Community",
};

const CommunityPage = () => {
  const router = useRouter();
  const [selectedCommunity, setSelectedCommunity] = useState<ChipIssuer | null>(
    null
  );
  const [userChips, setUserChips] = useState<ChipIssuer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserChips = async () => {
      const { user, session } = await storage.getUserAndSession();
      if (!user || !session || session.authTokenExpiresAt < new Date()) {
        toast.error("Please log in to view communities.");
        router.push("/");
        return;
      }

      const userChipIssuers = user.chips.map((chip) => chip.issuer);
      setUserChips(userChipIssuers);

      // Set initial selected community
      if (userChipIssuers.length > 0) {
        setSelectedCommunity(userChipIssuers[0]);
      }

      setLoading(false);
    };

    fetchUserChips();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <CursiveLogo isLoading />
      </div>
    );
  }

  if (userChips.length === 0) {
    return (
      <div className="flex min-h-screen justify-center items-center text-center px-4">
        <span className="text-label-secondary">
          No communities found. Register a chip to join a community.
        </span>
      </div>
    );
  }

  return (
    <>
      <NextSeo title="Community" />
      <AppLayout
        header={
          <>
            <span className="text-label-primary font-medium">Community</span>
            <div
              className="absolute left-0 right-0 bottom-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, #7A74BC 0%, #FF9DF8 39%, #FB5D42 71%, #F00 100%)`,
              }}
            ></div>
          </>
        }
      >
        {userChips.length >= 2 && (
          <div className="flex gap-2 mt-2 sticky top-0 bg-background z-10">
            {userChips.includes(ChipIssuer.EDGE_CITY_LANNA) && (
              <AppButton
                variant={
                  selectedCommunity === ChipIssuer.EDGE_CITY_LANNA
                    ? "outline"
                    : "subtle"
                }
                onClick={() => setSelectedCommunity(ChipIssuer.EDGE_CITY_LANNA)}
                className="flex-1"
              >
                Edge City Lanna
              </AppButton>
            )}
            {userChips.includes(ChipIssuer.DEVCON_2024) && (
              <AppButton
                variant={
                  selectedCommunity === ChipIssuer.DEVCON_2024
                    ? "outline"
                    : "subtle"
                }
                onClick={() => setSelectedCommunity(ChipIssuer.DEVCON_2024)}
                className="flex-1"
              >
                Devcon
              </AppButton>
            )}
          </div>
        )}

        {selectedCommunity === ChipIssuer.EDGE_CITY_LANNA && (
          <LannaCommunityPage />
        )}
        {selectedCommunity === ChipIssuer.DEVCON_2024 && (
          <DevconCommunityPage />
        )}
      </AppLayout>
    </>
  );
};

export default CommunityPage;
