import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CollectionCard from "@/components/UI/Cards/CollectionCard/CollectionCard";
import styles from "./collection.module.scss";
import { useTranslations } from "next-intl";

type Props = {
  titleId: string;
};

export default function CollectionSection({ titleId }: Props) {
  const [collections, setCollections] = useState<any[]>([]);
  const router = useRouter();
  const t = useTranslations("Collection");
  useEffect(() => {
    const fetchCollections = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query GetCollectionsWithTitle($id: ObjectID!) {
                    collections(filter: { titleId: $id }) {
                    total
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
                        name
                        }
                    }
                }
            }
        `,
          variables: { id: titleId },
        }),
        cache: "no-store",
      });

      const json = await res.json();
      setCollections(json.data?.collections?.results || []);
    };

    fetchCollections();
  }, [titleId]);

  if (collections.length === 0) {
    return <p className={styles.empty}>{t("no_collections")}</p>;
  }

  return (
    <div className={styles.collectionSection}>
      {collections.map((c) => (
        <div
          key={c.id}
          onClick={() => router.push(`/collection/${c.id}`)}
          style={{ cursor: "pointer" }}
        >
          <CollectionCard
            title={c.name}
            views={c.views}
            itemsCount={c.titles.length}
            titleIds={c.titles.map((t: any) => t.id)}
            likes={c.score.likes}
            dislikes={c.score.dislikes}
          />
        </div>
      ))}
    </div>
  );
}
