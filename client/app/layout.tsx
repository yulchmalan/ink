"use client";

import { usePathname } from "next/navigation";
import { knownRoutes } from "./knownRoutes";

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
      <body>{children}</body>
    </html>
  );
}
