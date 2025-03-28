import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from "graphql-scalars";
import { titleTypeDefs } from "./schemas/title.schema.js";
import { authorTypeDefs } from "./schemas/author.schema.js";
import { reviewTypeDefs } from "./schemas/review.schema.js";
import { reportTypeDefs } from "./schemas/report.schema.js";
import { reportTypeTypeDefs } from "./schemas/report-type.schema.js";
import { labelTypeDefs } from "./schemas/label.schema.js";
import { commentTypeDefs } from "./schemas/comment.schema.js";
import { userTypeDefs } from "./schemas/user.schema.js";
import { userResolvers } from "./resolvers/user.resolver.js";

const typeDefs = mergeTypeDefs([
  ...scalarTypeDefs,
  titleTypeDefs,
  authorTypeDefs,
  reviewTypeDefs,
  reportTypeDefs,
  reportTypeTypeDefs,
  labelTypeDefs,
  commentTypeDefs,
  userTypeDefs,
]);

const resolvers = mergeResolvers([scalarResolvers, userResolvers]);

export { typeDefs, resolvers };
