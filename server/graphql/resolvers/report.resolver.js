import Report from "../../models/report.model.js";
import User from "../../models/user.model.js";
import ReportType from "../../models/report-type.model.js";

export const reportResolvers = {
  Query: {
    async reports() {
      try {
        return await Report.find();
      } catch (error) {
        console.error("error fetching reports:", error.message);
        throw new Error("Failed to fetch reports");
      }
    },

    async report(_, { id }) {
      try {
        return await Report.findById(id);
      } catch (error) {
        console.error("error fetching report:", error.message);
        throw new Error("Failed to fetch report");
      }
    },

    reportsByStatus: async (_, { status }) => {
      try {
        return await Report.find({ status });
      } catch (error) {
        console.error("error fetching reports by status:", error.message);
        throw new Error("Failed to fetch filtered reports");
      }
    },
  },

  Mutation: {
    async createReport(_, { input }) {
      try {
        const { userId, subjectId, reasonId, body } = input;

        const report = await Report.create({
          user_ID: userId,
          subject_ID: subjectId,
          reason_ID: reasonId,
          body,
        });

        return report;
      } catch (error) {
        console.error("error creating report:", error.message);
        throw new Error("Failed to create report");
      }
    },

    async deleteReport(_, { id }) {
      try {
        const deleted = await Report.findByIdAndDelete(id);
        return !!deleted;
      } catch (error) {
        console.error("error deleting report:", error.message);
        throw new Error("Failed to delete report");
      }
    },

    async updateReportStatus(_, { id, status }) {
      try {
        const updated = await Report.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        return updated;
      } catch (error) {
        console.error("error updating report status:", error.message);
        throw new Error("Failed to update status");
      }
    },
  },

  Report: {
    async user(parent) {
      return await User.findById(parent.user_ID);
    },
    async reason(parent) {
      return await ReportType.findById(parent.reason_ID);
    },
  },
};
