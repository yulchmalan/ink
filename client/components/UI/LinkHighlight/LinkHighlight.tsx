import Link from "next/link";
import styles from "./link-highlight.module.scss";

export default function LinkHighlight({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  );
}
