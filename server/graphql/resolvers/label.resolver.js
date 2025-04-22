import Label from "../../models/label.model.js";

export const labelResolvers = {
  Query: {
    async labels() {
      try {
        return await Label.find();
      } catch (error) {
        console.error("error fetching labels:", error);
        throw new Error("Failed to fetch labels");
      }
    },

    async labelsByType(_, { type }) {
      try {
        return await Label.find({ type });
      } catch (error) {
        console.error("error filtering labels:", error);
        throw new Error("Failed to fetch labels by type");
      }
    },
  },

  Mutation: {
    async createLabel(_, { name, type }) {
      try {
        const existing = await Label.findOne({ name, type });
        if (existing) {
          throw new Error("Label with same name and type already exists");
        }

        return await Label.create({ name, type });
      } catch (error) {
        console.error("error creating label:", error);
        throw new Error("Failed to create label");
      }
    },
    async updateLabel(_, { id, name, type }) {
      try {
        const updated = await Label.findByIdAndUpdate(
          id,
          {
            ...(name !== undefined && { name }),
            ...(type !== undefined && { type }),
          },
          { new: true } // повертає оновлений документ
        );

        if (!updated) {
          throw new Error("Label not found");
        }

        return updated;
      } catch (error) {
        console.error("error updating label:", error);
        throw new Error("Failed to update label");
      }
    },

    async deleteLabel(_, { id }) {
      try {
        const deleted = await Label.findByIdAndDelete(id);
        if (!deleted) {
          throw new Error("Label not found");
        }
        return true;
      } catch (error) {
        console.error("error deleting label:", error);
        throw new Error("Failed to delete label");
      }
    },
  },
};
