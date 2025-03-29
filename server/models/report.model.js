import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SENDED", "REVIEWED", "RESOLVED"],
      default: "SENDED",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
