import type { Metadata } from "next";
import "../../styles/globals.scss";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/components/Layout/Navbar/Navbar";
import Footer from "@/components/Layout/Footer/Footer";
import Body from "@/components/Layout/Body/Body";
import Providers from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "Ink | Digital Library",
  description:
    "Ink — це сучасна цифрова бібліотека для читання книг, манґи та коміксів.",
  manifest: "/manifest.webmanifest",
  themeColor: "#000000",
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <Body>{children}</Body>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
