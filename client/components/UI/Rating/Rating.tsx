"use client";

import { useState } from "react";
import StarFull from "../../../assets/icons/StarFull";
import StarHalf from "../../../assets/icons/StarHalf";
import StarEmpty from "../../../assets/icons/StarEmpty";
import styles from "./rating.module.scss";
import clsx from "clsx";

type RatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
};

export default function Rating({ value, onChange, size = 20 }: RatingProps) {
  const [internalValue, setInternalValue] = useState(0);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const isControlled = value !== undefined;
  const activeValue = hoverValue ?? (isControlled ? value! : internalValue);

  const handleClick = (index: number, isHalf: boolean) => {
    const newValue = isHalf ? index + 0.5 : index + 1;
    if (isControlled) return;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={styles.rating} onMouseLeave={() => setHoverValue(null)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const diff = activeValue - i;
        const isFull = diff >= 1;
        const isHalf = diff >= 0.5 && diff < 1;
        const Star = isFull ? StarFull : isHalf ? StarHalf : StarEmpty;

        return (
          <span
            key={i}
            className={clsx(
              isControlled ? styles.cursorDefault : styles.cursorPointer,
              styles.ratingStar
            )}
            onClick={(e) => {
              if (isControlled) return;
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isHalf = x < rect.width / 2;
              handleClick(i, isHalf);
            }}
            onMouseMove={(e) => {
              if (isControlled) return;
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isHalf = x < rect.width / 2;
              setHoverValue(isHalf ? i + 0.5 : i + 1);
            }}
          >
            <Star
              width={size}
              height={size}
              // className={`transition-colors ${
              //   activeValue >= i + 1 ? "text-yellow-500" : "text-gray-400"
              // }`}
            />
          </span>
        );
      })}
    </div>
  );
}
