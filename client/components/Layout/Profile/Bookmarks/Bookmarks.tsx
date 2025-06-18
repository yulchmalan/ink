"use client";

import React from "react";
import type { SavedTitle, User } from "@/types/user";
import TitleCard from "./TitleCard/TitleCard";
import styles from "./bookmarks.module.scss";
import clsx from "clsx";
import Wrapper from "../../Wrapper/Wrapper";
import { useLocalizedName } from "@/hooks/useLocalizedName";
import { useTranslations } from "next-intl";

interface Props {
  user: User;
  style?: "grid" | "row";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  list?: string;
}

export default function BookMarks({
  user,
  style = "grid",
  sortBy = "title",
  sortOrder = "asc",
  list = "all",
}: Props) {
  const lists = user.lists ?? [];
  const t = useTranslations("Profile");

  const selectedTitles =
    list === "all"
      ? lists.flatMap((l) => l.titles ?? [])
      : lists.find((l) => l.name === list)?.titles ?? [];

  if (selectedTitles.length === 0) {
    return <p>{t("no_bookmarks")}</p>;
  }

  const sortedTitles = [...selectedTitles].sort((a, b) => {
    const at = a.title;
    const bt = b.title;
    if (!at || !bt) return 0;

    const nameA = useLocalizedName(at.name, at.alt_names);
    const nameB = useLocalizedName(bt.name, bt.alt_names);

    const getValue = (t: any, s: any, localizedName: string) => {
      switch (sortBy) {
        case "title":
          return localizedName;
        case "added":
          return new Date(s.added ?? 0).getTime();
        case "updated":
          return new Date(t.updatedAt ?? 0).getTime();
        case "read-date":
          return new Date(s.last_open ?? 0).getTime();
        default:
          return 0;
      }
    };

    const aVal = getValue(at, a, nameA);
    const bVal = getValue(bt, b, nameB);

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const content = (
    <ul className={clsx(styles.ul, styles[style])}>
      {sortedTitles.map((savedTitle: SavedTitle, idx) => {
        const title = savedTitle?.title;
        if (!title || typeof title !== "object" || !("name" in title)) {
          return <li key={idx}>Некоректний тайтл</li>;
        }

        const localizedName = useLocalizedName(title.name, title.alt_names);

        const titleId = title.id;
        const chapterCount = title.chapterCount ?? 0;
        const chapter = savedTitle.progress ?? 0;

        return (
          <li key={title.id}>
            <TitleCard
              title={{
                name: localizedName,
                id: titleId,
                chapter,
                chapterCount,
                last_open: savedTitle.last_open,
                type: title.type,
                added: savedTitle.added,
              }}
              type={style}
            />
          </li>
        );
      })}
    </ul>
  );

  return style === "row" ? <Wrapper>{content}</Wrapper> : content;
}
