"use client";

import DefaultAvatar from "@/assets/pfp.svg";
import styles from "./pfp.module.scss";
import { useS3Image } from "@/hooks/useS3Image";
import { useAuth } from "@/contexts/AuthContext";

interface PfpProps {
  userId: string;
  className?: string;
  alt?: string;
  isOnline?: boolean;
}

const Pfp = ({ userId, className, alt = "Avatar", isOnline }: PfpProps) => {
  const resolvedImg = useS3Image("avatars", userId, DefaultAvatar.src);
  const { user } = useAuth();

  const showAsOnline = user?._id === userId ? true : isOnline;

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <img src={resolvedImg} alt={alt} className={className || styles.pfp} />
      </div>
      <span
        className={`${styles.statusDot} ${
          showAsOnline ? styles.online : styles.offline
        }`}
        title={showAsOnline ? "Online" : "Offline"}
      />
    </div>
  );
};

export default Pfp;
