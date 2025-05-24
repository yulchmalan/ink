"use client";

import { ReactElement, useState } from "react";
import styles from "./dropdown.module.scss";
import clsx from "clsx";
import ChevronDown from "@/assets/icons/ChevronDown";
import Trash from "@/assets/icons/Trash";

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  selectedId?: string;
  onSelect: (id: string | null) => void;
  placeholder?: ReactElement;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  listClassName?: string;
}

export default function Dropdown({
  options,
  selectedId,
  onSelect,
  placeholder = <span>Оберіть опцію</span>,
  disabled,
  className,
  buttonClassName,
  listClassName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.id === selectedId)?.label;

  const handleSelect = (id: string | null) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className={clsx(styles.dropdownWrapper, className)}>
      <button
        className={clsx(
          styles.dropdownButton,
          buttonClassName,
          isOpen && styles.opened
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        {selectedLabel || placeholder}
        <div className={styles.arrow}>
          <ChevronDown />
        </div>
      </button>

      {isOpen && (
        <ul className={clsx(styles.dropdownMenu, listClassName)}>
          {options.map((opt) => (
            <li key={opt.id} onClick={() => handleSelect(opt.id)}>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
