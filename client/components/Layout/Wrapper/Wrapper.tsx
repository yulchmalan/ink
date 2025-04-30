import clsx from "clsx";
import styles from "./wrapper.module.scss";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function Wrapper({ children, className }: WrapperProps) {
  return <div className={clsx(styles.wrapper, className)}>{children}</div>;
}
