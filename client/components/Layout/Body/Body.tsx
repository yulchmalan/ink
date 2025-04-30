import React from "react";
import clsx from "clsx";
import styles from "./body.module.scss";

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

const Body = ({ children, className }: BodyProps) => {
  return <main className={clsx(styles.body, className)}>{children}</main>;
};

export default Body;
