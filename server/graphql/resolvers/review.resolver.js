import Review from "../../models/review.model.js";

export const reviewResolvers = {
  Query: {
    async reviews() {
      try {
        const reviews = await Review.find();
        return reviews;
      } catch (error) {
        console.error("error fetching reviews:", error);
      }
    },
  },
};
