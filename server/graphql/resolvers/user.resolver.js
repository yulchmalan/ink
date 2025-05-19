import User from "../../models/user.model.js";
import Review from "../../models/review.model.js";
import Comment from "../../models/comment.model.js";
import Title from "../../models/title.model.js";

const DEFAULT_LISTS = [
  "reading",
  "planned",
  "completed",
  "dropped",
  "favorite",
];

export const userResolvers = {
  Query: {
    async users(
      _,
      {
        limit = 10,
        offset = 0,
        role,
        sortBy = "created",
        sortOrder = "desc",
        search,
      }
    ) {
      try {
        const filter = {};

        if (role) filter.role = role;
        if (search) filter.username = { $regex: search, $options: "i" }; // пошук по username

        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        return await User.find(filter).sort(sort).skip(offset).limit(limit);
      } catch (error) {
        console.error("error fetching users:", error.message);
        throw new Error("Failed to fetch users");
      }
    },

    async user(_, { id }) {
      try {
        return await User.findById(id);
      } catch (error) {
        console.error("error fetching user:", error.message);
        throw new Error("Failed to fetch user");
      }
    },
  },

  Mutation: {
    async addUser(_, { user }) {
      try {
        const createdUser = await User.create({
          ...user,
          created: new Date(),
          lists: DEFAULT_LISTS.map((name) => ({ name, titles: [] })),
        });
        return createdUser;
      } catch (error) {
        console.error("error adding user:", error.message);
        throw new Error("Failed to create user");
      }
    },

    async updateUser(_, { id, edits }) {
      try {
        const updates = {};
        if (edits.username !== undefined) updates.username = edits.username;
        if (edits.email !== undefined) updates.email = edits.email;
        if (edits.password_hash !== undefined)
          updates.password_hash = edits.password_hash;
        if (edits.settings !== undefined) updates.settings = edits.settings;
        if (edits.last_online !== undefined)
          updates.last_online = edits.last_online;
        if (edits.role !== undefined) updates.role = edits.role;

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
          new: true,
        });

        if (!updatedUser) throw new Error("User not found");

        return updatedUser;
      } catch (error) {
        console.error("error updating user:", error.message);
        throw new Error("Failed to update user");
      }
    },

    async deleteUser(_, { id }) {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        return !!deletedUser;
      } catch (error) {
        console.error("error deleting user:", error.message);
        throw new Error("Failed to delete user");
      }
    },

    addCustomList: async (_, { userId, input }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.lists.push({ name: input.name, titles: [] });
      await user.save();

      return user.lists;
    },

    addTitleToList: async (_, { userId, input }) => {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const { listName, titleId } = input;

      user.lists.forEach((list) => {
        list.titles = list.titles.filter(
          (entry) => entry.title.toString() !== titleId
        );
      });

      const targetList = user.lists.find((l) => l.name === listName);
      if (!targetList) throw new Error("List not found");

      const alreadyExists = targetList.titles.some(
        (entry) => entry.title.toString() === titleId
      );

      if (!alreadyExists) {
        targetList.titles.push({
          title: titleId,
          rating: 0,
          progress: 0,
        });
      }

      user.markModified("lists");
      await user.save();

      return user.lists;
    },
  },

  User: {
    reviews: async (parent) => {
      return await Review.find({ _id: { $in: parent.reviews } });
    },
    comments: async (parent) => {
      return await Comment.find({ _id: { $in: parent.comments } });
    },
    recommendations: async (parent) => {
      return await Title.find({ _id: { $in: parent.recommendations } });
    },
  },

  SavedTitle: {
    title: async (parent) => {
      if (!parent.title) return null;
      try {
        return await Title.findById(parent.title);
      } catch (err) {
        console.error("Failed to resolve SavedTitle.title:", err);
        return null;
      }
    },
  },
};
