export const commentTypeDefs = `#graphql
  type Score {
    likes: Int
    dislikes: Int
  }

  type Comment {
    id: ObjectID!
    user: User!
    subject_ID: ObjectID!
    body: String!
    parent: Comment
    score: Score
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateCommentInput {
    userId: ObjectID!
    subjectId: ObjectID!
    body: String!
    parentId: ObjectID
  }

  type Query {
    comments: [Comment!]!
    comment(id: ObjectID!): Comment
  }

  input EditCommentInput {
    body: String
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    deleteComment(id: ObjectID!): Boolean
    editComment(id: ObjectID!, edits: EditCommentInput!): Comment
    likeComment(id: ObjectID!): Comment
    dislikeComment(id: ObjectID!): Comment
  }
`;
