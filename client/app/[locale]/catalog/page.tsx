import { getTranslations, getLocale } from "next-intl/server";
import { GET_TITLES } from "@/graphql/queries/getTitles";
import Container from "@/components/Layout/Container/Container";
import TitleGrid from "@/components/Layout/Catalog/TitleGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("catalog"),
    description: t("catalog_description"),
  };
}

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_TITLES,
      variables: { limit: 12, offset: 0 },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const titles = json.data?.titles?.results;

  return (
    <Container>
      <TitleGrid titles={titles} />
    </Container>
  );
}
