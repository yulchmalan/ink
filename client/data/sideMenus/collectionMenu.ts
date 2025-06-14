import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateCollectionMenu = (): Section[] => [
  {
    title: "Сортувати за",
    type: "radio",
    items: [
      { label: "Датою", value: "CREATED_AT" },
      { label: "Популярністю", value: "LIKES" },
    ],
    secondary: {
      type: "radio",
      items: [
        { label: "Зростанням", value: "ASC" },
        { label: "Спаданням", value: "DESC" },
      ],
    },
  },
];
