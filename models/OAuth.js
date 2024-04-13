const mongoose = require("mongoose");

const { Schema } = mongoose;

const oauthTokenSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    scope: {
      type: String,
    },
  },
  { timestamps: true }
);

const OAuthToken = mongoose.model("OAuthToken", oauthTokenSchema);

module.exports = OAuthToken;
