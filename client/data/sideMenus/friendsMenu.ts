import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

const friendsMenu: Section = {
  type: "list",
  items: [
    { label: "Список Друзів", value: "friends" },
    { label: "Заявки", value: "requests" },
    { label: "Відправлені заявки", value: "sent" },
  ],
};

export default friendsMenu;
