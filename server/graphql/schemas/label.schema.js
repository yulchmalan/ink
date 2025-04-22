export const labelTypeDefs = `#graphql
  enum LabelType {
    TAG
    GENRE
  }

  type Label {
    id: ObjectID!
    name: String!
    type: LabelType!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    labels: [Label]
    labelsByType(type: LabelType!): [Label] 
  }

  type Mutation {
    createLabel(name: String!, type: LabelType!): Label
    updateLabel(id: ObjectID!, name: String, type: LabelType): Label
    deleteLabel(id: ObjectID!): Boolean
  }
`;
