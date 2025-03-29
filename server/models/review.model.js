import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    likes: Number,
    dislikes: Number,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    views: {
      type: Number,
    },
    score: scoreSchema,
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
