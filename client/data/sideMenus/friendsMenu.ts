import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

const friendsMenu: Section = {
  type: "list",
  title: "Керування",
  items: [
    { label: "Список Друзів", value: "ACCEPTED" },
    { label: "Заявки", value: "RECEIVED" },
    { label: "Відправлені заявки", value: "PENDING" },
  ],
};

export default friendsMenu;
