export const GET_USER_LISTS_WITH_TITLE = `
  query GetUser($id: ObjectID!) {
    user(id: $id) {
      lists {
        name
        titles {
          title {
            id
          }
          rating
        }
      }
    }
  }
`;
