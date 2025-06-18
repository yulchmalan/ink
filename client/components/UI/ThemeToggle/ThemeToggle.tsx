"use client";

import Moon from "@/assets/icons/Moon";
import styles from "./theme-toggle.module.scss";
import Sun from "@/assets/icons/Sun";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const t = useTranslations("Nav");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button onClick={toggleTheme} className={styles.btn}>
      {isDark ? (
        <>
          <Moon /> {t("dark")}
        </>
      ) : (
        <>
          <Sun /> {t("light")}
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
