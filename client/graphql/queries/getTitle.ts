export const GET_TITLE = `
  query GetTitle($id: ObjectID!) {
    getTitle(id: $id) {
      id
      name
      description
      cover
      franchise
      translation
      status
      type
      alt_names {
        lang
        value
      }
      author {
        id
        name
      }
      genres {
        id
        name {
          en
          uk
          pl
        }
      }
      tags {
        id
        name {
          en
          uk
          pl
        }
      }
      createdAt
      updatedAt
    }
  }
`;
