export const commentTypeDefs = `#graphql
  type Score {
    likes: Int
    dislikes: Int
    likedBy: [User!]!
    dislikedBy: [User!]!
  }

  type Comment {
    id: ObjectID!
    user: User!
    subject_ID: ObjectID!
    title: Title
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

  input EditCommentInput {
    body: String
  }

  enum CommentSortField {
    CREATED_AT
    LIKES
    DISLIKES
    RATING
  }

  enum SortOrder {
    ASC
    DESC
  }

  input CommentFilter {
    subjectId: ObjectID
    userId: ObjectID
  }

  type PaginatedComments {
    total: Int!
    results: [Comment!]!
  }

  type Query {
    comments(
      filter: CommentFilter
      sortBy: CommentSortField = CREATED_AT
      sortOrder: SortOrder = DESC
      limit: Int = 10
      offset: Int = 0
    ): PaginatedComments!

    comment(id: ObjectID!): Comment
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    deleteComment(id: ObjectID!): Boolean
    editComment(id: ObjectID!, edits: EditCommentInput!): Comment
    likeComment(id: ObjectID!, userId: ObjectID!): Comment
    dislikeComment(id: ObjectID!, userId: ObjectID!): Comment
    clearCommentVote(id: ObjectID!, userId: ObjectID!): Comment
  }
`;
