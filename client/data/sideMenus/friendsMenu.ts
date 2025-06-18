"use client"

import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import type { Friend } from "@/types/user";
import { useTranslations } from "next-intl";

type FriendStatus = "ACCEPTED" | "RECEIVED" | "PENDING";

export const generateFriendsMenu = (friends: Friend[], t: ReturnType<typeof useTranslations<"Profile">>): Section => {
  
  const countByStatus: Record<FriendStatus, number> = {
    ACCEPTED: 0,
    RECEIVED: 0,
    PENDING: 0,
  };

  const validStatuses: FriendStatus[] = ["ACCEPTED", "RECEIVED", "PENDING"];

    
  friends.forEach((f) => {
    if (validStatuses.includes(f.status as FriendStatus)) {
      countByStatus[f.status as FriendStatus]++;
    }
  });

  return {
    type: "list",
    title: t("actions"),
    items: [
      {
        label: t("friends_list"),
        value: "ACCEPTED",
        badge: countByStatus.ACCEPTED,
      },
      {
        label: t("friend_requests_received"),
        value: "RECEIVED",
        badge: countByStatus.RECEIVED,
      },
      {
        label: t("friend_requests_sent"),
        value: "PENDING",
        badge: countByStatus.PENDING,
      },
    ],
  };
};
