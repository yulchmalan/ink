import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    bio: String,
    photo: String,
    alt_names: [String],
    subscribers: [String],
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

export default Author;
