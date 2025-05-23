"use client";

import styles from "./title-info.module.scss";
import TitlePageGrid from "@/components/Layout/Grid/TitlePageGrid";
import TitleCover from "@/components/Layout/Catalog/TitleCover/TitleCover";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import Tabs from "../../Tabs/Tabs";

interface Props {
  title: {
    id: string;
    name: string;
    author?: { name: string };
    franchise?: string;
    translation?: string;
    status?: string;
    genres?: { name: { en: string } }[];
    tags?: { name: { en: string } }[];
    description?: string;
  };
}

export default function TitleInfo({ title }: Props) {
  const tabs = [
    {
      title: "Інформація",
      content: (
        <div className={styles.info}>
          <h1>{title.name}</h1>
          <p>
            <strong>Author:</strong> {title.author?.name || "—"}
          </p>
          <p>
            <strong>Franchise:</strong> {title.franchise || "—"}
          </p>
          <p>
            <strong>Translation:</strong> {title.translation || "—"}
          </p>
          <p>
            <strong>Status:</strong> {title.status || "—"}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {title.genres?.map((g) => g.name.en).join(", ") || "—"}
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            {title.tags?.map((t) => t.name.en).join(", ") || "—"}
          </p>
          <p style={{ marginTop: "1rem" }}>
            {title.description || "No description"}
          </p>
        </div>
      ),
    },
    {
      title: "Розділи",
      content: <div>Розділи</div>,
    },
    {
      title: "Коментарі",
      content: <div>Коментарі</div>,
    },
  ];

  return (
    <TitlePageGrid
      sidebar={
        <>
          {title && (
            <TitleCover
              className={styles.cover}
              id={title.id}
              name={title.name}
            />
          )}
          <Button className={styles.primaryBtn}>Почати читати</Button>
        </>
      }
    >
      <Wrapper>
        <Tabs tabs={tabs}></Tabs>
      </Wrapper>
    </TitlePageGrid>
  );
}
