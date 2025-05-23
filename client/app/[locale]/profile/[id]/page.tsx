import { notFound } from "next/navigation";
import { UserInfo } from "@/components/Layout/Profile/UserInfo/UserInfo";
import Container from "@/components/Layout/Container/Container";
import { getLocale, getTranslations } from "next-intl/server";
import { GET_USER } from "@/graphql/queries/getUser";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  const t = await getTranslations({ locale: locale, namespace: "Meta" });

  return {
    title: t("profile"),
    description: t("profile_description"),
  };
}

export default async function Page({ params }: any) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_USER,
      variables: { id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const user = json.data?.user;
  if (!user) return notFound();

  return (
    <Container>
      <UserInfo user={user} />
    </Container>
  );
}
