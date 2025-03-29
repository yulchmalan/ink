import mongoose from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["TAG", "GENRE"],
      required: true,
    },
  },
  { timestamps: true }
);

const Label = mongoose.model("Label", labelSchema);

export default Label;
