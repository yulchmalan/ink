import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { GET_TITLE } from "@/graphql/queries/getTitle";
import Container from "@/components/Layout/Container/Container";
import TitlePageGrid from "@/components/Layout/Grid/TitlePageGrid";
import TitleCover from "@/components/Layout/Catalog/TitleCover/TitleCover";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import styles from "./page.module.scss";
import TitleInfo from "@/components/Layout/Catalog/TitlePage/TitleInfo";

export async function generateMetadata({ params }: any) {
  const { id, locale } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_TITLE,
      variables: { id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const title = json.data?.getTitle;

  const t = await getTranslations({ locale, namespace: "Meta" });

  if (!title)
    return {
      title: t("not_found"),
      description: t("default_description"),
    };

  return {
    title: `${title.name} | Ink`,
    description: title.description ?? t("default_description"),
  };
}

export default async function Page({ params }: any) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_TITLE,
      variables: { id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const title = json.data?.getTitle;
  if (!title) return notFound();

  return (
    <Container>
      <TitleInfo title={title} />
    </Container>
  );
}
