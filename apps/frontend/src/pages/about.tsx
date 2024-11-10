import AppLayout from "@/layouts/AppLayout";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <AppLayout className="flex flex-col gap-6 pt-8">
      <h1 className="font-sans text-[30px] leading-[30px] font-semibold text-label-primary tracking-[-0.22px]">
        How will you use cryptography to connect?
      </h1>
      <div className="flex flex-col gap-4">
        <span className="text-label-primary font-bold text-xl tracking-[-0.1px]">
          It starts with a tap
        </span>
        <span className="text-label-tertiary font-sans text-base font-medium">
          Add contact info to your accessory that you can easily share with a
          tap. Add your hot takes, web2 reputation, and your Devcon schedule
          then break the ice with new connections by cryptographically revealing
          overlap and nothing else. Use narrowcasting to signal opportunities &
          events to the most relevant folks you meet at Devcon by specifying
          precise, private filters they must satisfy. And share anonymized
          summaries of your data to Devcon-wide dashboards to gain valuable
          insights into the interests & beliefs of the community! Learn more at{" "}
          <Link
            className="text-[#F429D5]"
            href="https://cursive.team/"
            target="_blank"
          >
            Cursive.team
          </Link>
        </span>
      </div>
    </AppLayout>
  );
}
