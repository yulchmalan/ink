"use client";

import DefaultAvatar from "@/assets/pfp.svg";
import styles from "./pfp.module.scss";
import { useS3Image } from "@/hooks/useS3Image";

interface PfpProps {
  userId: string;
  className?: string;
  alt?: string;
}

const Pfp = ({ userId, className, alt = "Avatar" }: PfpProps) => {
  const resolvedImg = useS3Image("avatars", userId, DefaultAvatar.src);

  return (
    <img src={resolvedImg} alt={alt} className={className || styles.pfp} />
  );
};

export default Pfp;
