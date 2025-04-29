"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./more-btn.module.scss";
import clsx from "clsx";
import ArrowRight from "@/assets/icons/ArrowRight";
import Link from "next/link";
import { useTranslations } from "use-intl";

interface SwiperMoreButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  className?: string;
}

export default function SwiperMoreButton({
  href,
  className,
}: SwiperMoreButtonProps) {
  const t = useTranslations("UI");

  return (
    <Link href={href} className={`${styles.button} ${className ?? ""}`}>
      <span>{t("showMore")}</span>
      <div className={styles.icon}>
        <ArrowRight />
      </div>
    </Link>
  );
}
