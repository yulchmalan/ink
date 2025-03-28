import User from "../../models/user.model.js";
import { resolvers as scalarResolvers } from "graphql-scalars";

export const userResolvers = {
  Query: {
    async users() {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.error("error fetching users:", error);
      }
    },
  },
};
