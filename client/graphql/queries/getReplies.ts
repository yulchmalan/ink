export const GET_REPLIES = `
  query GetReplies($parentId: ObjectID!) {
    comments(
      filter: { parentId: $parentId }
      sortBy: CREATED_AT
      sortOrder: ASC
      limit: 50
    ) {
      results {
        id
        body
        createdAt
        score {
          likes
          dislikes
          likedBy { _id }
          dislikedBy { _id }
        }
        user {
          _id
          username
        }
        subject_ID
        parent_ID
      }
    }
  }
`;