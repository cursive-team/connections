import React from "react";
import { RegisterHeader } from "@/components/ui/RegisterHeader";

const CreatingAccount: React.FC = () => {
  return (
    <div className="flex flex-col grow">
      <RegisterHeader
        title="Setting up your account..."
        subtitle="Share and connect effortlessly!"
        description="With a simple tap, you can share your details and make connections instantly—without compromising your privacy. You’re always in control and can update or remove your info whenever you like."
      />
    </div>
  );
};

export default CreatingAccount;
