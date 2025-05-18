"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SocialAuthSync() {
  const { data: session } = useSession();
  const { login } = useAuth();

  useEffect(() => {
    if (session?.accessToken) {
      login(session.accessToken);
    }
  }, [session]);

  return null;
}
