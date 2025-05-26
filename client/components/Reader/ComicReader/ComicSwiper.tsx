"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../chapter-reader.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import clsx from "clsx";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";
import Cross from "@/assets/icons/Cross";
import "@/styles/swiper.scss";
import Spinner from "@/components/UI/Spinner/Spinner";

interface Props {
  titleId: string;
  initialChapter: number;
}

export default function ComicSwiper({ titleId, initialChapter }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET!;
  const REGION = process.env.NEXT_PUBLIC_S3_REGION!;
  const BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

  useEffect(() => {
    let isCancelled = false;

    const basePath = `${BASE_URL}/titles/${titleId}/chapter_${initialChapter}`;

    const loadSequentially = async () => {
      for (let i = 1; i < 100; i++) {
        const imgUrl = `${basePath}/${i}.webp?cb=${Date.now()}`;

        const isValid = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = imgUrl;
        });

        if (!isValid || isCancelled) break;

        setImages((prev) => [...prev, `${basePath}/${i}.webp`]);
      }
    };

    loadSequentially();

    return () => {
      isCancelled = true;
    };
  }, [titleId, initialChapter]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (
      swiper &&
      swiper.params.navigation &&
      typeof swiper.params.navigation !== "boolean" &&
      prevRef.current &&
      nextRef.current
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [images]);

  return (
    <div className={styles.chapterSwiper}>
      <button
        onClick={() => router.back()}
        className={styles.closeButton}
        aria-label="Закрити"
      >
        <Cross />
      </button>

      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        modules={[Navigation, Pagination, Keyboard]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className={clsx(styles.wrapper, "comicSwiper")}
      >
        {images.length === 0 ? (
          <SwiperSlide>
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          </SwiperSlide>
        ) : (
          images.map((src, i) => (
            <SwiperSlide key={i} className={styles.slide}>
              <img
                src={src}
                alt={`Page ${i + 1}`}
                className={styles.pageImage}
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>

      <div className={styles.navButtons}>
        <button ref={prevRef} className={styles.customPrev}>
          <ChevronLeft />
        </button>
        <button ref={nextRef} className={styles.customNext}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
