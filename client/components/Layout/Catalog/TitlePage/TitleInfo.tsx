"use client";

import styles from "./title-info.module.scss";
import { useEffect, useState } from "react";
import TitlePageGrid from "@/components/Layout/Grid/TitlePageGrid";
import TitleCover from "@/components/Layout/Catalog/TitleCover/TitleCover";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import Tabs from "../../Tabs/Tabs";
import Dropdown from "@/components/UI/Dropdown/Dropdown";
import Plus from "@/assets/icons/Plus";
import Tag from "@/components/UI/Tag/Tag";
import RatingStats from "./Rating/RatingStats";
import ListStats from "./ListStats/ListStats";
import CommentsSection from "./Comment/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
import { GET_USER_LISTS_WITH_TITLE } from "@/graphql/queries/getUserListsWithTitle";
import { ADD_TITLE_TO_LIST } from "@/graphql/mutations/addTitleToList";
import Rating from "@/components/UI/Rating/Rating";

const TRANSLATION_LABELS: Record<string, string> = {
  TRANSLATED: "Перекладено",
  IN_PROGRESS: "У процесі",
  NOT_TRANSLATED: "Без перекладу",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "Завершено",
  ONGOING: "Онґоїнг",
  ANNOUNCED: "Анонсовано",
};

const LISTS = [
  { id: "reading", label: "Читаю" },
  { id: "planned", label: "В планах" },
  { id: "completed", label: "Прочитано" },
  { id: "dropped", label: "Закинуто" },
  { id: "favorite", label: "Улюблене" },
];

interface Props {
  title: {
    id: string;
    name: string;
    author?: { name: string };
    franchise?: string;
    translation?: string;
    status?: string;
    genres?: { name: { en: string } }[];
    tags?: { name: { en: string } }[];
    description?: string;
  };
}

export default function TitleInfo({ title }: Props) {
  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined
  );

  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchList = async () => {
      if (!currentUserId) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: GET_USER_LISTS_WITH_TITLE,
            variables: { id: currentUserId },
          }),
          cache: "no-store",
        });

        const json = await res.json();
        const lists = json.data?.user?.lists ?? [];

        for (const list of lists) {
          const found = list.titles.find((t: any) => t.title.id === title.id);
          if (found) {
            setSelectedListId(list.name);
            setUserRating(found.rating ?? 0);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching user lists:", err);
      }
    };

    fetchList();
  }, [currentUserId, title.id]);

  const handleListChange = async (listId: string) => {
    if (!currentUserId) return;
    setSelectedListId(listId);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: ADD_TITLE_TO_LIST,
          variables: {
            userId: currentUserId,
            input: {
              listName: listId,
              titleId: title.id,
              language: "uk",
            },
          },
        }),
      });
    } catch (err) {
      console.error("Error adding title to list:", err);
    }
  };

  const handleRatingChange = async (rating: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation {
            updateTitleRating(
              userId: "${currentUserId}",
              titleId: "${title.id}",
              rating: ${rating},
              language: "uk"
            )
          }
        `,
        }),
      });
      setUserRating(rating);
    } catch (err) {
      console.error("Error updating rating:", err);
    }
  };
  const tabs = [
    {
      title: "Інформація",
      content: (
        <div className={styles.infoSection}>
          {title.description && (
            <section>
              <h2>Опис</h2>
              <p>{title.description}</p>
            </section>
          )}

          {title.author?.name && (
            <section>
              <h2>Автор</h2>
              <p>{title.author.name}</p>
            </section>
          )}

          {title.franchise && (
            <section>
              <h2>Франшиза</h2>
              <p>{title.franchise}</p>
            </section>
          )}

          <div className={styles.halfGrid}>
            {title.translation && TRANSLATION_LABELS[title.translation] && (
              <section>
                <h2>Переклад</h2>
                <p>{TRANSLATION_LABELS[title.translation]}</p>
              </section>
            )}

            {title.status && STATUS_LABELS[title.status] && (
              <section>
                <h2>Статус</h2>
                <p>{STATUS_LABELS[title.status]}</p>
              </section>
            )}
          </div>

          {Array.isArray(title.genres) && title.genres.length > 0 && (
            <section>
              <h2>Жанри</h2>
              <ul className={styles.tagGroup}>
                {title.genres.map((g) => (
                  <li key={g.name.en} className={styles.tag}>
                    <Tag value={`${g.name.en}`}></Tag>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {Array.isArray(title.tags) && title.tags.length > 0 && (
            <section>
              <h2>Теги</h2>
              <ul className={styles.tagGroup}>
                {title.tags.map((t) => (
                  <li key={t.name.en} className={styles.tag}>
                    <Tag value={`#${t.name.en}`}></Tag>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className={styles.halfGrid}>
            <RatingStats titleId={title.id} />
            <ListStats titleId={title.id} />
          </div>
        </div>
      ),
    },
    {
      title: "Розділи",
      content: <div>Розділи</div>,
    },
    {
      title: "Коментарі",
      content: <CommentsSection titleId={title.id} />,
    },
  ];

  const [userRating, setUserRating] = useState<number | null>(null);

  return (
    <TitlePageGrid
      sidebar={
        <>
          {title && (
            <TitleCover
              className={styles.cover}
              id={title.id}
              name={title.name}
            />
          )}
          <Button className={styles.primaryBtn}>Почати читати</Button>
          {currentUserId && (
            <Dropdown
              options={LISTS}
              selectedId={selectedListId}
              onSelect={handleListChange}
              placeholder={
                <>
                  <Plus />
                  Додати в плани
                </>
              }
            />
          )}
        </>
      }
    >
      <Wrapper>
        <div className={styles.header}>
          <h1 className={styles.h1}>{title.name}</h1>
          {currentUserId && userRating !== null && (
            <Rating
              value={userRating / 2}
              onChange={(newValue) => {
                handleRatingChange(newValue * 2);
              }}
              size={24}
            />
          )}
        </div>
        <Tabs tabs={tabs}></Tabs>
      </Wrapper>
    </TitlePageGrid>
  );
}
