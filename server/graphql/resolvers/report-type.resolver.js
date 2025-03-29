import ReportType from "../../models/report-type.model.js";

export const reportTypeResolvers = {
  Query: {
    async reportTypes() {
      try {
        const reportTypes = await ReportType.find();
        return reportTypes;
      } catch (error) {
        console.error("error fetching reportTypes:", error);
      }
    },
  },
};
