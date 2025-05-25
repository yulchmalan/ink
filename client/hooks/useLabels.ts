"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const LABELS_BY_TYPE_QUERY = `
  query LabelsByType($type: LabelType!, $locale: String) {
    labelsByType(type: $type, locale: $locale) {
      id
      name {
        en
        uk
        pl
      }
    }
  }
`;

export function useLabels(type: "GENRE" | "TAG") {
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const locale = useLocale();

  useEffect(() => {
    const fetchLabels = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: LABELS_BY_TYPE_QUERY,
          variables: { type, locale },
        }),
      });

      const json = await res.json();
      const data = json.data?.labelsByType;

      if (Array.isArray(data)) {
        const mapped = data.map((label: any) => ({
          value: label.id,
          label: label.name[locale] || label.name.en,
        }));
        setItems(mapped);
      }
    };

    fetchLabels();
  }, [type, locale]);

  return items;
}
