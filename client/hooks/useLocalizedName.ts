"use client";

import { useLocale } from "next-intl";

export function useLocalizedName(name: string,
    altNames: { lang: string; value: string }[] = []) {
    const locale = useLocale();
    return (
      altNames.find((n) => n.lang === locale)?.value ||
      altNames.find((n) => n.lang === "uk")?.value ||
      altNames.find((n) => n.lang === "en")?.value ||
      name
    );
}
