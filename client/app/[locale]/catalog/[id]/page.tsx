import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { GET_TITLE } from "@/graphql/queries/getTitle";
import Container from "@/components/Layout/Container/Container";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}) {
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

export default async function Page({
  params,
}: {
  params: { id: string; locale: string };
}) {
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
      <h1>{title.name}</h1>
      {title && (
        <img
          src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/covers/${title.id}`}
          alt={title.name}
          style={{ maxWidth: "300px", borderRadius: "12px" }}
        />
      )}
      <p>
        <strong>Author:</strong> {title.author?.name}
      </p>
      <p>
        <strong>Franchise:</strong> {title.franchise || "—"}
      </p>
      <p>
        <strong>Translation:</strong> {title.translation}
      </p>
      <p>
        <strong>Status:</strong> {title.status}
      </p>
      <p>
        <strong>Genres:</strong>{" "}
        {title.genres?.map((g: any) => g.name.en).join(", ") || "—"}
      </p>
      <p>
        <strong>Tags:</strong>{" "}
        {title.tags?.map((t: any) => t.name.en).join(", ") || "—"}
      </p>
      <p style={{ marginTop: "1rem" }}>
        {title.description || "No description"}
      </p>
    </Container>
  );
}
