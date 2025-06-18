"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Tabs from "./Tabs";
import UpdateCard from "@/components/UI/Cards/UpdateCard/UpdateCard";
import { useAuth } from "@/contexts/AuthContext";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";
import UpdateCardWrapper from "./UpdateCardWrapper";
export default function UpdatesTabs() {
  const t = useTranslations("Tabs");
  const { user } = useAuth();

  const [latestTitles, setLatestTitles] = useState<any[]>([]);
  const [userTitles, setUserTitles] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query {
              titles(sort: { field: CREATED_AT, direction: DESC }, limit: 7) {
                results {
                  id
                  name
                  type
                  alt_names {
                    lang
                    value
                  }
                  genres {
                    name {
                      uk
                      en
                      pl
                    }
                  }
                  cover
                }
              }
            }
          `,
        }),
      });

      const json = await res.json();
      setLatestTitles(json.data?.titles?.results || []);
    };

    const fetchUserTitles = async () => {
      if (!user) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query {
              titles(sort: { field: CREATED_AT, direction: DESC }, limit: 7) {
                results {
                  id
                  name
                  alt_names {
                    lang
                    value
                  }
                  type
                  genres {
                    name {
                      uk
                      en
                      pl
                    }
                  }
                  cover
                }
              }
            }
          `,
          variables: { id: user._id },
        }),
      });

      const json = await res.json();
      const allTitles = json.data?.user?.lists
        ?.flatMap((l: any) => l.titles.map((t: any) => t.title))
        .filter((t: any) => t);

      const sorted = allTitles
        .sort(
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 7);

      setUserTitles(sorted);
    };

    fetchLatest();
    fetchUserTitles();
  }, [user]);

  const tabs = [
    {
      title: t("AllUpdates"),
      content: (
        <>
          {latestTitles.map((t) => (
            <UpdateCardWrapper key={t.id} t={t} />
          ))}
        </>
      ),
    },
    {
      title: t("MyUpdates"),
      content: (
        <>
          {userTitles.map((t) => (
            <UpdateCardWrapper key={t.id} t={t} />
          ))}
        </>
      ),
    },
  ];

  return <Tabs tabs={tabs} />;
}
