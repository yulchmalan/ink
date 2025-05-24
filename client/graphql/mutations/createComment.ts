export const CREATE_COMMENT = `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
    }
  }
`;
