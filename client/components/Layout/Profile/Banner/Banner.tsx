"use client";

import styles from "./banner.module.scss";
import { useEffect, useState } from "react";
import clsx from "clsx";
import defaultBanner from "@/assets/banner.png";

interface BannerProps {
  bannerUrl?: string;
  className?: string;
}

const Banner = ({ bannerUrl, className }: BannerProps) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>(defaultBanner.src);

  useEffect(() => {
    const img = new Image();
    img.src = bannerUrl + `?cb=${Date.now()}`;
    img.onload = () => {
      if (bannerUrl) {
        setResolvedUrl(bannerUrl);
      }
    };

    img.onerror = () => setResolvedUrl(defaultBanner.src);
  }, [bannerUrl]);

  return (
    <div className={clsx(styles.bannerWrapper, className)}>
      <img src={resolvedUrl} className={styles.bannerImage} />
    </div>
  );
};

export default Banner;
