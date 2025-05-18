"use client";

import Link from "next/link";
import styles from "./logo.module.scss";
import { useEffect, useState } from "react";
import LogoLight from "./LogoLight";
import LogoDark from "./LogoDark";
import clsx from "clsx";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDarkMode(dark);

    const observer = new MutationObserver(() => {
      const updatedDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(updatedDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Link href="/" className={clsx(styles.logo, className)}>
      {isDarkMode ? <LogoLight /> : <LogoDark />}
    </Link>
  );
}
