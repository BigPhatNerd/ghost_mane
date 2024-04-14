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
    console.log({ token, authClient });
    if (
      !token.accessToken ||
      !token.refreshToken ||
      (await isTokenExpired(token.expiresAt))
    ) {
      authClient.token = {
        refresh_token: token.refreshToken,
      };
      console.log({ authClientToken: authClient.token });
      const refreshedToken = await authClient.refreshAccessToken();
      console.log({ refreshedToken });
      await saveOAuthToken(refreshedToken.token);
      authClient.token = refreshedToken.token;
      console.log(
        "\n\n\n\nmake sure this matches the one below with access_token, refresh_token, token_type, expires_at, etc: ",
        { authClient: authClient.token }
      );
    } else {
      console.log(
        "\n\n\n\nWhy the fuck is this one being hit and what is the token?"
      );
      authClient.token = {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        token_type: "bearer",
        expires_at: token.expiresAt,
      };
    }

    client = new Client(authClient);
    return client;
  } catch (error) {
    console.error("Failed to initialize Twitter client: ", error);
    throw error;
  }
}

async function getClient() {
  if (!client) {
    console.log("\n\n\napparently there is no client: ", { client });
    await initializeClient();
  }
  console.log("\n\n\n apparently there is a client (is it a shitty one?: ", {
    client,
  });
  return client;
}

module.exports = { getClient };
