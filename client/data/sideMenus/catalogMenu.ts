import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateCatalogMenu = (
  t: ReturnType<typeof import("next-intl").useTranslations<"Catalog">>
): Section[] => [
  {
    title: t("filters"),
    type: "expandable",
    items: [
      {
        label: t("genres"),
        value: "genres",
        expandableTarget: "genres",
      },
      {
        label: t("tags"),
        value: "tags",
        expandableTarget: "tags",
      },
    ],
  },
  {
    title: t("rating"),
    type: "range",
    items: [],
  },
  {
    title: t("sort"),
    type: "radio",
    items: [
      { label: t("sort_name"), value: "NAME" },
      { label: t("sort_rating"), value: "RATING" },
      { label: t("sort_added"), value: "CREATED_AT" },
    ],
    secondary: {
      type: "radio",
      items: [
        { label: t("sort_asc"), value: "asc" },
        { label: t("sort_desc"), value: "desc" },
      ],
    },
  },
  {
    title: t("type"),
    type: "checkbox",
    items: [
      { label: t("comic"), value: "COMIC" },
      { label: t("novel"), value: "NOVEL" },
    ],
  },
  {
    title: t("status"),
    type: "checkbox",
    items: [
      { label: t("finished"), value: "COMPLETED" },
      { label: t("ongoing"), value: "ONGOING" },
      { label: t("announced"), value: "ANNOUNCED" },
    ],
  },
  {
    title: t("transtation_status"),
    type: "checkbox",
    items: [
      { label: t("finished"), value: "TRANSLATED" },
      { label: t("announced"), value: "NOT_TRANSLATED" },
      { label: t("continues"), value: "IN_PROGRESS" },
    ],
  },
  {
    title: t("my_lists"),
    type: "checkbox",
    items: [
      { label: t("reading"), value: "reading" },
      { label: t("planned"), value: "planned" },
      { label: t("completed"), value: "completed" },
      { label: t("dropped"), value: "dropped" },
      { label: t("favorite"), value: "favorite" },
    ],
  },
];
