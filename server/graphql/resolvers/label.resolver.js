import Label from "../../models/label.model.js";

export const labelResolvers = {
  Query: {
    async Labels() {
      try {
        const labels = await Label.find();
        return labels;
      } catch (error) {
        console.error("error fetching labels:", error);
      }
    },
  },
};
