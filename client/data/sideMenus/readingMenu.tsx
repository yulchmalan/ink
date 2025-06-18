import type { Section } from "@/components/Layout/Profile/SideMenu/SideMenu";
import Grid from "@/assets/icons/Grid";
import Rows from "@/assets/icons/Rows";
import { useTranslations } from "next-intl";

export const generateReadingMenu = (
  lists: { name: string; titles: any[] }[],
  t: ReturnType<typeof useTranslations<"Profile">>
): Section[] => [
  {
    title: t("lists"),
    type: "list",
    items: [
      {
        label: t("all"),
        value: "all",
        badge: lists.reduce((acc, l) => acc + l.titles.length, 0),
      },
      ...lists.map((list) => ({
        label: t(list.name as any), // типово: reading, planned, etc.
        value: list.name,
        badge: list.titles.length,
      })),
    ],
  },
  {
    title: t("sort_by"),
    type: "radio",
    items: [
      { label: t("sort_name"), value: "title" },
      { label: t("sort_added"), value: "added" },
      { label: t("sort_updated"), value: "updated" },
      { label: t("sort_read"), value: "read-date" },
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
    title: t("view"),
    type: "icon",
    items: [
      { label: t("rows"), value: "row", icon: <Rows /> },
      { label: t("grid"), value: "grid", icon: <Grid /> },
    ],
  },
];
