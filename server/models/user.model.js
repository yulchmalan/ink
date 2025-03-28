import mongoose from "mongoose";

const savedTitleSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    last_open: {
      type: Date,
    },
    progres: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    titles: [savedTitleSchema],
  },
  { _id: false }
);

const friendSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    pfp: {
      type: String,
    },
    banner: {
      type: String,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    settings: settingsSchema,
    created: {
      type: Date,
      default: Date.now,
    },
    last_online: {
      type: Date,
    },
    lists: [listSchema],
    friends: [friendSchema],
    role: {
      type: String,
      enum: ["USER", "MODERATOR", "ADMIN", "OWNER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
