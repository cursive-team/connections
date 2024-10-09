import React from "react";
import { useRouter } from "next/router";
import { AppButton } from "@/components/ui/Button";
import { logoutUser } from "@/lib/auth";

const LogoutPage: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <AppButton
        onClick={handleLogout}
        variant="primary"
        size="md"
        className="w-32"
      >
        Logout
      </AppButton>
    </div>
  );
};

export default LogoutPage;
