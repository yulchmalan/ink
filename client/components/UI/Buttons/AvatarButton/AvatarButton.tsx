"use client";

import styles from "./avatar-button.module.scss";
import { useEffect, useState, HTMLAttributes } from "react";
import clsx from "clsx";
import DefaultAvatar from "@/assets/pfp.svg";
import { useTranslations } from "use-intl";

interface AvatarButtonProps extends HTMLAttributes<HTMLButtonElement> {
  imgSrc?: string;
}

export default function AvatarButton({
  imgSrc,
  className,
  ...props
}: AvatarButtonProps) {
  const t = useTranslations("UI");
  const [resolvedImg, setResolvedImg] = useState<string>(DefaultAvatar.src);

  useEffect(() => {
    if (!imgSrc) return;

    const img = new Image();
    img.src = imgSrc + `?cb=${Date.now()}`;
    img.onload = () => setResolvedImg(imgSrc);
    img.onerror = () => setResolvedImg(DefaultAvatar.src);
  }, [imgSrc]);

  return (
    <button
      type="button"
      className={clsx(styles.avatarButton, className)}
      {...props}
    >
      <img src={resolvedImg} alt={t("avatar")} className={styles.avatarImage} />
    </button>
  );
}
