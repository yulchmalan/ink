"use client";

import Spinner from "@/components/UI/Spinner/Spinner";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <Spinner />
    </div>
  );
}
