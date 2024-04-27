// File: /utils/twitterClient.js

const { Client, auth } = require("twitter-api-sdk");
const { OAuthToken } = require("../models");
const { saveOAuthToken, isTokenExpired } = require("../controller");
const twilioClient = require("./twilioClient");

const authClient = new auth.OAuth2User({
  client_id: process.env.OAUTH2_CLIENT_ID,
  client_secret: process.env.OAUTH2_CLIENT_SECRET,
  callback:
    (process.env.PROD_URL || process.env.DEV_URL) +
    "/api/twitterActions/oauth/callback",
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});

let client;

async function initializeClient() {
  try {
    const token = await OAuthToken.findOne();
    if (!token) {
      throw new Error("No OAuth token found");
    }

    authClient.token = {
      refresh_token: token.refreshToken,
    };

    const refreshedToken = await authClient.refreshAccessToken();

    await saveOAuthToken(refreshedToken.token);
    authClient.token = refreshedToken.token;
    client = new Client(authClient);
    return client;
  } catch (error) {
    console.error("Failed to initialize Twitter client: ", error);
    await twilioClient.messages.create({
      body: `Twitter client fucked up again: ${error} `,
      from: process.env.TWILIO_NUMBER,
      to: process.env.MY_PHONE_NUMBER,
    });
    throw error;
  }
}

module.exports = { initializeClient };
