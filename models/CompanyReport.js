const mongoose = require("mongoose");

const companyReportSchema = new mongoose.Schema({
  twitterHandle: {
    type: String,
    required: true,
    unique: true,
  },
  reportsCount: {
    type: Number,
    default: 1,
  },
  lastReported: {
    type: Date,
    default: Date.now,
  },
});

companyReportSchema.methods.incrementReports = async function () {
  this.reportsCount++;
  this.lastReported = Date.now();
  await this.save();
};

const CompanyReport = mongoose.model("CompanyReport", companyReportSchema);

module.exports = CompanyReport;
