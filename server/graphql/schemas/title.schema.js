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
        # author_ID: ObjectID!
        cover: String
        francise: String
        translation: Translation
        status: Status
        # labels: [ObjectID]
        alt_names: [String]
        content: Content
    }

    type Query {
        titles: [Title]
    }
`;
