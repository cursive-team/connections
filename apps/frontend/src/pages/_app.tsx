import "@/styles/globals.css"; // Ensure global styles are imported here
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import AppLayout from "@/layouts/AppLayout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          className: "font-sans text-iron-950",
        }}
      />
    </AppLayout>
  );
}
