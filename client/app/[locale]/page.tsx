import Container from "@/components/Layout/Container/Container";
import { getTranslations, getLocale } from "next-intl/server";
import SwiperSection from "@/components/Layout/SwiperSections/SwiperSection";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import styles from "./page.module.scss";
import Heading from "@/components/UI/Heading/Heading";
import IndexGrid from "@/components/Layout/Grid/IndexGrid";
import IndexTabs from "@/components/Layout/Tabs/IndexTabs";
import CollectionCard from "@/components/UI/Cards/CollectionCard/CollectionCard";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import ArrowBtn from "@/components/UI/Buttons/ArrowBtn/ArrowBtn";
import Link from "next/link";
import RecommendedAndContinue from "@/components/Layout/RecommendedAndContinue/RecommendedAndContinue";

export async function generateMetadata() {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: "Ink | Digital Library",
    description: t("description"),
  };
}

const GET_COLLECTIONS = `
  query {
    collections(sortBy: CREATED_AT, sortOrder: DESC, limit: 6) {
      results {
        id
        name
        views
        score {
          likes
          dislikes
        }
        titles {
          id
        }
      }
    }
  }
`;

const GET_REVIEWS = `
  query {
    reviews(sortBy: CREATED_AT, sortOrder: DESC, limit: 6) {
      results {
        id
        name
        body
        views
        rating
        score {
          likes
          dislikes
        }
        title {
          id
        }
      }
    }
  }
`;

type Collection = {
  id: string;
  name: string;
  views: number;
  bookmarks: number;
  score: {
    likes: number;
    dislikes: number;
  };
  titles: { id: string }[];
};

type Review = {
  id: string;
  name: string;
  body: string;
  views: number;
  rating: number;
  score: {
    likes: number;
    dislikes: number;
  };
  title: {
    id: string;
    cover?: string;
  } | null;
};

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({ query: GET_COLLECTIONS }),
    cache: "no-store",
  });

  const collections: Collection[] =
    (await res.json()).data?.collections?.results || [];

  const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({ query: GET_REVIEWS }),
    cache: "no-store",
  });

  const reviews: Review[] =
    (await reviewRes.json()).data?.reviews?.results || [];

  return (
    <>
      <RecommendedAndContinue />
      <Container>
        <IndexGrid
          sidebar={
            <Wrapper className={styles.recent}>
              <Heading>{t("Updates")}</Heading>
              <IndexTabs></IndexTabs>
            </Wrapper>
          }
          topRight={
            <div className={styles.section}>
              <ArrowBtn href="/collection" size="large">
                {t("Collections")}
              </ArrowBtn>
              <div className={styles.items}>
                {collections.map((c, i) => (
                  <Link key={i} href={`/collection/${c.id}`}>
                    <CollectionCard
                      title={c.name}
                      views={c.views}
                      itemsCount={c.titles.length}
                      likes={c.score.likes}
                      dislikes={c.score.dislikes}
                      titleIds={c.titles.map((t) => t.id)}
                    />
                  </Link>
                ))}
              </div>
            </div>
          }
          bottomRight={
            <div className={styles.section}>
              <ArrowBtn href="/review" size="large">
                {t("Reviews")}
              </ArrowBtn>
              <div className={styles.items}>
                {reviews.map((r, i) => (
                  <Link key={i} href={`/review/${r.id}`}>
                    <ReviewCard
                      id={r.id}
                      title={r.name}
                      titleId={r.title?.id}
                      body={r.body}
                      views={r.views}
                      rating={r.rating}
                      likes={`${r.score.likes}/${r.score.dislikes}`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          }
        ></IndexGrid>
      </Container>
    </>
  );
}
