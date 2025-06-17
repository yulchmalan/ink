import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateReviewMenu = (): Section[] => [
  {
    title: "Сортувати за",
    type: "radio",
    items: [
      { label: "Датою", value: "CREATED_AT" },
      { label: "Оцінкою", value: "RATING" },
      { label: "Переглядами", value: "VIEWS" },
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
