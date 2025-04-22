export const reviewTypeDefs = `#graphql
  type Score {
    likes: Int
    dislikes: Int
  }

  type Review {
    id: ObjectID!
    name: String!
    body: String!
    rating: Int
    views: Int
    score: Score
    user: User!
    title: Title!
    comments: [Comment!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateReviewInput {
    name: String!
    body: String!
    rating: Int
    userId: ObjectID!
    titleId: ObjectID!
  }

  type Query {
    reviews: [Review!]!
    review(id: ObjectID!): Review
  }

  input EditReviewInput {
    name: String
    body: String
    rating: Int
  }

  type Mutation {
    createReview(input: CreateReviewInput!): Review
    deleteReview(id: ObjectID!): Boolean
    editReview(id: ObjectID!, edits: EditReviewInput!): Review
    likeReview(id: ObjectID!): Review
    dislikeReview(id: ObjectID!): Review
  }
`;
