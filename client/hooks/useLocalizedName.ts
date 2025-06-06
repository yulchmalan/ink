"use client";

import { useLocale } from "next-intl";

export function useLocalizedName(
  name: string,
  altNames?: { lang: string; value: string }[]
) {
  const locale = useLocale();

  const safeAltNames = Array.isArray(altNames) ? altNames : [];

  return (
    safeAltNames.find((n) => n.lang === locale)?.value ||
    name
  );
}
