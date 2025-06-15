"use client";

import styles from "./search-overlay.module.scss";
import Input from "@/components/Form/Input/Input";
import { useEffect, useState } from "react";
import SearchResultCard from "@/components/Layout/SearchOverlay/SearchResultCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTitle: (titleId: string) => void;
}

export default function SearchOverlayForCollection({
  isOpen,
  onClose,
  onSelectTitle,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryText = `
          query SearchTitles($filter: TitleFilterInput) {
            titles(filter: $filter, limit: 10, offset: 0) {
              results {
                id
                name
                alt_names {
                  lang
                  value
                }
              }
            }
          }
        `;

        const variables = {
          filter: { name: query },
          limit: 10,
          offset: 0,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({ query: queryText, variables }),
          signal: controller.signal,
        });

        const json = await res.json();
        const newResults = json.data?.titles?.results;
        setResults(Array.isArray(newResults) ? newResults : []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Search error:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.window} onClick={(e) => e.stopPropagation()}>
        <Input
          placeholder="Пошук тайтлу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.tabContent}>
          {loading && <p>Завантаження...</p>}
          {!loading && results.length === 0 && query && (
            <p>Нічого не знайдено</p>
          )}
          <ul>
            {results.map((item: any) => (
              <li key={item.id}>
                <SearchResultCard
                  asLink={false}
                  id={item.id}
                  alt_names={item.alt_names}
                  name={item.name}
                  type="title"
                  onClick={() => onSelectTitle(item.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
