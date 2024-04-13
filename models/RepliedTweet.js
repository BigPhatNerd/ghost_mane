const mongoose = require("mongoose");

const repliedTweetSchema = new mongoose.Schema({
  tweetId: {
    type: String,
    required: true,
    unique: true,
  },
  replyId: {
    type: String,
    required: true,
  },
  repliedAt: {
    type: Date,
    default: Date.now,
  },
});

const RepliedTweet = mongoose.model("RepliedTweet", repliedTweetSchema);

module.exports = RepliedTweet;
