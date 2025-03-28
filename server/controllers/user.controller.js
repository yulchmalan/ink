//це видалити коли допишу графкл

import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(`error in fetching user: ${error}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createUsers = async (req, res) => {
  const user = req.body;
  if (!user.name) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all fields" });
  }
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error(`error in creating user: ${error}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUsers = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json({ success: true, data: "User updated" });
  } catch (error) {
    console.error(`error in updating user: ${error}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUsers = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: "User deleted" });
  } catch (error) {
    console.error(`error in deleting user: ${error}`);
    res.status(404).json({ success: false, message: "User not found" });
  }
};
