// hooks/useCommentsCount.ts
import { useEffect, useState } from "react";
import { GET_COMMENTS_COUNT_BY_SUBJECT } from "@/graphql/queries/getCommentsCount";

export const useCommentsCount = (subjectId: string) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: GET_COMMENTS_COUNT_BY_SUBJECT,
          variables: { subjectId },
        }),
      });

      const json = await res.json();
      setCount(json.data?.comments?.total || 0);
    };

    fetchCount();
  }, [subjectId]);

  return count;
};
