"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./arrow-btn.module.scss";
import clsx from "clsx";
import ArrowRight from "@/assets/icons/ArrowRight";
import ArrowRightBold from "@/assets/icons/ArrowRightBold";
import Link from "next/link";

interface ArrowBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  className?: string;
  children: ReactNode;
  size?: "small" | "large";
}

export default function ArrowBtn({
  href,
  className,
  children,
  size = "small",
}: ArrowBtnProps) {
  return (
    <Link href={href} className={clsx(styles.button, styles[size], className)}>
      <span>{children}</span>
      <div className={styles.icon}>
        {size === "large" ? <ArrowRightBold /> : <ArrowRight />}
      </div>
    </Link>
  );
}
