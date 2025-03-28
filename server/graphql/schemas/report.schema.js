export const reportTypeDefs = `#graphql
    enum ReportStatus {
        SENDING
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
