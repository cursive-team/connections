import "@/styles/globals.css"; // Ensure global styles are imported here
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={dmSans.className}>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          className: "font-sans text-iron-950",
        }}
      />
    </main>
  );
}
