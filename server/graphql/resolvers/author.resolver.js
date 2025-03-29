import Author from "../../models/author.model.js";

export const authorResolvers = {
  Query: {
    async authors() {
      try {
        const authors = await Author.find();
        return authors;
      } catch (error) {
        console.error("error fetching authors:", error);
      }
    },
  },
};
