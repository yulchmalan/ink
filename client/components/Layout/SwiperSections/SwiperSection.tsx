"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, FreeMode } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import clsx from "clsx";

import "swiper/scss";
import "swiper/scss/navigation";

import styles from "./swiper-section.module.scss";
import BookCard from "@/components/UI/Cards/BookCard/BookCard";
import Wrapper from "../Wrapper/Wrapper";
import ShowMore from "../../UI/Buttons/ArrowBtn/ArrowBtn";
import Heading from "../../UI/Heading/Heading";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";

import { booksData } from "@/data/lib";
import ArrowBtn from "../../UI/Buttons/ArrowBtn/ArrowBtn";
import { useTranslations } from "use-intl";

type LibDataKeys = keyof typeof booksData;

type SwiperSize = "small" | "large";

type BookSwiperProps = {
  heading: string;
  dataName: LibDataKeys;
  size?: SwiperSize; // default = "small"
};

export default function BookSwiper({
  heading,
  dataName,
  size = "small",
}: BookSwiperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [data, setData] = useState<any[]>([]);
  const t = useTranslations("UI");

  const isLarge = size === "large";

  useEffect(() => {
    setData(booksData[dataName]);
  }, [dataName]);

  useEffect(() => {
    if (
      isLarge &&
      swiperRef.current &&
      swiperRef.current.params.navigation &&
      typeof swiperRef.current.params.navigation !== "boolean"
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current!;
      swiperRef.current.params.navigation.nextEl = nextRef.current!;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [data, isLarge]);

  return (
    <Wrapper className={clsx(styles.wrapper, "wrapper")}>
      <div className={styles.heading}>
        <Heading>{heading}</Heading>
        {isLarge && (
          <ArrowBtn href={`/catalogue%${dataName}`}>{t("showMore")}</ArrowBtn>
        )}
      </div>

      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, A11y, FreeMode]}
          spaceBetween={12}
          slidesPerView="auto"
          freeMode
          onSwiper={(swiper) => {
            if (isLarge) swiperRef.current = swiper;
          }}
          navigation={
            isLarge
              ? { prevEl: prevRef.current!, nextEl: nextRef.current! }
              : { prevEl: ".custom-prev2", nextEl: ".custom-next2" }
          }
          className={clsx(
            isLarge ? styles.swiperLarge : styles.swiperSmall,
            isLarge ? "swiperLarge" : "swiperSmall"
          )}
        >
          {data.map((book, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <BookCard {...book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.navButtons}>
        {isLarge ? (
          <>
            <button
              ref={prevRef}
              className={clsx(styles.customPrev, "custom-prev")}
            >
              <ChevronLeft />
            </button>
            <button
              ref={nextRef}
              className={clsx(styles.customNext, "custom-next")}
            >
              <ChevronRight />
            </button>
          </>
        ) : (
          <>
            <button className={clsx(styles.customPrev2, "custom-prev2")}>
              <ChevronLeft />
            </button>
            <button className={clsx(styles.customNext2, "custom-next2")}>
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </Wrapper>
  );
}
