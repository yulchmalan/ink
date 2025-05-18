import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import Grid from "@/assets/icons/Grid";
import Rows from "@/assets/icons/Rows";

const readingMenu: Section[] = [
  {
    title: "Списки",
    type: "list",
    items: [
      { label: "Все", value: "all", badge: 60 },
      { label: "Читаю", value: "reading", badge: 10 },
      { label: "В планах", value: "planned", badge: 20 },
      { label: "Прочитано", value: "completed", badge: 20 },
      { label: "Закинуто", value: "dropped", badge: 5 },
      { label: "Улюблене", value: "favourites", badge: 5 },
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

export default readingMenu;
