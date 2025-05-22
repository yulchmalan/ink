import { notFound } from "next/navigation";
import { UserInfo } from "@/components/Layout/Profile/UserInfo/UserInfo";
import Container from "@/components/Layout/Container/Container";

export default async function Page(props: { params: any }) {
  const params = await props.params;
  const id = params.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: `
      query GetUser($id: ObjectID!) {
        user(id: $id) {
          _id
          username
          email
          exp
          role
          createdAt
          bio
          stats {
            materialsAdded
            titlesCreated
          }
          lists {
            name
            titles {
              title {
                id
                name
                cover
                type
                alt_names {
                  lang
                  value
                }
              }
              rating
              progress
              last_open
              added
              language       
            }
          }
            friends {
              user {
                _id
              }
              status
            }
        }
      }
    `,
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
