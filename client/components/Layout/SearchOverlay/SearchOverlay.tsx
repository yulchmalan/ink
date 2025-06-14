"use client";

import styles from "./search-overlay.module.scss";
import Input from "@/components/Form/Input/Input";
import Tabs from "@/components/Layout/Tabs/Tabs";
import { useEffect, useState } from "react";
import SearchResultCard from "./SearchResultCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "titles" | "users" | "collections" | "reviews"
  >("titles");
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
        const queryText =
          activeTab === "titles"
            ? `query SearchTitles($filter: TitleFilterInput) {
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
            }`
            : activeTab === "users"
            ? `query SearchUsers($search: String!) {
              users(search: $search, limit: 10) {
                _id
                username
              }
            }`
            : activeTab === "collections"
            ? `query SearchCollections($search: String!) {
              collections(search: $search, limit: 10) {
                results {
                  id
                  name
                  description
                }
              }
            }`
            : `query SearchReviews($search: String!) {
              reviews(search: $search, limit: 10) {
                results {
                  id
                  name
                  title {
                    id
                    name
                  }
                  user {
                    username
                  }
                  body
                }
              }
            }`;

        const variables =
          activeTab === "titles"
            ? { filter: { name: query }, limit: 10, offset: 0 }
            : { search: query, limit: 10 };

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
        const newResults =
          activeTab === "titles"
            ? json.data?.titles?.results
            : activeTab === "users"
            ? json.data?.users
            : activeTab === "collections"
            ? json.data?.collections?.results
            : json.data?.reviews?.results;

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
  }, [query, activeTab]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const tabs = [
    {
      title: "Тайтли",
      content: (
        <div className={styles.tabContent}>
          {loading && <p>Завантаження...</p>}
          {!loading && results.length === 0 && query && (
            <p>Нічого не знайдено</p>
          )}
          <ul>
            {results.map((item: any) => (
              <li key={item.id}>
                <SearchResultCard
                  id={item.id}
                  name={item.name}
                  alt_names={item.alt_names}
                  type="title"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Користувачі",
      content: (
        <div className={styles.tabContent}>
          {loading && <p>Завантаження...</p>}
          {!loading && results.length === 0 && query && (
            <p>Нічого не знайдено</p>
          )}
          <ul>
            {results.map((item: any) => (
              <li key={item._id}>
                <SearchResultCard
                  id={item._id}
                  username={item.username}
                  type="user"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Колекції",
      content: (
        <div className={styles.tabContent}>
          {loading && <p>Завантаження...</p>}
          {!loading && results.length === 0 && query && (
            <p>Нічого не знайдено</p>
          )}
          <ul>
            {results.map((item: any) => (
              <li key={item.id}>
                <SearchResultCard
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  type="collection"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Рецензії",
      content: (
        <div className={styles.tabContent}>
          {loading && <p>Завантаження...</p>}
          {!loading && results.length === 0 && query && (
            <p>Нічого не знайдено</p>
          )}
          <ul>
            {results.map((item: any) => (
              <li key={item.id}>
                <SearchResultCard
                  titleId={item.title?.id}
                  id={item.id}
                  body={item.body}
                  username={item.user?.username}
                  name={item.name}
                  type="review"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.window} onClick={(e) => e.stopPropagation()}>
        <Input
          placeholder="Пошук..."
          value={query}
          onChange={handleInputChange}
        />
        <Tabs
          tabs={tabs}
          activeIndex={["titles", "users", "collections", "reviews"].indexOf(
            activeTab
          )}
          onTabChange={(index: number) =>
            setActiveTab(
              ["titles", "users", "collections", "reviews"][index] as any
            )
          }
        />
      </div>
    </div>
  );
}
