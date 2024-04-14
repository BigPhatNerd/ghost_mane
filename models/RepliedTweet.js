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
  replyText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  repliedAt: {
    type: Date,
  },
  inResponseToAuthor: {
    type: String,
  },
  inResponseToTweet: {
    type: String,
  },
  inResponseToTweetId: {
    type: String,
  },
});

const RepliedTweet = mongoose.model("RepliedTweet", repliedTweetSchema);

module.exports = RepliedTweet;
