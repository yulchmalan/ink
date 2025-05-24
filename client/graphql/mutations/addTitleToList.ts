export const ADD_TITLE_TO_LIST = `
  mutation AddTitleToList($userId: ObjectID!, $input: AddTitleToListInput!) {
    addTitleToList(userId: $userId, input: $input) {
      name
      titles {
        title {
          id
        }
      }
    }
  }
`;
