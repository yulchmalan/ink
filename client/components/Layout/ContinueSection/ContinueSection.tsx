"use client";

import { useEffect, useState } from "react";
import { continueReading } from "@/graphql/queries/continueReading";
import Heading from "@/components/UI/Heading/Heading";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Container from "@/components/Layout/Container/Container";
import styles from "./continue.module.scss";
import ProgressCard, {
  ProgressCardProps,
} from "@/components/UI/Cards/ProgressCard/ProgressCard";

export default function ContinueSection() {
  const [items, setItems] = useState<ProgressCardProps[]>([]);

  useEffect(() => {
    continueReading().then(setItems);
  }, []);

  if (!items.length) return null;

  return (
    <div>
      {items.map((item, i) => (
        <ProgressCard key={i} {...item} className={styles.progCard} />
      ))}
    </div>
  );
}
