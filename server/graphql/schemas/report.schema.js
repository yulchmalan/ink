export const reportTypeDefs = `#graphql
    enum ReportStatus {
        SENDED
        REVIEWED
        RESOLVED
    }

    type Report {
        id: ObjectID!
        # user_ID: ObjectID
        # subject_ID: ObjectID
        # reason_ID: ObjectID
        body: String
        status: ReportStatus
    }

    type Query {
        reports: [Report]
    }
`;
