const { OAuthToken } = require("../models");

const saveOAuthToken = async (token) => {
  const { access_token, token_type, expires_at, scope, refresh_token } = token;
  try {
    const savedToken = await OAuthToken.findOneAndUpdate(
      {},
      {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
        scope,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return savedToken;
  } catch (err) {
    console.error("Problem saving token: ", err.message);
  }
};

module.exports = saveOAuthToken;
