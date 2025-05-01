import React from "react";
import styles from "./heading.module.scss";
import clsx from "clsx";

type SectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Heading({ children, className }: SectionTitleProps) {
  return <h2 className={clsx(styles.heading, className)}>{children}</h2>;
}
