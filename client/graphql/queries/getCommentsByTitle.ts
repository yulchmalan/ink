export const GET_COMMENTS_BY_TITLE = `
  query GetCommentsByTitle($subjectId: ObjectID!) {
    comments(
      filter: { subjectId: $subjectId }
      sortBy: CREATED_AT
      sortOrder: DESC
      limit: 100
    ) {
      total
      results {
        id
        body
        createdAt
        score {
          likes
          dislikes
          likedBy {
            _id
          }
          dislikedBy {
            _id
          }
        }
        user {
          _id
          username
        }
      }
    }
  }
`;
