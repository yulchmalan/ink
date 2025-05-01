import clsx from "clsx";
import styles from "./tag.module.scss";

// Імпортуй потрібні іконки
import Eye from "@/assets/icons/Eye";
import Stack from "@/assets/icons/Stack";
import Bookmark from "@/assets/icons/Bookmark";
import Heart from "@/assets/icons/Heart";

interface TagProps {
  value: string | number;
  type?: "views" | "layers" | "bookmarks" | "likes";
  className?: string;
}

const iconMap = {
  views: <Eye />,
  layers: <Stack />,
  bookmarks: <Bookmark />,
  likes: <Heart />,
};

export default function Tag({ value, type, className }: TagProps) {
  const formatCount = (num: number) => {
    return num >= 1000
      ? (num / 1000).toFixed(1).replace(/\.0$/, "") + "К"
      : num.toString();
  };

  const displayValue = typeof value === "number" ? formatCount(value) : value;

  return (
    <div className={clsx(styles.tag, className)}>
      {type && iconMap[type]}
      <span>{displayValue}</span>
    </div>
  );
}
