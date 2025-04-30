"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, FreeMode } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import clsx from "clsx";

import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";

import styles from "./swiper-section.module.scss";
import BookCard from "@/components/UI/BookCard/BookCard";
import { popularBooks } from "@/data/lib";
import Wrapper from "../Wrapper/Wrapper";
import ShowMore from "../../UI/Buttons/ShowMore/ShowMore";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";

export default function SwiperSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  useEffect(() => {
    if (
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
  }, []);

  return (
    <Wrapper className={clsx(styles.wrapper, "wrapper")}>
      <div className={styles.heading}>
        <h2>Популярне</h2>
        <ShowMore href="/catalogue%popular" />
      </div>

      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, A11y, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className={clsx(styles.swiperLarge, "swiperLarge")}
        >
          {popularBooks.map((book, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <BookCard {...book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.navButtons}>
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
      </div>
    </Wrapper>
  );
}
