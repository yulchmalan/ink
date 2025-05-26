"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import styles from "./language-switcher.module.scss";
import { useTranslations } from "use-intl";
import Translate from "@/assets/icons/Translate";
import clsx from "clsx";

const options = [
  { value: "en", labelKey: "english" },
  { value: "uk", labelKey: "ukrainian" },
  { value: "pl", labelKey: "polish" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const rawLocale = useLocale();
  const locale = rawLocale.split("-")[0]; // ← на всяк випадок
  const t = useTranslations("UI");

  const ref = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: string) => {
    setIsOpen(false);
    if (value !== locale) {
      startTransition(() => {
        router.replace(`/${value}`);
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={clsx(styles.trigger, styles.btn)}
        onClick={toggleOpen}
        disabled={isPending}
      >
        <Translate />
        {t(options.find((opt) => opt.value === locale)?.labelKey || "")}
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {options.map((opt) => {
            const isActive = opt.value === locale;
            return (
              <li
                key={opt.value}
                className={clsx(
                  styles.option,
                  isActive && styles.active,
                  "default"
                )}
                onClick={() => handleSelect(opt.value)}
              >
                {t(opt.labelKey)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
