import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateCatalogMenu = (): Section[] => [
  {
    title: "Фільтри",
    type: "expandable",
    items: [
      {
        label: "Жанри",
        value: "genres",
        expandableTarget: "genres",
      },
      {
        label: "Теги",
        value: "tags",
        expandableTarget: "tags",
      },
    ],
  },
  {
    title: "Оцінка",
    type: "range",
    items: [],
  },
  {
    title: "Сортування",
    type: "radio",
    items: [
      { label: "Назвою (А-Я)", value: "NAME" },
      { label: "Рейтингом", value: "RATING" },
      { label: "Датою додавання", value: "CREATED_AT" },
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
    title: "Тип",
    type: "checkbox",
    items: [
      { label: "Комікс", value: "COMIC" },
      { label: "Книга", value: "NOVEL" },
    ],
  },
  {
    title: "Статус тайтла",
    type: "checkbox",
    items: [
      { label: "Завершено", value: "COMPLETED" },
      { label: "Виходить", value: "ONGOING" },
      { label: "Анонс", value: "ANNOUNCED" },
    ],
  },
  {
    title: "Статус перекладу",
    type: "checkbox",
    items: [
      { label: "Завершено", value: "TRANSLATED" },
      { label: "Анонс", value: "NOT_TRANSLATED" },
      { label: "Продовжується", value: "IN_PROGRESS" },
    ],
  },
  {
    title: "Мої списки",
    type: "checkbox",
    items: [
      { label: "Читаю", value: "reading" },
      { label: "В планах", value: "planned" },
      { label: "Прочитано", value: "completed" },
      { label: "Закинуто", value: "dropped" },
      { label: "Улюблене", value: "favorite" },
    ],
  },
];
