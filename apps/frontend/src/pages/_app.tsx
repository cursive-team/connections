import "@/styles/globals.css"; // Ensure global styles are imported here
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
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
