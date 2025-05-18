"use client";

import styles from "./side-menu.module.scss";
import clsx from "clsx";
import { useState } from "react";

type Item = {
  label: string;
  value: string;
  icon?: string | React.ReactNode;
  badge?: number;
};

export type Section = {
  title?: string;
  type: "list" | "radio" | "icon";
  items: {
    label: string;
    value: string;
    badge?: number;
    icon?: string | React.ReactNode;
  }[];
  secondary?: {
    type: "radio";
    items: {
      label: string;
      value: string;
    }[];
  };
};

interface Props {
  data: Section;
  selected?: string;
  onSelect?: (value: string) => void;
}

export default function SideMenu({ data, selected, onSelect }: Props) {
  const [selectedValue, setSelectedValue] = useState<string | null>(
    selected ?? null
  );
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(
    null
  );

  const handleClick = (value: string, isSecondary = false) => {
    if (isSecondary) {
      if (selectedSecondary === value) {
        setSelectedSecondary(null);
        onSelect?.("");
      } else {
        setSelectedSecondary(value);
        onSelect?.(value);
      }
    } else {
      if (selectedValue === value) {
        setSelectedValue(null);
        onSelect?.("");
      } else {
        setSelectedValue(value);
        onSelect?.(value);
      }
    }
  };

  const renderItem = (item: Item, isSecondary = false) => {
    const isIcon = data.type === "icon";
    const isRadio = data.type === "radio" && !isIcon;
    const isActive = isSecondary
      ? selectedSecondary === item.value
      : selectedValue === item.value;

    return (
      <li
        key={item.value}
        className={clsx(styles.item, {
          [styles.active]: isActive,
          [styles.radio]: isRadio,
          [styles.icon]: isIcon,
        })}
        onClick={() => handleClick(item.value, isSecondary)}
      >
        {item.icon && <span className={styles.iconSymbol}>{item.icon}</span>}
        {item.label}
        {item.badge !== undefined && (
          <span className={styles.badge}>{item.badge}</span>
        )}
      </li>
    );
  };

  return (
    <div className={styles.wrapper}>
      {data.title && <p className={styles.title}>{data.title}</p>}
      <ul className={styles.list}>
        {data.items.map((item) => renderItem(item, false))}
      </ul>

      {data.secondary && (
        <>
          <div className={styles.divider} />
          <ul className={styles.list}>
            {data.secondary.items.map((item) => renderItem(item, true))}
          </ul>
        </>
      )}
    </div>
  );
}
