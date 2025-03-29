import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    volume: {
      type: Number,
      required: true,
    },
    chapter: {
      type: Number,
      required: true,
    },
    path: String,
  },
  { _id: false }
);

const titleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cover: {
      type: String,
    },
    francise: {
      type: String,
    },
    translation: {
      type: String,
      enum: ["TRANSLATED", "IN_PROGRESS", "NOT_TRANSLATED"],
      default: "NOT_TRANSLATED",
    },
    status: {
      type: String,
      enum: ["COMPLETED", "ONGOING", "ANNOUNCED"],
      default: "ANNOUNCED",
    },
    alt_names: {
      type: [String],
    },
    content: contentSchema,
  },
  { timestamps: true }
);

const Title = mongoose.model("Title", titleSchema);

export default Title;
