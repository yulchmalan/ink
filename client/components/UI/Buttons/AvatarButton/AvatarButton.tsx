"use client";

import styles from "./avatar-button.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";
import DefaultAvatar from "@/assets/pfp.svg";
import { useTranslations } from "use-intl";
import { useS3Image } from "@/hooks/useS3Image";

interface AvatarButtonProps extends HTMLAttributes<HTMLButtonElement> {
  imgSrc?: string;
}

export default function AvatarButton({
  imgSrc,
  className,
  ...props
}: AvatarButtonProps) {
  const t = useTranslations("UI");
  const resolvedImg = useS3Image("avatars", imgSrc || "", DefaultAvatar.src);

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
