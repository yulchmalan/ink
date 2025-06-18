"use client";

import styles from "./collection-content.module.scss";
import { formatDistanceToNow } from "date-fns";
import { uk, enUS, pl } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Wrapper from "../Wrapper/Wrapper";
import CommentsSection from "../Catalog/TitlePage/Comment/CommentSection";
import BookCard from "@/components/UI/Cards/BookCard/BookCard";
import ArrowBtn from "@/components/UI/Buttons/ArrowBtn/ArrowBtn";
import { useAuth } from "@/contexts/AuthContext";
import Pencil from "@/assets/icons/Pencil";
import Trash from "@/assets/icons/Trash";
import Dots from "@/assets/icons/Dots";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import Input from "@/components/Form/Input/Input";
import clsx from "clsx";
import PlusCircle from "@/assets/icons/PlusCircle";
import SearchOverlayForCollection from "./SearchOverlayForCollection";
import Cross from "@/assets/icons/Cross";
import Tag from "@/components/UI/Tag/Tag";
import ChevronDown from "@/assets/icons/ChevronDown";
import ChevronUp from "@/assets/icons/ChevronUp";
import { useRouter } from "next/navigation";

type VoteState = "upvoted" | "downvoted" | "none";

interface Props {
  collection: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    user: { _id: string; username: string };
    titles: {
      id: string;
      name: string;
      alt_names: { lang: string; value: string }[];
    }[];
  };
  isCreating?: boolean;
}

export default function CollectionContent({ collection, isCreating }: Props) {
  const locale = useLocale();
  const t = useTranslations("Collection");
  const dateLocale = { uk, en: enUS, pl }[locale as "uk" | "en" | "pl"] ?? enUS;
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const canEdit = currentUserId === collection.user._id;
  const canDelete =
    canEdit ||
    currentUser?.role === "MODERATOR" ||
    currentUser?.role === "OWNER";

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEditing, setIsEditing] = useState(isCreating || false);
  const [editedName, setEditedName] = useState(collection.name);
  const [editedDescription, setEditedDescription] = useState(
    collection.description || ""
  );

  const [showSearch, setShowSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [vote, setVote] = useState<VoteState>("none");
  const rating = likes - dislikes;
  const ratingString = `${likes}/${dislikes}`;
  const [commentsCount, setCommentsCount] = useState(0);

  const [titles, setTitles] = useState<
    { id: string; name: string; alt_names: { lang: string; value: string }[] }[]
  >(collection.titles);

  useLayoutEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("collection-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
          deleteCollection(id: "${collection.id}")
        }`,
      }),
    });
    window.location.href = "/collection";
  };

  const handleAddTitle = async (titleId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
        addTitleToCollection(collectionId: "${collection.id}", titleId: "${titleId}") {
          id
        }
      }`,
      }),
    });

    setShowSearch(false);
    window.location.reload();
  };

  const router = useRouter();

  const handleSave = async () => {
    if (!editedName.trim()) return;

    if (isCreating) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: `
          mutation {
            createCollection(input: {
              name: """${editedName}"""
              description: """${editedDescription}"""
              userId: "${currentUserId}"
              titleIds: []
            }) {
              id
            }
          }
        `,
        }),
      });

      const json = await res.json();
      const newId = json.data?.createCollection?.id;

      if (newId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            query: `
            mutation {
              addExpToUser(userId: "${currentUserId}", amount: 5) {
                _id
                exp
              }
            }
          `,
          }),
        }).catch((err) =>
          console.error("Не вдалося додати досвід за створення колекції:", err)
        );

        router.push(`/collection/${newId}`);
      }
    } else {
      // редагування
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation EditCollection($id: ObjectID!, $edits: EditCollectionInput!) {
            editCollection(id: $id, edits: $edits) {
              id
            }
          }
        `,
          variables: {
            id: collection.id,
            edits: {
              name: editedName,
              description: editedDescription,
            },
          },
        }),
      });

      setIsEditing(false);
    }
  };

  const handleRemoveTitle = async (titleId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
        mutation {
          removeTitleFromCollection(collectionId: "${collection.id}", titleId: "${titleId}") {
            id
          }
        }
      `,
      }),
    });

    if (res.ok) {
      setTitles((prev) => prev.filter((t) => t.id !== titleId));
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const viewKey = `collection_view_${collection.id}`;
      const lastViewed = localStorage.getItem(viewKey);
      const today = new Date().toISOString().split("T")[0];

      let shouldIncrement = true;
      if (lastViewed === today) {
        shouldIncrement = false;
      }

      const mutation = shouldIncrement
        ? `
        mutation {
          incrementCollectionViews(id: "${collection.id}") {
            id
            views
            score {
              likes
              dislikes
              likedBy { _id }
              dislikedBy { _id }
            }
          }
        }`
        : `
        query {
          collection(id: "${collection.id}") {
            id
            views
            score {
              likes
              dislikes
              likedBy { _id }
              dislikedBy { _id }
            }
          }
        }`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({ query: mutation }),
      });

      const json = await res.json();
      const data = shouldIncrement
        ? json.data.incrementCollectionViews
        : json.data.collection;

      if (shouldIncrement) {
        localStorage.setItem(viewKey, today);
      }

      setViews(data.views);
      setLikes(data.score.likes);
      setDislikes(data.score.dislikes);

      if (!currentUserId) return;

      const liked = data.score.likedBy.some(
        (u: { _id: string }) => u._id === currentUserId
      );
      const disliked = data.score.dislikedBy.some(
        (u: { _id: string }) => u._id === currentUserId
      );

      if (liked) setVote("upvoted");
      else if (disliked) setVote("downvoted");
      else setVote("none");

      const commentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: `
            query CommentsCount($subjectId: ObjectID!) {
              comments(filter: { subjectId: $subjectId }) {
                total
              }
            }`,
            variables: { subjectId: collection.id },
          }),
        }
      );

      const commentsJson = await commentsRes.json();
      setCommentsCount(commentsJson.data?.comments?.total || 0);
    };

    fetchStats();
  }, [collection.id, currentUserId]);

  const handleVote = async (type: VoteState) => {
    if (!currentUserId) return;

    const voteQuery =
      vote === type
        ? "clearCollectionVote"
        : type === "upvoted"
        ? "likeCollection"
        : "dislikeCollection";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
        ${voteQuery}(id: "${collection.id}", userId: "${currentUserId}") {
          id
        }
      }`,
      }),
    });

    if (!res.ok) return;

    if (vote === type) {
      setVote("none");
      type === "upvoted" ? setLikes((p) => p - 1) : setDislikes((p) => p - 1);
    } else {
      setVote(type);
      if (type === "upvoted") {
        setLikes((p) => p + 1);
        if (vote === "downvoted") setDislikes((p) => p - 1);
      } else {
        setDislikes((p) => p + 1);
        if (vote === "upvoted") setLikes((p) => p - 1);
      }
    }
  };

  return (
    <div className={styles.collectionPage}>
      <Wrapper>
        <div className={styles.header}>
          <div className={styles.title}>
            {(canEdit || canDelete) && (
              <div className={styles.actionsWrapper}>
                <button
                  className={styles.dotsBtn}
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <Dots />
                </button>
                {showMenu && (
                  <div id="collection-dropdown" className={styles.dropdown}>
                    {canEdit && (
                      <button onClick={() => setIsEditing(true)}>
                        <Pencil /> {t("collection_edit")}
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => setShowConfirmModal(true)}>
                        <Trash /> {t("collection_delete")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {isEditing ? (
              <Input
                className={clsx(styles.editTextarea, styles.titleInput)}
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder={t("collection_edit_name_placeholder")}
              />
            ) : (
              <h1>{editedName}</h1>
            )}
            <ArrowBtn href="/collection">{t("collections")}</ArrowBtn>
          </div>

          {isEditing ? (
            <textarea
              placeholder={t("collection_edit_desc_placeholder")}
              ref={textareaRef}
              className={styles.editTextarea}
              value={editedDescription}
              onChange={(e) => {
                setEditedDescription(e.target.value);
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
              }}
              rows={1}
            />
          ) : (
            editedDescription && <p>{editedDescription}</p>
          )}

          <div className={styles.meta}>
            <span>
              {t("author")}:{" "}
              <Link href={`/profile/${collection.user._id}`}>
                <span className={styles.highlight}>
                  {collection.user.username}
                </span>
              </Link>
            </span>
            <span>
              |{" "}
              {formatDistanceToNow(new Date(collection.createdAt), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </span>
          </div>

          {isEditing && (
            <div className={styles.editButtons}>
              <Button onClick={handleSave}>{t("collection_save")}</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (isCreating) {
                    router.back();
                  } else {
                    setIsEditing(false);
                    setEditedName(collection.name);
                    setEditedDescription(collection.description || "");
                  }
                }}
              >
                {t("collection_cancel")}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.titlesGrid}>
          {!isCreating && canEdit && (
            <div
              className={styles.addCard}
              onClick={() => setShowSearch(true)}
              title={t("collection_add_title")}
            >
              <PlusCircle />
            </div>
          )}
          {titles.map((title) => (
            <div key={title.id} className={styles.bookCardWrapper}>
              {canEdit && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveTitle(title.id)}
                  title={t("collection_remove_title")}
                >
                  <Cross />
                </button>
              )}
              <BookCard
                alt_names={title.alt_names}
                title={title.name}
                href={`/catalog/${title.id}`}
                coverId={title.id}
                size="large"
              />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <div className={styles.tags}>
            <Tag type="views" value={views} />
            <Tag type="likes" value={ratingString} />
            <Tag type="comments" value={commentsCount} />
          </div>
          <div className={styles.rate}>
            {currentUserId && (
              <button
                className={clsx(
                  styles.voteBtn,
                  styles.up,
                  vote === "upvoted" && styles.active
                )}
                onClick={() => handleVote("upvoted")}
              >
                <ChevronUp />
              </button>
            )}
            <span
              className={clsx(
                styles.rating,
                rating > 0 && styles.positive,
                rating < 0 && styles.negative
              )}
            >
              {rating}
            </span>
            {currentUserId && (
              <button
                className={clsx(
                  styles.voteBtn,
                  styles.down,
                  vote === "downvoted" && styles.active
                )}
                onClick={() => handleVote("downvoted")}
              >
                <ChevronDown />
              </button>
            )}
          </div>
        </div>
      </Wrapper>

      <Wrapper className={styles.commentSection}>
        <CommentsSection subjectType="COLLECTION" subjectId={collection.id} />
      </Wrapper>

      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>{t("collection_confirm_delete")}</p>
            <div className={styles.modalActions}>
              <Button onClick={handleDelete}>
                {t("collection_confirm_delete_yes")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                {t("collection_confirm_delete_no")}
              </Button>
            </div>
          </div>
        </div>
      )}
      <SearchOverlayForCollection
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectTitle={(titleId) => handleAddTitle(titleId)}
      />
    </div>
  );
}
