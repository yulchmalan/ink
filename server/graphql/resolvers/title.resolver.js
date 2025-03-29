import Title from "../../models/title.model.js";

export const titleResolvers = {
  Query: {
    async titles() {
      try {
        const titles = await Title.find();
        return titles;
      } catch (error) {
        console.error("error fetching titles:", error);
      }
    },
  },
};
