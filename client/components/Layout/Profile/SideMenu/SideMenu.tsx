"use client";

import Input from "@/components/Form/Input/Input";
import styles from "./side-menu.module.scss";
import clsx from "clsx";
import ChevronRight from "@/assets/icons/ChevronRight";
import Checkbox from "@/assets/icons/Checkbox";
import { useTranslations } from "next-intl";

type Item = {
  label: string;
  value: string;
  icon?: string | React.ReactNode;
  badge?: number;
  checked?: boolean;
  from?: number;
  to?: number;
  expandableTarget?: string;
};

export type Section = {
  title?: string;
  type: "list" | "radio" | "icon" | "checkbox" | "range" | "expandable";
  items: Item[];
  secondary?: {
    type: "radio" | "checkbox";
    items: Item[];
  };
};

interface Props {
  data: Section;
  selected?: string;
  selectedSecondary?: string;
  checkedValues?: string[];
  rangeFrom?: string;
  rangeTo?: string;
  onSelect?: (value: string) => void;
}

export default function SideMenu({
  data,
  selected,
  selectedSecondary,
  checkedValues = [],
  rangeFrom = "",
  rangeTo = "",
  onSelect,
}: Props) {
  const handleClick = (value: string, isSecondary = false) => {
    onSelect?.(value);
  };
  const t = useTranslations("Catalog");

  const renderItem = (item: Item, isSecondary = false) => {
    const isIcon = data.type === "icon";
    const isRadio = data.type === "radio";
    const isCheckbox = data.type === "checkbox";
    const isExpandable = data.type === "expandable";
    const isActive = isSecondary
      ? selectedSecondary === item.value
      : selected === item.value;

    if (isCheckbox) {
      const isChecked = checkedValues.includes(item.value);
      return (
        <li
          key={item.value}
          className={clsx(styles.item, styles.checkbox, {
            [styles.active]: isChecked,
          })}
        >
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onSelect?.(item.value)}
            />
            <Checkbox />
            {item.label}
          </label>
        </li>
      );
    }

    if (isExpandable) {
      return (
        <li
          key={item.value}
          className={clsx(styles.item, styles.expandable)}
          onClick={() => onSelect?.(item.expandableTarget!)}
        >
          {item.label}
          <span className={styles.chevron}>
            <ChevronRight />
          </span>
        </li>
      );
    }

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

      {data.type === "range" && (
        <div className={styles.rangeWrapper}>
          <Input
            type="number"
            placeholder={t("from")}
            value={rangeFrom}
            onChange={(e) => onSelect?.(`rating-from:${e.target.value}`)}
          />
          <span>-</span>
          <Input
            type="number"
            placeholder={t("to")}
            value={rangeTo}
            onChange={(e) => onSelect?.(`rating-to:${e.target.value}`)}
          />
        </div>
      )}

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
