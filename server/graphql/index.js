import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import { titleTypeDefs } from "./schemas/title.schema.js";
import { authorTypeDefs } from "./schemas/author.schema.js";
import { reviewTypeDefs } from "./schemas/review.schema.js";
import { reportTypeDefs } from "./schemas/report.schema.js";
import { reportTypeTypeDefs } from "./schemas/report-type.schema.js";
import { labelTypeDefs } from "./schemas/label.schema.js";
import { commentTypeDefs } from "./schemas/comment.schema.js";

const typeDefs = mergeTypeDefs([
  scalarTypeDefs,
  titleTypeDefs,
  authorTypeDefs,
  reviewTypeDefs,
  reportTypeDefs,
  reportTypeTypeDefs,
  labelTypeDefs,
  commentTypeDefs,
]);

const resolvers = mergeResolvers([scalarResolvers]);

export { typeDefs, resolvers };
