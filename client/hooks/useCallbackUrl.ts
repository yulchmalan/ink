"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export const useCallbackUrl = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const redirect = () => {
    router.push(callbackUrl);
  };

  const socialSignIn = async (
    provider: "google" | "github" | "discord"
  ) => {
    try {
      await signIn(provider, {
        callbackUrl,
      });
    } catch (err) {
      console.error(`Social login (${provider}) error:`, err);
    }
  };

  return {
    callbackUrl,
    redirect,
    socialSignIn,
  };
};
