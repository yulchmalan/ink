"use client";

import styles from "./search-overlay.module.scss";
import Link from "next/link";
import fallbackCover from "@/assets/cover.png";
import fallbackPfp from "@/assets/pfp.svg";
import { useS3Image } from "@/hooks/useS3Image";
import clsx from "clsx";

interface TitleCardProps {
  id: string;
  name: string;
  type: "title";
  onClick?: () => void;
}

interface UserCardProps {
  id: string;
  username: string;
  type: "user";
  onClick?: () => void;
}

type Props = TitleCardProps | UserCardProps;

export default function SearchResultCard(props: Props) {
  const isTitle = props.type === "title";
  const href = isTitle ? `/catalog/${props.id}` : `/profile/${props.id}`;
  const imgSrc = isTitle
    ? useS3Image("covers", props.id, fallbackCover.src)
    : useS3Image("avatars", props.id, fallbackPfp.src);

  return (
    <Link href={href} className={styles.card} onClick={props.onClick}>
      <div
        className={clsx(styles.imgWrapper, isTitle ? styles.title : styles.pfp)}
      >
        <img src={imgSrc} alt={isTitle ? props.name : props.username} />
      </div>
      <p>{isTitle ? props.name : props.username}</p>
    </Link>
  );
}
