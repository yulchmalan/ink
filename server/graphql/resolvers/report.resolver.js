import Reports from "../../models/report.model.js";

export const reportResolvers = {
  Query: {
    async reports() {
      try {
        const reports = await Reports.find();
        return reports;
      } catch (error) {
        console.error("error fetching reports:", error);
      }
    },
  },
};
