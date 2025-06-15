import { notFound } from "next/navigation";
import Container from "@/components/Layout/Container/Container";
import CollectionContent from "@/components/Layout/Collection/CollectionContent";

const GET_COLLECTION = `
  query Collection($id: ObjectID!) {
    collection(id: $id) {
      id
      name
      description
      createdAt
      user {
        _id
        username
      }
      titles {
        id
        name
        cover
        alt_names {
          value
          lang
        }
      }
    }
  }
`;

export default async function Page({ params }: any) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_COLLECTION,
      variables: { id: id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const collection = json.data?.collection;
  if (!collection) return notFound();

  return (
    <Container>
      <CollectionContent collection={collection} />
    </Container>
  );
}
