export const GET_COMMENTS_COUNT_BY_SUBJECT = `
  query GetCommentsCount($subjectId: ObjectID!) {
    comments(filter: { subjectId: $subjectId }) {
      total
    }
  }
`;
