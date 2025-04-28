"use client";

import styles from "./standart-btn.module.scss";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: Variant;
}

export default function Button({
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant])} {...props}>
      {children}
    </button>
  );
}
