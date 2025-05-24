"use client";

import React from "react";
import type { SavedTitle, TitlePreview, User } from "@/types/user";
import TitleCard from "./TitleCard/TitleCard";
import styles from "./bookmarks.module.scss";
import clsx from "clsx";
import Wrapper from "../../Wrapper/Wrapper";
import { useLocalizedName } from "@/hooks/useLocalizedName";

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

  const selectedTitles =
    list === "all"
      ? lists.flatMap((l) => l.titles ?? [])
      : lists.find((l) => l.name === list)?.titles ?? [];

  if (selectedTitles.length === 0) {
    return <p>Немає творів у цьому списку.</p>;
  }

  let localizedName;

  const sortedTitles = [...selectedTitles].sort((a, b) => {
    const at = a.title;
    const bt = b.title;
    if (!at || !bt) return 0;
    const getValue = (t: any, s: any) => {
      localizedName = useLocalizedName(t.name, t.alt_names);
      switch (sortBy) {
        case "title":
          return localizedName ?? "";
        case "added":
          return new Date(s.addedAt ?? 0).getTime();
        case "updated":
          return new Date(t.updatedAt ?? 0).getTime();
        case "read-date":
          return new Date(s.last_open ?? 0).getTime();
        default:
          return 0;
      }
    };

    const aVal = getValue(at, a);
    const bVal = getValue(bt, b);

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
        const isNovel = title.type === "NOVEL";

        const chapterCount = isNovel ? 100 : title.content?.chapter ?? 0;
        const chapter = isNovel
          ? Math.min(savedTitle.progress ?? 0, 100)
          : savedTitle.progress ?? 0;

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
              // onEdit={() => {
              //   console.log("dfgd");
              // }}
              type={style}
            />
          </li>
        );
      })}
    </ul>
  );

  return style === "row" ? <Wrapper>{content}</Wrapper> : content;
}
