import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

const sortMenu: Section = {
  title: "Сортувати за",
  type: "radio",
  items: [
    { label: "За датою", value: "date" },
    { label: "За рейтингом", value: "rating" },
  ],
  secondary: {
    type: "radio",
    items: [
      { label: "Зростанням", value: "asc" },
      { label: "Спаданням", value: "desc" },
    ],
  },
};

export default sortMenu;
