export const reportTypeDefs = `#graphql
  enum ReportStatus {
    SENDED
    REVIEWED
    RESOLVED
  }

  type Report {
    id: ObjectID!
    user: User!
    subject_ID: ObjectID!
    reason: ReportType!
    body: String!
    status: ReportStatus!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    reports: [Report!]!
    report(id: ObjectID!): Report
    reportsByStatus(status: ReportStatus!): [Report!]!
  }

  input CreateReportInput {
    userId: ObjectID!
    subjectId: ObjectID!
    reasonId: ObjectID!
    body: String!
  }

  type Mutation {
    createReport(input: CreateReportInput!): Report
    updateReportStatus(id: ObjectID!, status: ReportStatus!): Report
    deleteReport(id: ObjectID!): Boolean
  }
`;
