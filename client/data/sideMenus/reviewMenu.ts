import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";

export const generateReviewMenu = (t: ReturnType<typeof import("next-intl").useTranslations<"Catalog">>): Section[] => [
  {
    title: t("sort_by"),
    type: "radio",
    items: [
      { label: t("sort_created"), value: "CREATED_AT" },
      { label: t("sort_rating"), value: "RATING" },
      { label: t("sort_views"), value: "VIEWS" },
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
