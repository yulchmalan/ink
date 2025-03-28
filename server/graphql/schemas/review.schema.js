export const reviewTypeDefs = `#graphql
    type Score {
        likes: Int
        dislikes: Int
    }

    type Review {
        _id: ObjectID!
        name: String
        body: String
        rating: Int
        # comments: [ObjectID]
        # user_ID: ObjectID
        views: Int
        # subject_ID: ObjectID
        score: Score
    }

    type Query {
        reviews: [Review]
    }
`;
