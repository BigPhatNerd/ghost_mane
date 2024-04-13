const { Tweet } = require("../models");
const checkTweetTiming = async (req, res, next) => {
  const user = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { twitterHandle } = req.body;
  const hoursLimit = 24;

  const dateLimit = new Date(
    new Date().getTime() - hoursLimit * 60 * 60 * 1000
  );

  try {
    const recentTweet = await Tweet.findOne({
      user,
      companyHandle: twitterHandle,
      createdAt: { $gte: dateLimit },
    });

    if (recentTweet) {
      return res.status(403).json({
        success: false,
        message: "You can only tweet a specific company once every 24 hours",
      });
    }
    next();
  } catch (error) {
    console.error("Database error in checkTweetTiming middleware:", error);
    res.status(500).send("Error checking tweet timing");
  }
};

module.exports = { checkTweetTiming };
