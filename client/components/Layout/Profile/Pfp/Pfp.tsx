"use client";

import { useEffect, useState } from "react";
import DefaultAvatar from "@/assets/pfp.svg";
import styles from "./pfp.module.scss";

interface PfpProps {
  userId: string;
  className?: string;
  alt?: string;
}

const Pfp = ({ userId, className, alt = "Avatar" }: PfpProps) => {
  const [resolvedImg, setResolvedImg] = useState<string>(DefaultAvatar.src);

  useEffect(() => {
    if (!userId) return;

    const imgSrc = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/avatars/${userId}.jpg`;
    const img = new Image();
    img.src = imgSrc + `?cb=${Date.now()}`;

    img.onload = () => setResolvedImg(imgSrc);
    img.onerror = () => setResolvedImg(DefaultAvatar.src);
  }, [userId]);

  return (
    <img src={resolvedImg} alt={alt} className={className || styles.pfp} />
  );
};

export default Pfp;
