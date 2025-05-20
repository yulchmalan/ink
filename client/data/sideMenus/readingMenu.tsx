import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import Grid from "@/assets/icons/Grid";
import Rows from "@/assets/icons/Rows";

export const generateReadingMenu = (
  lists: { name: string; titles: any[] }[]
): Section[] => [
  {
    title: "Списки",
    type: "list",
    items: [
      {
        label: "Все",
        value: "all",
        badge: lists.reduce((acc, l) => acc + l.titles.length, 0),
      },
      ...lists.map((list) => ({
        label: convertListLabel(list.name),
        value: list.name,
        badge: list.titles.length,
      })),
    ],
  },
  {
    title: "Сортувати за",
    type: "radio",
    items: [
      { label: "Назвою (А-Я)", value: "title" },
      { label: "Назвою (A-Z)", value: "title-eng" },
      { label: "Датою додавання", value: "added" },
      { label: "Датою оновлення", value: "updated" },
      { label: "Датою читання", value: "read-date" },
    ],
    secondary: {
      type: "radio",
      items: [
        { label: "Зростанням", value: "asc" },
        { label: "Спаданням", value: "desc" },
      ],
    },
  },
  {
    title: "Вигляд",
    type: "icon",
    items: [
      { label: "Рядки", value: "rows", icon: <Rows /> },
      { label: "Сітка", value: "grid", icon: <Grid /> },
    ],
  },
];

const convertListLabel = (key: string): string => {
  const map: Record<string, string> = {
    all: "Все",
    reading: "Читаю",
    planned: "В планах",
    completed: "Прочитано",
    dropped: "Закинуто",
    favorite: "Улюблене",
  };
  return map[key] || key;
};
