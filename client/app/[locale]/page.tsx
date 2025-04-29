import Container from "@/components/Layout/Container/Container";
import Navbar from "@/components/Layout/Navbar/Navbar";
import BookCard from "@/components/UI/BookCard/BookCard";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import LanguageSwitcher from "@/components/UI/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import { getTranslations, getLocale } from "next-intl/server";
import cover from "../../assets/cover.png";
import SwiperMoreButton from "@/components/UI/Buttons/ShowMore/ShowMore";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  return (
    <>
      <h1>{t("localeText")}</h1>
      <Button>Праймарі кніпка</Button>
      <Button variant="secondary">Секондарі кніпка</Button>
      {/* <LanguageSwitcher></LanguageSwitcher> */}
      <ThemeToggle></ThemeToggle>
      <BookCard
        title="Осина фабрика"
        desc="Психологія, Роман"
        coverUrl={cover.src}
        href="/title/osina-fabrika"
        size="large"
      />
      <Container>gfgh</Container>
    </>
  );
}
