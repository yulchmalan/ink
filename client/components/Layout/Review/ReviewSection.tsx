"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Form/Input/Input";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import CatalogGrid from "../Catalog/CatalogGrid";
import Wrapper from "../Wrapper/Wrapper";
import SideMenu from "@/components/Layout/Profile/SideMenu/SideMenu";
import { generateReviewMenu } from "@/data/sideMenus/reviewMenu";
import styles from "./review.module.scss";
import ArrowBtn from "@/components/UI/Buttons/ArrowBtn/ArrowBtn";
import { useTranslations } from "next-intl";

interface Props {
  initialReviews: any[];
}

export default function ReviewSection({ initialReviews }: Props) {
  const t = useTranslations("Review");
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const router = useRouter();

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
          query Reviews(
            $filter: ReviewFilter
            $sortBy: ReviewSortField
            $sortOrder: SortOrder
            $search: String
            $limit: Int
          ) {
            reviews(
              filter: $filter
              sortBy: $sortBy
              sortOrder: $sortOrder
              search: $search
              limit: $limit
            ) {
              results {
                id
                name
                body
                rating
                views
                score { likes dislikes }
                title { id name }
              }
            }
          }
        `,
        variables: {
          search: trimmedSearch || null,
          sortBy,
          sortOrder,
          limit: 100,
        },
      }),
    });

    const json = await res.json();
    const data = json.data?.reviews?.results;
    if (Array.isArray(data)) setReviews(data);
  };

  const handleSelect = (value: string) => {
    if (["CREATED_AT", "RATING", "VIEWS"].includes(value)) {
      setSortBy(value);
    } else if (["ASC", "DESC"].includes(value)) {
      setSortOrder(value as "ASC" | "DESC");
    }
  };

  return (
    <CatalogGrid
      sidebar={
        <Wrapper>
          {generateReviewMenu(t).map((section, idx) => (
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
        <h1>{t("title")}</h1>
        <ArrowBtn href="/catalog">{t("catalog")}</ArrowBtn>
      </div>
      <div className={styles.searchRow}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_placeholder")}
        />
      </div>
      <div className={styles.grid}>
        {reviews.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/review/${r.id}`)}
            style={{ cursor: "pointer" }}
          >
            <ReviewCard
              id={r.id}
              titleId={r.title?.id}
              title={r.name}
              body={r.body}
              rating={r.rating}
              views={r.views}
              likes={`${r.score?.likes.toString()}/${r.score?.dislikes.toString()}`}
            />
          </div>
        ))}
      </div>
    </CatalogGrid>
  );
}
