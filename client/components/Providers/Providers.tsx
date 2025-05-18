"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import SocialAuthSync from "@/components/LogicComponents/SocialAuthSync";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export default function Providers({ children, locale, messages }: Props) {
  return (
    <SessionProvider>
      <AuthProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SocialAuthSync />
          {children}
        </NextIntlClientProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
