"use client";

import DefaultAvatar from "@/assets/pfp.svg";
import styles from "./pfp.module.scss";
import { useS3Image } from "@/hooks/useS3Image";

interface PfpProps {
  userId: string;
  className?: string;
  alt?: string;
  isOnline?: boolean;
}

const Pfp = ({ userId, className, alt = "Avatar", isOnline }: PfpProps) => {
  const resolvedImg = useS3Image("avatars", userId, DefaultAvatar.src);

  return (
    <div className={styles.wrapper}>
      <img src={resolvedImg} alt={alt} className={className || styles.pfp} />
      {isOnline !== undefined && (
        <span
          className={`${styles.statusDot} ${
            isOnline ? styles.online : styles.offline
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
};

export default Pfp;
