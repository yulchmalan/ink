export const reportTypeTypeDefs = `#graphql
  type ReportType {
    id: ObjectID!
    title: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    reportTypes: [ReportType!]!
    reportType(id: ObjectID!): ReportType
  }

  input CreateReportTypeInput {
    title: String!
  }

  type Mutation {
    createReportType(input: CreateReportTypeInput!): ReportType
    deleteReportType(id: ObjectID!): Boolean
  }
`;
