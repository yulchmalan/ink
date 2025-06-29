"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Form/Input/Input";
import CollectionCard from "@/components/UI/Cards/CollectionCard/CollectionCard";
import CatalogGrid from "../Catalog/CatalogGrid";
import Wrapper from "../Wrapper/Wrapper";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import { generateCollectionMenu } from "@/data/sideMenus/collectionMenu";
import styles from "./collection.module.scss";
import PlusCircle from "@/assets/icons/PlusCircle";
import ArrowBtn from "@/components/UI/Buttons/ArrowBtn/ArrowBtn";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import { useTranslations } from "next-intl";

interface Props {
  initialCollections: any[];
}

export default function CollectionSection({ initialCollections }: Props) {
  const [collections, setCollections] = useState(initialCollections);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const router = useRouter();
  const t = useTranslations("Catalog");

  useEffect(() => {
    applyFilters();
  }, [search, sortBy, sortOrder]);

  const applyFilters = async () => {
    const trimmedSearch = search.trim();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          query Collections(
            $filter: CollectionFilter
            $sortBy: CollectionSortField
            $sortOrder: SortOrder
            $limit: Int
          ) {
            collections(
              filter: $filter
              sortBy: $sortBy
              sortOrder: $sortOrder
              limit: $limit
            ) {
              results {
                id
                name
                titles { id }
                score { likes dislikes }
                views
              }
            }
          }
        `,
        variables: {
          filter: trimmedSearch ? { name: trimmedSearch } : {},
          sortBy,
          sortOrder,
          limit: 100,
        },
      }),
    });

    const json = await res.json();
    const data = json.data?.collections?.results;
    if (Array.isArray(data)) setCollections(data);
  };

  const handleSelect = (value: string) => {
    if (["CREATED_AT", "LIKES"].includes(value)) {
      setSortBy(value);
    } else if (["ASC", "DESC"].includes(value)) {
      setSortOrder(value as "ASC" | "DESC");
    }
  };

  return (
    <CatalogGrid
      sidebar={
        <Wrapper>
          {generateCollectionMenu(t).map((section, idx) => (
            <SideMenu
              key={idx}
              data={section}
              selected={sortBy}
              selectedSecondary={sortOrder}
              onSelect={handleSelect}
            />
          ))}
        </Wrapper>
      }
    >
      <div className={styles.header}>
        <h1>{t("collections")}</h1>
        <ArrowBtn href="/catalog">{t("catalog")}</ArrowBtn>
      </div>
      <div className={styles.searchRow}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_collections")}
        />
        <Button
          className={styles.addBtn}
          onClick={() => router.push("/collection/create")}
          title={t("create_collection")}
        >
          <PlusCircle />
        </Button>
      </div>
      <div className={styles.grid}>
        {collections.map((c) => (
          <div
            key={c.id}
            onClick={() => router.push(`/collection/${c.id}`)}
            style={{ cursor: "pointer" }}
          >
            <CollectionCard
              title={c.name}
              views={c.views}
              likes={c.score.likes}
              dislikes={c.score.dislikes}
              itemsCount={c.titles.length}
              titleIds={c.titles.map((t: any) => t.id)}
            />
          </div>
        ))}
      </div>
    </CatalogGrid>
  );
}
