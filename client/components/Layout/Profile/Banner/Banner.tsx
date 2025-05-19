"use client";

import styles from "./banner.module.scss";
import { useEffect, useState } from "react";
import clsx from "clsx";
import defaultBanner from "@/assets/banner.png";

interface BannerProps {
  userId: string;
  className?: string;
}

const Banner = ({ userId, className }: BannerProps) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(defaultBanner.src);

  useEffect(() => {
    if (!userId) return;

    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/banners/${userId}.jpg`;
    const img = new Image();
    img.src = url + `?cb=${Date.now()}`;

    img.onload = () => setResolvedUrl(url);
    img.onerror = () => setResolvedUrl(defaultBanner.src);
  }, [userId]);

  return (
    <div className={clsx(styles.bannerWrapper, className)}>
      <img src={resolvedUrl} className={styles.bannerImage} alt="Banner" />
    </div>
  );
};

export default Banner;
