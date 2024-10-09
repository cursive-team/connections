import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/profile");
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Redirecting to profile... */}
    </div>
  );
}
