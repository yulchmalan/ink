import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import type { Friend } from "@/types/user";

type FriendStatus = "ACCEPTED" | "RECEIVED" | "PENDING";

export const generateFriendsMenu = (friends: Friend[]): Section => {
  
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
    title: "Керування",
    items: [
      {
        label: "Список Друзів",
        value: "ACCEPTED",
        badge: countByStatus.ACCEPTED,
      },
      {
        label: "Заявки",
        value: "RECEIVED",
        badge: countByStatus.RECEIVED,
      },
      {
        label: "Відправлені заявки",
        value: "PENDING",
        badge: countByStatus.PENDING,
      },
    ],
  };
};
