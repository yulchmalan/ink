export const authorTypeDefs = `#graphql
    type Author {
        id: ObjectID!
        name: String!
        alt_names: [String]
        bio: String
        # titles: [ObjectID]
        subscribers: [String]
        photo: String
    }

    type Query {
        authors: [Author]
    }
`;
