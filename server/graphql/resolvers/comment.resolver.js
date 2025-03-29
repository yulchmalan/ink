import Comment from "../../models/comment.model.js";

export const commentResolvers = {
  Query: {
    async comments() {
      try {
        const comments = await Comment.find();
        return comments;
      } catch (error) {
        console.error("error fetching comments:", error);
      }
    },
  },
};
