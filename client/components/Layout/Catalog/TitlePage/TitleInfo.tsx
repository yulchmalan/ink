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
import { REMOVE_TITLE_FROM_LIST } from "@/graphql/mutations/removeTitleFromList";
import Rating from "@/components/UI/Rating/Rating";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

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

const GET_CHAPTER_COUNT = `
  query GetTitle($id: ObjectID!) {
    getTitle(id: $id) {
      chapterCount
    }
  }
`;

interface LocalizedName {
  en?: string;
  uk?: string;
  pl?: string;
  [key: string]: string | undefined;
}
interface Props {
  title: {
    id: string;
    name: string;
    author?: { name: string };
    franchise?: string;
    translation?: string;
    status?: string;
    genres?: { name: LocalizedName }[];
    tags?: { name: LocalizedName }[];
    description?: string;
  };
}

export default function TitleInfo({ title }: Props) {
  const [selectedListId, setSelectedListId] = useState<string | undefined>();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [chapterCount, setChapterCount] = useState<number>(0);
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;
  const router = useRouter();
  const locale = useLocale().slice(0, 2);

  const fetchListAndRating = async () => {
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
          setProgress(found.progress ?? null);
          return;
        }
      }

      setSelectedListId(undefined);
      setUserRating(null);
      setProgress(null);
    } catch (err) {
      console.error("Error fetching user lists:", err);
    }
  };

  const fetchChapterCount = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: GET_CHAPTER_COUNT,
          variables: { id: title.id },
        }),
        cache: "no-store",
      });

      const json = await res.json();
      const count = json.data?.getTitle?.chapterCount;
      if (typeof count === "number") setChapterCount(count);
    } catch (err) {
      console.error("Error fetching chapters:", err);
    }
  };

  useEffect(() => {
    fetchListAndRating();
    fetchChapterCount();
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
            },
          },
        }),
      });
      fetchListAndRating();
    } catch (err) {
      console.error("Error adding title to list:", err);
    }
  };

  const handleRemoveFromList = async () => {
    if (!currentUserId) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: REMOVE_TITLE_FROM_LIST,
          variables: {
            userId: currentUserId,
            titleId: title.id,
          },
        }),
      });

      setSelectedListId(undefined);
      setUserRating(null);
      setProgress(null);
    } catch (err) {
      console.error("Error removing title:", err);
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!currentUserId) return;
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
            )
          }`,
        }),
      });
      setUserRating(rating);
    } catch (err) {
      console.error("Error updating rating:", err);
    }
  };

  const handleReadClick = () => {
    const chapter = progress || 1;
    router.push(`/catalog/${title.id}/reader?c=${chapter}`);
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
                    <Tag value={g.name[locale] || g.name.en || ""} />
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
                    <Tag value={`#${t.name[locale] || t.name.en || ""} `} />
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
      content: (
        <div className={styles.chapters}>
          {Array.from({ length: chapterCount }, (_, i) => (
            <a
              key={i + 1}
              href={`/catalog/${title.id}/reader?c=${i + 1}`}
              className={styles.chapterCard}
            >
              <div className={styles.chapterNumber}>Розділ {i + 1}</div>
            </a>
          ))}
          {chapterCount === 0 && <p>Розділи відсутні.</p>}
        </div>
      ),
    },
    {
      title: "Коментарі",
      content: <CommentsSection titleId={title.id} />,
    },
  ];

  return (
    <TitlePageGrid
      sidebar={
        <>
          <TitleCover
            className={styles.cover}
            id={title.id}
            name={title.name}
          />
          <Button className={styles.primaryBtn} onClick={handleReadClick}>
            {progress ? "Продовжити читання" : "Почати читати"}
          </Button>
          {currentUserId && (
            <Dropdown
              options={[
                ...LISTS,
                ...(selectedListId
                  ? [{ id: "remove", label: "Видалити зі списків" }]
                  : []),
              ]}
              selectedId={selectedListId}
              onSelect={(id) => {
                if (id === "remove") {
                  handleRemoveFromList();
                } else if (id) {
                  handleListChange(id);
                }
              }}
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
              onChange={(val) => handleRatingChange(val * 2)}
              size={24}
            />
          )}
        </div>
        <Tabs tabs={tabs} />
      </Wrapper>
    </TitlePageGrid>
  );
}
