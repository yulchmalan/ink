"use client";

import { useRef } from "react";

interface UseProgressAndExpProps {
  userId: string;
  titleId: string;
}

export function useProgressAndExp({ userId, titleId }: UseProgressAndExpProps) {
  const prevChapterRef = useRef<number>(0);

  const updateProgress = async (chapter: number) => {
    if (!userId) return;

    const now = new Date().toISOString();

    // оновлюємо прогрес
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          mutation UpdateProgress($userId: ObjectID!, $titleId: ObjectID!, $progress: Int!, $last_open: DateTime!) {
            updateUser(
              id: $userId,
              edits: {
                lists: [{
                  name: "reading",
                  titles: [{
                    title: $titleId,
                    progress: $progress,
                    last_open: $last_open
                  }]
                }]
              }
            ) {
              _id
            }
          }
        `,
        variables: {
          userId,
          titleId,
          progress: chapter,
          last_open: now,
        },
      }),
    });

    // додаємо досвід, якщо глава зросла
    if (chapter > prevChapterRef.current) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation AddExp($userId: ObjectID!, $amount: Int!) {
              addExpToUser(userId: $userId, amount: $amount) {
                _id
                exp
              }
            }
          `,
          variables: {
            userId,
            amount: 1,
          },
        }),
      });
    }

    prevChapterRef.current = chapter;
  };

  return { updateProgress };
}
