import clsx from "clsx";
import styles from "./container.module.scss";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <div className={clsx(styles.container, className)}>{children}</div>;
}
