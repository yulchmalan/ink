"use client";

import { usePathname } from "next/navigation";
import { knownRoutes } from "./knownRoutes"; // Шлях до твого списку

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locales = ["uk", "en", "pl"];
  const pathSegments = pathname.split("/").filter(Boolean);

  const locale = pathSegments[0];
  const route = pathSegments[1] || "";

  const isLocale = locales.includes(locale);
  const isKnownRoute = knownRoutes.includes(route);

  const shouldWrap = !(isLocale && isKnownRoute);

  if (shouldWrap) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return <>{children}</>;
}
