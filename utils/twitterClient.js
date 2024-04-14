// File: /utils/twitterClient.js

const { Client, auth } = require("twitter-api-sdk");
const { OAuthToken } = require("../models");
const { saveOAuthToken, isTokenExpired } = require("../controller");

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
    throw error;
  }
}

async function getClient() {
  if (!client) {
    await initializeClient();
  }
  return client;
}

module.exports = { getClient };
