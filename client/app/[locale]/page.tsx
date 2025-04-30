import Container from "@/components/Layout/Container/Container";
import SwiperPopularSection from "@/components/Layout/SwiperSections/SwiperPopularSection";
import BookCard from "@/components/UI/BookCard/BookCard";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import LanguageSwitcher from "@/components/UI/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import { getTranslations, getLocale } from "next-intl/server";
import cover from "../../assets/cover.png";
import SwiperMoreButton from "@/components/UI/Buttons/ShowMore/ShowMore";
import SwiperRecommendations from "@/components/Layout/SwiperSections/SwiperRecommendations";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  return (
    <>
      {/* <h1>{t("localeText")}</h1> */}
      {/* <LanguageSwitcher></LanguageSwitcher> */}
      {/* <ThemeToggle></ThemeToggle> */}
      <Container>
        <SwiperPopularSection></SwiperPopularSection>
      </Container>
      <Container>
        <SwiperRecommendations></SwiperRecommendations>
      </Container>
      <Container>
        <SwiperRecommendations></SwiperRecommendations>
      </Container>
      <Container>
        <SwiperRecommendations></SwiperRecommendations>
      </Container>
      <Container>
        <SwiperRecommendations></SwiperRecommendations>
      </Container>
    </>
  );
}
