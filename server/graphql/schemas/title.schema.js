export const titleTypeDefs = `#graphql
  enum Translation {
    TRANSLATED
    IN_PROGRESS
    NOT_TRANSLATED
  }

  enum Status {
    COMPLETED
    ONGOING
    ANNOUNCED
  }

  type Content {
    volume: Int
    chapter: Int
    path: String
  }

  type Title {
    id: ObjectID!
    name: String!
    description: String
    author: Author             
    cover: String
    franchise: String              
    translation: Translation
    status: Status
    alt_names: [String]
    content: Content
    genres: [Label]                
    tags: [Label]                  
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateTitleInput {
    name: String!
    description: String
    authorId: ObjectID!
    cover: String
    franchise: String
    translation: Translation
    status: Status
    alt_names: [String]
    content: ContentInput
    genreIds: [ObjectID]
    tagIds: [ObjectID]
  }

  input UpdateTitleInput {
    name: String
    description: String
    authorId: ObjectID
    cover: String
    franchise: String
    translation: Translation
    status: Status
    alt_names: [String]
    content: ContentInput
    genreIds: [ObjectID]
    tagIds: [ObjectID]
  }

  input ContentInput {
    volume: Int
    chapter: Int
    path: String
  }

  type Query {
    titles: [Title]
    getTitle(id: ObjectID!): Title
  }

  type Mutation {
    createTitle(input: CreateTitleInput!): Title
    updateTitle(id: ObjectID!, input: UpdateTitleInput!): Title
    deleteTitle(id: ObjectID!): Boolean
  }
`;
