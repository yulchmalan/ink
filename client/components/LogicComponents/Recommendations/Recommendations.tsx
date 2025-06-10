"use client";

import React from "react";
import Container from "@/components/Layout/Container/Container";
import SwiperSection from "@/components/Layout/SwiperSections/SwiperSection";
import { popularBooks } from "@/data/popularBooks";
import { useLocale, useTranslations } from "next-intl";

const Recommendations = () => {
  const locale = useLocale();
  const t = useTranslations("Index");

  return <div></div>;
};

export default Recommendations;
