import User from "../../models/user.model.js";
import Review from "../../models/review.model.js";
import Comment from "../../models/comment.model.js";
import Title from "../../models/title.model.js";
import { ObjectId } from "mongodb";

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
    async user(parent, args) {
      try {
        const user = await User.findById(args.id);
        return user;
      } catch (error) {
        console.error("error fetching user:", error);
      }
    },
  },
  User: {
    async reviews(parent) {
      try {
        const reviewIds = parent.reviews;
        const reviews = await Review.find({ _id: { $in: reviewIds } });
        return reviews;
      } catch (error) {
        console.error("error fetching user's reviews:", error);
      }
    },
    // async comments(parent) {
    //   try {
    //     const commentIds = parent.comments;
    //     const comments = await Comment.find({ _id: { $in: commentIds } });
    //     return comments;
    //   } catch (error) {
    //     console.error("error fetching user's comments:", error);
    //   }
    // },
    // async recommendations(parent) {
    //   try {
    //     const recommendationIds = parent.recommendations;
    //     const recommendations = await Title.find({
    //       _id: { $in: recommendationIds },
    //     });
    //     return recommendations;
    //   } catch (error) {
    //     console.error("error fetching user's recommendations:", error);
    //   }
    // },
  },
  // Mutation: {
  //   async deleteUser(_, args) {
  //     try {
  //       const user = await User.findByIdAndDelete(args.id);
  //       return user;
  //     } catch (error) {
  //       console.error("error deleting user:", error);
  //     }
  //   },
  //   async addUser(_, args) {
  //     try {
  //       let user = {
  //         ...args.user,
  //         settings: { ...args.user.settings },
  //         created: new Date(),
  //         _id: new ObjectId(),
  //       };
  //       const savedUser = await User.create(user);
  //       return savedUser;
  //     } catch (error) {
  //       console.error("error adding user:", error);
  //     }
  //   },
  // },
};
