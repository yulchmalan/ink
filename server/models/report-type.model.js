import mongoose from "mongoose";

const reportTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const ReportType = mongoose.model("ReportType", reportTypeSchema);

export default ReportType;
