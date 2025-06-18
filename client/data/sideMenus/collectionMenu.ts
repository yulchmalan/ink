import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateCollectionMenu = (t: ReturnType<typeof import("next-intl").useTranslations<"Catalog">>): Section[] => [
  {
    title: t("sort"),
    type: "radio",
    items: [
      { label: t("sort_added"), value: "CREATED_AT" },
      { label: t("sort_likes"), value: "LIKES" },
    ],
    secondary: {
      type: "radio",
      items: [
        { label: t("sort_asc"), value: "ASC" },
        { label: t("sort_desc"), value: "DESC" },
      ],
    },
  },
];
