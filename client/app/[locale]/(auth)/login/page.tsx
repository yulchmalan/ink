import Input from "@/components/Form/Input/Input";
import SubmitBtn from "@/components/Form/SubmitBtn/SubmitBtn";
import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Logo from "@/components/UI/Buttons/Logo/Logo";
import LinkHighlight from "@/components/UI/LinkHighlight/LinkHighlight";
import { getTranslations, getLocale } from "next-intl/server";
import styles from "./page.module.scss";
import Form from "./Form";

export async function generateMetadata() {
  const locale = await getLocale();

  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: "Ink | Digital Library",
    description:
      "Авторизуйся на Ink і продовжуй читати там, де зупинився. Персоналізовані рекомендації, закладки, рецензії — все під рукою.",
  };
}

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });
  return (
    <>
      <Container>
        <Wrapper className={styles.wrapper}>
          <Logo></Logo>
          <h1>Авторизація</h1>
          <Form></Form>
          <p>
            Не маєте аккаунту?{" "}
            <LinkHighlight href="/register">Зареєструватися</LinkHighlight>
          </p>
        </Wrapper>
      </Container>
    </>
  );
}
