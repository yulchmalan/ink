export const labelTypeDefs = `#graphql
    enum LabelType {
        TAG
        GENRE
    }

    type Label {
        id: ObjectID!
        name: String
        type: LabelType
    }

    type Query {
        label: [Label]
    }
`;
