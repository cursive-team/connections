import { cn } from "@/lib/frontend/util";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <body className={cn("antialiased h-full")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
