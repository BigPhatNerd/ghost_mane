const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true,
  },
  recruiterName: {
    type: String,
    time: true,
  },
  companyHandle: {
    type: String,
    required: true,
    trim: true,
  },
  tweetSent: {
    type: String,
    required: true,
    trim: true,
  },
  tweetId: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
