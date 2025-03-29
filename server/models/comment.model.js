import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    likes: Number,
    dislikes: Number,
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    score: scoreSchema,
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
