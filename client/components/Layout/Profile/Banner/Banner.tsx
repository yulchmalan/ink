"use client";

import styles from "./banner.module.scss";
import clsx from "clsx";
import defaultBanner from "@/assets/banner.png";
import { useS3Image } from "@/hooks/useS3Image";
import Image from "next/image";

interface BannerProps {
  userId: string;
  className?: string;
}

const Banner = ({ userId, className }: BannerProps) => {
  const resolvedUrl = useS3Image("banners", userId, defaultBanner.src);

  return (
    <div className={clsx(styles.bannerWrapper, className)}>
      <Image
        src={resolvedUrl}
        className={styles.bannerImage}
        alt="Banner"
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
};

export default Banner;
