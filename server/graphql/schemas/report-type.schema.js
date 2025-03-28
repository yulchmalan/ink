export const reportTypeTypeDefs = `#graphql
    type ReportType {
        id: ObjectID!
        title: String
    }

    type Query {
        reportType: [ReportType]
    }
`;
