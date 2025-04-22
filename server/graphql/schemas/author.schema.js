export const authorTypeDefs = `#graphql
  scalar ObjectID

  type Author {
    id: ObjectID!
    name: String!
    alt_names: [String]
    bio: String
    subscribers: [User]
    photo: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    authors: [Author]
    getAuthor(id: ObjectID!): Author
  }

  type Mutation {
    createAuthor(
      name: String!
      alt_names: [String]
      bio: String
      photo: String
    ): Author

    updateAuthor(
      id: ObjectID!
      name: String
      alt_names: [String]
      bio: String
      photo: String
    ): Author

    deleteAuthor(id: ObjectID!): Boolean
  }
`;
