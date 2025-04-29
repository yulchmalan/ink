import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./simple-icon.module.scss";
import clsx from "clsx";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export default function SimpleIconBtn({
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button className={clsx(styles.iconButton, className)} {...props}>
      {icon}
    </button>
  );
}
