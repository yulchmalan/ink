"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, FreeMode } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "swiper/scss/scrollbar";

import styles from "./swiper-section.module.scss";
import BookCard from "@/components/UI/BookCard/BookCard";
import { recomendedBooks } from "@/data/lib";
import Wrapper from "../Wrapper/Wrapper";
import ShowMore from "../../UI/Buttons/ShowMore/ShowMore";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";

export default function SwiperRecommendations() {
  return (
    <Wrapper className={styles.wrapper}>
      <div className={styles.heading}>
        <h2>На основі прочитаного</h2>
      </div>
      <div className={styles.swiperWrapper}>
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={{ nextEl: ".custom-next2", prevEl: ".custom-prev2" }}
          className={styles.swiperSmall}
          loop={true}
          freeMode
        >
          {recomendedBooks.map((book, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <BookCard {...book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.navButtons}>
        <button className="custom-prev2">
          <ChevronLeft />
        </button>
        <button className="custom-next2">
          <ChevronRight />
        </button>
      </div>
    </Wrapper>
  );
}
