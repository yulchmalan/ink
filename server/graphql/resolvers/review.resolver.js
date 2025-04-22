import Review from "../../models/review.model.js";
import User from "../../models/user.model.js";
import Title from "../../models/title.model.js";
import Comment from "../../models/comment.model.js";

export const reviewResolvers = {
  Query: {
    async reviews() {
      try {
        return await Review.find();
      } catch (error) {
        console.error("error fetching reviews:", error.message);
        throw new Error("Failed to fetch reviews");
      }
    },

    async review(_, { id }) {
      try {
        return await Review.findById(id);
      } catch (error) {
        console.error("error fetching review:", error.message);
        throw new Error("Failed to fetch review");
      }
    },
  },

  Mutation: {
    async createReview(_, { input }) {
      try {
        const { name, body, rating, userId, titleId } = input;

        const newReview = await Review.create({
          name,
          body,
          rating,
          user_ID: userId,
          title_ID: titleId,
          views: 0,
          score: { likes: 0, dislikes: 0 },
        });

        await User.findByIdAndUpdate(userId, {
          $push: { reviews: newReview._id },
        });

        return newReview;
      } catch (error) {
        console.error("error creating review:", error.message);
        throw new Error("Failed to create review");
      }
    },

    async editReview(_, { id, edits }) {
      try {
        const updated = await Review.findByIdAndUpdate(id, edits, {
          new: true,
        });
        return updated;
      } catch (error) {
        console.error("error editing review:", error.message);
        throw new Error("Failed to edit review");
      }
    },

    async deleteReview(_, { id }) {
      try {
        const deleted = await Review.findByIdAndDelete(id);
        return !!deleted;
      } catch (error) {
        console.error("error deleting review:", error.message);
        throw new Error("Failed to delete review");
      }
    },

    async likeReview(_, { id }) {
      try {
        const updated = await Review.findByIdAndUpdate(
          id,
          { $inc: { "score.likes": 1 } },
          { new: true }
        );
        return updated;
      } catch (error) {
        console.error("error liking review:", error.message);
        throw new Error("Failed to like review");
      }
    },

    async dislikeReview(_, { id }) {
      try {
        const updated = await Review.findByIdAndUpdate(
          id,
          { $inc: { "score.dislikes": 1 } },
          { new: true }
        );
        return updated;
      } catch (error) {
        console.error("error disliking review:", error.message);
        throw new Error("Failed to dislike review");
      }
    },
  },

  Review: {
    async user(parent) {
      return await User.findById(parent.user_ID);
    },
    async title(parent) {
      return await Title.findById(parent.title_ID);
    },
    async comments(parent) {
      return await Comment.find({ _id: { $in: parent.comments } });
    },
  },
};
