"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locales = ["uk", "en", "pl"];
  const pathSegments = pathname.split("/").filter(Boolean);

  const locale = pathSegments[0];

  return (
    <html lang={locale || "uk"}>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body>{children}</body>
    </html>
  );
}
