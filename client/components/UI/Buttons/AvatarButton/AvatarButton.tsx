"use client";

import Link from "next/link";
import styles from "./avatar-button.module.scss";
import { HTMLAttributes } from "react";
import clsx from "clsx";
import DefaultAvatar from "@/assets/pfp.svg";
import { useTranslations } from "use-intl";

interface AvatarButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  imgSrc?: string;
}

export default function AvatarButton({
  href,
  imgSrc,
  className,
  ...props
}: AvatarButtonProps) {
  const t = useTranslations("UI");
  const imageToShow = imgSrc || DefaultAvatar.src;

  return (
    <Link
      href={href}
      className={clsx(styles.avatarButton, className)}
      {...props}
    >
      <img src={imageToShow} alt={t("avatar")} className={styles.avatarImage} />
    </Link>
  );
}
