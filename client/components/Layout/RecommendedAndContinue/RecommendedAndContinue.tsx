"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Layout/Container/Container";
import SwiperSection from "@/components/Layout/SwiperSections/SwiperSection";
import ContinueSection from "@/components/Layout/ContinueSection/ContinueSection";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Heading from "@/components/UI/Heading/Heading";
import styles from "@/app/[locale]/page.module.scss";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";

export default function RecommendedAndContinue() {
  const t = useTranslations("Index");
  const { isLoggedIn, user } = useAuth();

  const [hasProgress, setHasProgress] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: `
              query GetUser($id: ObjectID!) {
                user(id: $id) {
                  lists {
                    titles {
                      progress
                    }
                  }
                }
              }
            `,
            variables: { id: user._id },
          }),
        });

        const json = await res.json();
        const lists = json.data?.user?.lists || [];

        const allTitles = lists.flatMap((l: any) => l.titles);

        const hasAnyProgress = allTitles.some((t: any) => t.progress != 0);
        const hasAnySaved = allTitles.length > 0;

        setHasProgress(hasAnyProgress);
        setHasSaved(hasAnySaved);
      } catch (err) {
        console.error("Помилка при перевірці списків/прогресу:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <Container>
        <SwiperSection
          heading={t("Popular")}
          dataName="popularBooks"
          size="large"
        />
      </Container>

      {isLoggedIn && hasSaved && (
        <Container>
          <SwiperSection
            heading={t("BasedOnRead")}
            dataName="recommendedBooks"
            size="large"
          />
        </Container>
      )}

      {isLoggedIn && hasProgress && (
        <Container>
          <Wrapper className={styles.recentWrapper}>
            <Heading className={styles.pdBottom12}>{t("Continue")}</Heading>
            <ContinueSection />
          </Wrapper>
        </Container>
      )}
    </>
  );
}
