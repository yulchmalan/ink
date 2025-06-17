"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { continueReading } from "@/graphql/queries/continueReading";
import styles from "./continue.module.scss";
import ProgressCard, {
  ProgressCardProps,
} from "@/components/UI/Cards/ProgressCard/ProgressCard";

export default function ContinueSection() {
  const { user } = useAuth();
  const [items, setItems] = useState<ProgressCardProps[]>([]);

  useEffect(() => {
    continueReading().then(setItems);
  }, []);

  async function resetProgress(userId: string, titleId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          mutation resetProgress($userId: ObjectID!, $titleId: ObjectID!) {
            resetTitleProgress(userId: $userId, titleId: $titleId)
          }
        `,
        variables: { userId, titleId },
      }),
    });

    const { data } = await res.json();
    return data?.resetTitleProgress;
  }

  if (!user?._id || !items.length) return null;

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <ProgressCard
          key={i}
          {...item}
          onDelete={async () => {
            await resetProgress(user._id, item.titleId);
            setItems((prev) =>
              prev.filter((el) => el.titleId !== item.titleId)
            );
          }}
          className={styles.progCard}
        />
      ))}
    </div>
  );
}
