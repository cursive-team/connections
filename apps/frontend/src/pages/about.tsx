import { Icons } from "@/components/icons/Icons";
import AppLayout from "@/layouts/AppLayout";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <AppLayout className="flex flex-col gap-6 pt-8 px-4">
      <h1 className="font-sans text-[30px] leading-[30px] font-semibold text-label-primary tracking-[-0.22px]">
        Experience cryptography for human connection.
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-label-primary font-medium text-lg tracking-[-0.1px]">
            About the app
          </span>
          <span className="text-label-tertiary font-sans text-base font-medium">
            <i>Cursive Connections</i> is an experimental social app using{" "}
            <b>multi-party computation (MPC)</b> to enable safer and more
            efficient human connection.It features first-of-its-kind consumer
            experiments with coSNARKs, private set intersections, and digital
            pheromones.
            {/* Break the ice by discovering shared
            experiences, get insights into community beliefs, and receive
            high-quality opportunities, all while maintaining ownership of your
            personal data. */}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-primary font-medium text-lg tracking-[-0.1px]">
            About Cursive
          </span>
          <span className="text-label-tertiary font-sans text-base font-medium">
            <i>Cursive</i> is a research lab and design studio focused on
            cryptography for human connection. We are supported by grants from
            the{" "}
            <Link
              className="text-[#F429D5]"
              href="https://pse.dev"
              target="_blank"
            >
              Privacy & Scaling Explorations
            </Link>{" "}
            team at the Ethereum Foundation.
          </span>
        </div>
        <Link href={"https://twitter.com/cursive_team"} target="_blank">
          <div className="flex w-full items-center justify-between bg-gray-100 rounded-lg p-2">
            <span className="text-iron-600 font-semibold text-sm">
              Cursive Twitter
            </span>
            <Icons.ExternalLink className="text-gray-10" />
          </div>
        </Link>
        <Link
          href={"https://github.com/cursive-team/connections"}
          target="_blank"
        >
          <div className="flex w-full items-center justify-between bg-gray-100 rounded-lg p-2">
            <span className="text-iron-600 font-semibold text-sm">
              Cursive GitHub
            </span>
            <Icons.ExternalLink className="text-gray-10" />
          </div>
        </Link>
      </div>
    </AppLayout>
  );
}
