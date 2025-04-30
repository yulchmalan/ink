"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, FreeMode } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
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
    <Wrapper className={styles.wrapper}>
      <div className={styles.heading}>
        <h2>Популярне</h2>
        <ShowMore href="/catalogue%popular" />
      </div>

      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, A11y, FreeMode]}
          spaceBetween={12}
          slidesPerView="auto"
          loop
          freeMode
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className={styles.swiperLarge}
          // breakpoints={{
          //   420: {
          //     slidesPerView: 2.5,
          //   },
          //   480: {
          //     slidesPerView: 3,
          //   },
          //   550: {
          //     slidesPerView: 3.5,
          //   },
          //   1480: {
          //     slidesPerView: 5,
          //   },
          //   1900: {
          //     slidesPerView: 7.7,
          //   },
          // }}
        >
          {popularBooks.map((book, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <BookCard {...book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.navButtons}>
        <button ref={prevRef} className="custom-prev">
          <ChevronLeft />
        </button>
        <button ref={nextRef} className="custom-next">
          <ChevronRight />
        </button>
      </div>
    </Wrapper>
  );
}
