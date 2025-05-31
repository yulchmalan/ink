"use client";

import styles from "./title.module.scss";
import fallbackCover from "@/assets/cover.png";
import { useS3Image } from "@/hooks/useS3Image";
import { useLocalizedName } from "@/hooks/useLocalizedName";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";

interface AltName {
  lang: string;
  value: string;
}

interface Props {
  id: string;
  name: string;
  alt_names?: AltName[];
}

export default function TitleCard({ id, name, alt_names = [] }: Props) {
  const [loaded, setLoaded] = useState(false);
  const cover = useS3Image("covers", id, fallbackCover.src);
  const localizedName = useLocalizedName(name, alt_names);
  const isLoading = !cover;

  return (
    <Link href={`/catalog/${id}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        {isLoading && <div className={styles.skeleton} />}
        <img
          src={cover}
          className={clsx(styles.cover, { [styles.loaded]: loaded })}
          onLoad={() => setLoaded(true)}
          alt={localizedName}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{localizedName}</h3>
      </div>
    </Link>
  );
}
