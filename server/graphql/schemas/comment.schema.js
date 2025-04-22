export const commentTypeDefs = `#graphql
    type Score {
        likes: Int
        dislikes: Int
    }

    type Comment {
        id: ObjectID!
        user_ID: ObjectID
        subject_ID: ObjectID
        body: String
        parent_ID: ObjectID
        score: Score
    }

    type Query {
        comments: [Comment]
    }
`;
