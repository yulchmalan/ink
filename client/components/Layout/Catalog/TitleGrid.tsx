"use client";

import Input from "@/components/Form/Input/Input";
import Wrapper from "../Wrapper/Wrapper";
import CatalogGrid from "./CatalogGrid";
import TitleCard from "./TitleCard";
import styles from "./catalog.module.scss";
import { generateCatalogMenu } from "@/data/sideMenus/catalogMenu";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import { useEffect, useState } from "react";
import { GET_TITLES } from "@/graphql/queries/getTitles";
import { useLabels } from "@/hooks/useLabels";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  titles: {
    id: string;
    name: string;
    alt_names?: { lang: string; value: string }[];
  }[];
}

export default function TitleGrid({ titles: initialTitles }: Props) {
  const auth = typeof window !== "undefined" ? useAuth() : null;
  const currentUser = auth?.user;
  const menuSections = generateCatalogMenu();
  const [activeSubmenu, setActiveSubmenu] = useState<"genres" | "tags" | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [titles, setTitles] = useState(initialTitles);

  const genres = useLabels("GENRE");
  const tags = useLabels("TAG");

  const [filters, setFilters] = useState({
    genres: [] as string[],
    tags: [] as string[],
    type: [] as string[],
    status: [] as string[],
    translation: [] as string[],
    list: [] as string[],
    ratingFrom: undefined as number | undefined,
    ratingTo: undefined as number | undefined,
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!currentUser) return;
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    applyFilters();
  }, [debouncedSearch]);

  const applyFilters = async () => {
    if (!currentUser) return;

    const rating: any = {};
    if (filters.ratingFrom !== undefined) rating.gte = filters.ratingFrom * 2;
    if (filters.ratingTo !== undefined) rating.lte = filters.ratingTo * 2;

    const filter: any = {
      ...(debouncedSearch && { name: debouncedSearch }),
      ...(filters.genres.length && { genreIds: filters.genres }),
      ...(filters.tags.length && { tagIds: filters.tags }),
      ...(filters.type.length === 1 && { type: filters.type[0] }),
      ...(filters.status.length === 1 && { status: filters.status[0] }),
      ...(filters.translation.length === 1 && {
        translation: filters.translation[0],
      }),
      ...(filters.list.length && { list: filters.list }),
      ...(Object.keys(rating).length && { rating }),
    };

    const variables: any = {
      filter,
      sort: {
        field: sortBy.toUpperCase(),
        direction: sortOrder.toUpperCase(),
      },
      offset: 0,
    };

    if (filters.list.length && currentUser?._id) {
      variables.userId = currentUser._id;
      filter.list = filters.list;
    }

    console.log("[applyFilters] filter:", filter); // DEBUG
    console.log("[applyFilters] sort:", variables.sort); // DEBUG

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: GET_TITLES,
        variables,
      }),
      cache: "no-store",
    });

    const json = await res.json();
    const results = json.data?.titles?.results;

    console.log("[applyFilters] results count:", results?.length); // DEBUG

    if (Array.isArray(results)) setTitles(results);
  };
  const handleSelect = (value: string) => {
    if (value === "genres" || value === "tags") {
      setActiveSubmenu(value);
      return;
    }

    if (["NAME", "RATING", "CREATED_AT"].includes(value)) {
      setSortBy(value.toLowerCase());
      return;
    }

    if (["asc", "desc"].includes(value)) {
      setSortOrder(value as "asc" | "desc");
      return;
    }

    const updateCheckboxGroup = (field: keyof typeof filters) => {
      setFilters((prev) => {
        const list = prev[field] as string[];
        const newList = list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value];
        const updated = { ...prev, [field]: newList };
        console.log(`[filters] ${field}:`, updated[field]); // DEBUG
        return updated;
      });
    };

    if (genres.some((g) => g.value === value)) updateCheckboxGroup("genres");
    else if (tags.some((t) => t.value === value)) updateCheckboxGroup("tags");
    else if (["COMIC", "NOVEL"].includes(value)) updateCheckboxGroup("type");
    else if (["COMPLETED", "ONGOING", "ANNOUNCED"].includes(value))
      updateCheckboxGroup("status");
    else if (["TRANSLATED", "NOT_TRANSLATED", "IN_PROGRESS"].includes(value))
      updateCheckboxGroup("translation");
    else if (
      ["reading", "planned", "completed", "dropped", "favorite"].includes(value)
    )
      updateCheckboxGroup("list");
    else if (value.startsWith("rating-from:")) {
      const val = +value.split(":")[1];
      console.log("[filters] ratingFrom:", val); // DEBUG
      setFilters((prev) => ({ ...prev, ratingFrom: val }));
    } else if (value.startsWith("rating-to:")) {
      const val = +value.split(":")[1];
      console.log("[filters] ratingTo:", val); // DEBUG
      setFilters((prev) => ({ ...prev, ratingTo: val }));
    }
  };

  const handleBack = () => setActiveSubmenu(null);

  const resetFilters = () => {
    setFilters({
      genres: [],
      tags: [],
      type: [],
      status: [],
      translation: [],
      list: [],
      ratingFrom: undefined,
      ratingTo: undefined,
    });
    setSortBy("name");
    setSortOrder("asc");
    setSearch("");
    setDebouncedSearch("");
    setTitles(initialTitles);
  };

  return (
    <CatalogGrid
      sidebar={
        <Wrapper>
          <div className={styles.sideContent}>
            {!activeSubmenu ? (
              <>
                {menuSections.map((section, idx) => {
                  const selected =
                    section.type === "radio" &&
                    section.items.some((i) => i.value === sortBy.toUpperCase())
                      ? sortBy.toUpperCase()
                      : undefined;

                  const selectedSecondary =
                    section.secondary?.type === "radio" &&
                    section.secondary.items.some((i) => i.value === sortOrder)
                      ? sortOrder
                      : undefined;

                  const checkedValues = section.items
                    .filter((i) => {
                      if (genres.some((g) => g.value === i.value))
                        return filters.genres.includes(i.value);
                      if (tags.some((t) => t.value === i.value))
                        return filters.tags.includes(i.value);
                      if (["COMIC", "NOVEL"].includes(i.value))
                        return filters.type.includes(i.value);
                      if (
                        ["COMPLETED", "ONGOING", "ANNOUNCED"].includes(i.value)
                      )
                        return filters.status.includes(i.value);
                      if (
                        [
                          "TRANSLATED",
                          "NOT_TRANSLATED",
                          "IN_PROGRESS",
                        ].includes(i.value)
                      )
                        return filters.translation.includes(i.value);
                      if (
                        [
                          "reading",
                          "planned",
                          "completed",
                          "dropped",
                          "favorite",
                        ].includes(i.value)
                      )
                        return filters.list.includes(i.value);
                      return false;
                    })
                    .map((i) => i.value);

                  const rangeFrom =
                    section.type === "range" && filters.ratingFrom !== undefined
                      ? filters.ratingFrom.toString()
                      : "";
                  const rangeTo =
                    section.type === "range" && filters.ratingTo !== undefined
                      ? filters.ratingTo.toString()
                      : "";

                  return (
                    <SideMenu
                      key={idx}
                      data={section}
                      selected={selected}
                      selectedSecondary={selectedSecondary}
                      checkedValues={checkedValues}
                      rangeFrom={rangeFrom}
                      rangeTo={rangeTo}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <button className={styles.backBtn} onClick={handleBack}>
                  Назад
                </button>
                <SideMenu
                  data={{
                    title: activeSubmenu === "genres" ? "Жанри" : "Теги",
                    type: "checkbox",
                    items: activeSubmenu === "genres" ? genres : tags,
                  }}
                  checkedValues={
                    activeSubmenu === "genres" ? filters.genres : filters.tags
                  }
                  onSelect={handleSelect}
                />
              </>
            )}
          </div>
          <div className={styles.controls}>
            <Button
              variant="secondary"
              className={styles.btn}
              onClick={resetFilters}
            >
              Скинути
            </Button>
            <Button className={styles.btn} onClick={applyFilters}>
              Застосувати
            </Button>
          </div>
        </Wrapper>
      }
    >
      <h1>Каталог</h1>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Пошук"
      />
      <div className={styles.titlesGrid}>
        {titles?.map((title) => (
          <TitleCard
            key={title.id}
            id={title.id}
            name={title.name}
            alt_names={title.alt_names}
          />
        ))}
      </div>
    </CatalogGrid>
  );
}
