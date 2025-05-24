export const GET_TITLE_RATINGS = `#graphql
  query GetTitleRatings {
    users(limit: 10000) {
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
