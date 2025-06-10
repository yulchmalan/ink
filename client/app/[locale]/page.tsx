import Container from "@/components/Layout/Container/Container";
import LanguageSwitcher from "@/components/UI/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/UI/ThemeToggle/ThemeToggle";
import { getTranslations, getLocale } from "next-intl/server";
import SwiperSection from "@/components/Layout/SwiperSections/SwiperSection";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import ProgressCard from "@/components/UI/Cards/ProgressCard/ProgressCard";
import cover from "../../assets/cover.png";
import styles from "./page.module.scss";
import Heading from "@/components/UI/Heading/Heading";
import IndexGrid from "@/components/Layout/Grid/IndexGrid";
import IndexTabs from "@/components/Layout/Tabs/IndexTabs";
import CollectionCard from "@/components/UI/Cards/CollectionCard/CollectionCard";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import ArrowBtn from "@/components/UI/Buttons/ArrowBtn/ArrowBtn";
import { popularBooks } from "@/data/popularBooks";
import Recommendations from "@/components/LogicComponents/Recommendations/Recommendations";

export async function generateMetadata() {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: "Ink | Digital Library",
    description: t("description"),
  };
}

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  const popular = await popularBooks();
  const reviewBody =
    "Головна проблема – сюжет, що балансує між штучною напруженістю і повною передбачуваністю. Автор намагається створити атмосферу параної та екзистенційного жаху блаблабалаба блаблабалаба блаблабалабаблаблабалаба блаблабалаба";
  return (
    <>
      {/* <LanguageSwitcher></LanguageSwitcher> */}
      {/* <ThemeToggle></ThemeToggle> */}
      <Container>
        <SwiperSection
          heading={t("Popular")}
          dataName="popularBooks"
          size="large"
        />
      </Container>
      <Recommendations></Recommendations>
      {/* <Container>
        <SwiperSection
          heading={t("BasedOnRead")}
          dataName="recommendedBooks"
        ></SwiperSection>
      </Container> */}
      <Container>
        <Wrapper className={styles.recentWrapper}>
          <Heading className={styles.pdBottom12}>{t("Continue")}</Heading>
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
              <Heading>{t("Updates")}</Heading>
              <IndexTabs></IndexTabs>
            </Wrapper>
          }
          topRight={
            <div className={styles.section}>
              <ArrowBtn href="/collections" size="large">
                {t("Collections")}
              </ArrowBtn>
              <div className={styles.items}>
                <CollectionCard
                  title="Фентезі"
                  views={11200}
                  itemsCount={10}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
                <CollectionCard
                  title="Буддизм"
                  views={11200}
                  itemsCount={16}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
                <CollectionCard
                  title="Буддизм"
                  views={11200}
                  itemsCount={16}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
                <CollectionCard
                  title="Буддизм"
                  views={11200}
                  itemsCount={16}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
                <CollectionCard
                  title="Буддизм"
                  views={11200}
                  itemsCount={16}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
                <CollectionCard
                  title="Буддизм"
                  views={11200}
                  itemsCount={16}
                  bookmarks={2000}
                  likes={96}
                  dislikes={12}
                  titleIds={[]}
                />
              </div>
            </div>
          }
          bottomRight={
            <div className={styles.section}>
              <ArrowBtn href="/collections" size="large">
                {t("Reviews")}
              </ArrowBtn>
              <div className={styles.items}>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
                <ReviewCard
                  likes="96/12"
                  views={11200}
                  title="Не виправдало очікувань"
                  body={reviewBody}
                  rating={2.5}
                  coverUrl={cover.src}
                ></ReviewCard>
              </div>
            </div>
          }
        ></IndexGrid>
      </Container>
    </>
  );
}
