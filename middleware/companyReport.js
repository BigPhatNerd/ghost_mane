const { CompanyReport } = require("../models");

async function companyReport(req, res, next) {
  const twitterHandle = req.body.twitterHandle;

  try {
    let report = await CompanyReport.findOne({ twitterHandle });

    if (report) {
      await report.incrementReports();
    } else {
      report = await CompanyReport.create({ twitterHandle });
      await report.save();
    }

    req.report = report = report;
    next();
  } catch (error) {
    console.error("Failed to handle company report: ", error);
    res.status(500).send("Internal server error while handling company report");
  }
}

module.exports = { companyReport };
