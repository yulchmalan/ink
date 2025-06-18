import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import { useTranslations } from "next-intl";

export const generateSortMenu = (
  t: ReturnType<typeof useTranslations<"Profile">>
): Section => ({
  title: t("sort_by"),
  type: "radio",
  items: [
    { label: t("sort_date"), value: "date" },
    { label: t("sort_rating"), value: "rating" },
  ],
  secondary: {
    type: "radio",
    items: [
      { label: t("sort_asc"), value: "asc" },
      { label: t("sort_desc"), value: "desc" },
    ],
  },
});
