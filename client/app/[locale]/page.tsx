import Container from "@/components/Layout/Container/Container";
import LanguageSwitcher from "@/components/UI/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import { getTranslations, getLocale } from "next-intl/server";
import SwiperSection from "@/components/Layout/SwiperSections/SwiperSection";
import ProgressBar from "@/components/UI/ProgressBar/ProgressBar";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import ProgressCard from "@/components/UI/Cards/ProgressCard/ProgressCard";
import cover from "../../assets/cover.png";
import styles from "./page.module.scss";
import Heading from "@/components/UI/Heading/Heading";
import IndexGrid from "@/components/Layout/Grid/IndexGrid";
import IndexTabs from "@/components/Layout/Tabs/IndexTabs";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  return (
    <>
      {/* <h1>{t("localeText")}</h1> */}
      {/* <LanguageSwitcher></LanguageSwitcher> */}
      {/* <ThemeToggle></ThemeToggle> */}
      <Container>
        <SwiperSection
          heading="Популярне"
          dataName="popularBooks"
          size="large"
        />
      </Container>
      <Container>
        <SwiperSection
          heading="На основі прочитаного"
          dataName="recommendedBooks"
        ></SwiperSection>
      </Container>
      <Container>
        <Wrapper className={styles.recentWrapper}>
          <Heading className={styles.pdBottom12}>Продовжити</Heading>
          <div>
            <ProgressCard
              value={5}
              title="blabla"
              href="/titles/:id"
              coverUrl={cover.src}
              className={styles.progCard}
            ></ProgressCard>
            <ProgressCard
              value={50}
              title="blabla"
              href="/titles/:id"
              coverUrl={cover.src}
              className={styles.progCard}
              max={150}
            ></ProgressCard>
            <ProgressCard
              value={5}
              title="blabla"
              href="/titles/:id"
              coverUrl={cover.src}
              className={styles.progCard}
            ></ProgressCard>
            <ProgressCard
              value={5}
              title="blabla"
              href="/titles/:id"
              coverUrl={cover.src}
              className={styles.progCard}
            ></ProgressCard>
          </div>
        </Wrapper>
      </Container>
      <Container>
        <IndexGrid
          sidebar={
            <Wrapper className={styles.recent}>
              <Heading>Нещодавні оновлення</Heading>
              <IndexTabs></IndexTabs>
            </Wrapper>
          }
          topRight={<div className={styles.collections}>dfg</div>}
          bottomRight={<div className={styles.reviews}>dfg</div>}
        ></IndexGrid>
      </Container>
    </>
  );
}
