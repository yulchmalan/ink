"use client";

import styles from "./search-overlay.module.scss";
import Link from "next/link";
import fallbackCover from "@/assets/cover.png";
import fallbackPfp from "@/assets/pfp.svg";
import { useS3Image } from "@/hooks/useS3Image";
import clsx from "clsx";
import { useLocalizedName } from "@/hooks/useLocalizedName";

interface TitleCardProps {
  id: string;
  name: string;
  alt_names?: { lang: string; value: string }[];
  type: "title";
  onClick?: () => void;
}

interface UserCardProps {
  id: string;
  username: string;
  type: "user";
  onClick?: () => void;
}

interface CollectionCardProps {
  id: string;
  name: string;
  description?: string;
  type: "collection";
  onClick?: () => void;
}

interface ReviewCardProps {
  id: string;
  name: string;
  titleId: string;
  body?: string;
  username?: string;
  type: "review";
  onClick?: () => void;
}

type Props =
  | TitleCardProps
  | UserCardProps
  | CollectionCardProps
  | ReviewCardProps;

export default function SearchResultCard(props: Props) {
  const isTitle = props.type === "title";
  const isUser = props.type === "user";
  const isReview = props.type === "review";
  const isCollection = props.type === "collection";

  let href = "#";
  let displayName = "";
  let imgSrc = "";
  let subtitle = "";

  switch (props.type) {
    case "title":
      href = `/catalog/${props.id}`;
      displayName = useLocalizedName(props.name, props.alt_names);
      imgSrc = useS3Image("covers", props.id, fallbackCover.src);
      break;

    case "user":
      href = `/profile/${props.id}`;
      displayName = props.username;
      imgSrc = useS3Image("avatars", props.id, fallbackPfp.src);
      break;

    case "collection":
      href = `/collection/${props.id}`;
      displayName = props.name;
      subtitle = props.description || "";
      imgSrc = fallbackCover.src;
      break;

    case "review":
      href = `/review/${props.id}`;
      displayName = props.name;
      subtitle = props.body || "";
      imgSrc = useS3Image("covers", props.titleId, fallbackCover.src);
      break;
  }

  return (
    <Link href={href} className={styles.card} onClick={props.onClick}>
      {!isCollection && (
        <div
          className={clsx(
            styles.imgWrapper,
            isTitle || isReview
              ? styles.title
              : isUser
              ? styles.pfp
              : styles.generic
          )}
        >
          <img src={imgSrc} alt={displayName} />
        </div>
      )}
      <div className={styles.text}>
        <p className={styles.name}>{displayName}</p>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {isReview && props.username && (
          <p className={styles.meta}>Автор: {props.username}</p>
        )}
      </div>
    </Link>
  );
}
