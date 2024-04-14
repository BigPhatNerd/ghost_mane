const express = require("express");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const router = express.Router();
const Twilio = require("twilio");
const {
  saveOAuthToken,
  isTokenExpired,
  getTweetURL,
} = require("../controller");
const { Client, auth } = require("twitter-api-sdk");
const { OAuthToken, Tweet, RepliedTweet } = require("../models");
const {
  tweetTemplatesWithNames,
  companyTweetTemplates,
  determineTweetTemplate,
} = require("../tweetArrays");
const { checkTweetTiming, companyReport } = require("../middleware");
const { getClient } = require("../utils/twitterClient");

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const authClient = new auth.OAuth2User({
  client_id: process.env.OAUTH2_CLIENT_ID,
  client_secret: process.env.OAUTH2_CLIENT_SECRET,
  callback: "http://lhrlslacktest.ngrok.io/api/twitterActions/oauth/callback",
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});
const client = new Client(authClient);

const STATE = process.env.STATE;
router.route("/oauth/callback").get(async (req, res) => {
  try {
    console.log("Callback route hit");
    const { code, state } = req.query;
    console.log({ code, state });
    if (state !== STATE) {
      return res.status(500).send("State isn't matching");
    }

    const authClientResponse = await authClient.requestAccessToken(code);
    const { token } = authClientResponse;

    const checkAuthTokenResponse = await saveOAuthToken(token);

    res.json({ authClientResponse, checkAuthTokenResponse });
  } catch (error) {
    console.log("Error in callback: ", error);
  }
});

router.route("/login").get(async (req, res) => {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "plain",
    code_challenge: "test",
  });
  res.redirect(authUrl);
});

router
  .route("/ghost_mane")
  .post(checkTweetTiming, companyReport, async (req, res) => {
    try {
      const user = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const client = await getClient();
      const { firstInitial, lastName, twitterHandle } = req.body;
      const tweetResponse = await client.tweets.createTweet({
        text: determineTweetTemplate({ lastName, firstInitial, twitterHandle }),
      });

      const recruiterName = lastName ? `${firstInitial}. ${lastName}` : "";
      if (tweetResponse.data) {
        const saveTweet = await Tweet.create({
          user,
          recruiterName: recruiterName,
          companyHandle: twitterHandle,
          tweetSent: tweetResponse.data.text,
          tweetId: tweetResponse.data.id,
        });
        const urlForTweet = getTweetURL(tweetResponse.data.id);

        try {
          const tweetCount = await Tweet.countDocuments({});
          if (tweetCount % 10 === 0) {
            await twilioClient.messages.create({
              body: `Ghostmane has sent ${tweetCount} tweets!👻`,
              from: process.env.TWILIO_NUMBER,
              to: process.env.MY_PHONE_NUMBER,
            });
          }
        } catch (twilioError) {
          console.error("Twilio error:", twilioError.message);
        }

        res.json({
          success: true,
          url: urlForTweet,
          tweetResponse: tweetResponse.data,
        });
      } else {
        res.json({ success: false, tweetResponse });
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
      res.status(500).send("Failed to post tweet");
    }
  });

router.route("/search_tweets").get(async (req, res) => {
  const thisClient = await getClient();
  console.log({ thisClient });
  const query =
    "(recruiter OR company)  ghosted -is:retweet -has:media  -is:reply";
  const maxResults = 10;

  let now = dayjs().utc();
  let endTime = now.subtract(10, "second").toISOString();
  let startTime = now.subtract(1, "day").toISOString();

  try {
    const lastReply = await RepliedTweet.findOne().sort({ createdAt: -1 });
    if (lastReply) {
      let lastReplyTime = dayjs(lastReply.createdAt).utc();
      if (lastReplyTime.add(1, "minute").isAfter(now.subtract(10, "seconds"))) {
        startTime = lastReplyTime.add(1, "minute").toISOString();
      }
    }
  } catch (err) {
    console.error("Error fetching last replied tweet time:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch last reply time" });
  }
  try {
    const { data: tweets, meta } = await thisClient.tweets.tweetsRecentSearch({
      query,
      max_results: maxResults,
      start_time: startTime,
      end_time: endTime,
    });
    let count = 0;
    for (let tweet of tweets) {
      const replyText = determineTweetTemplate({ url: "www.ghostmane.com" });

      const repliedTweet = await thisClient.tweets.createTweet({
        text: replyText,
        reply: {
          in_reply_to_tweet_id: tweet.id,
        },
      });
      console.log({ repliedTweet });
      await new RepliedTweet({
        tweetId: tweet.id,
        replyId: repliedTweet.data.id,
      }).save();
    }
    console.log({ tweets });
    res.json({ success: true, tweets });
  } catch (error) {
    console.error("Failed to search tweets:", error);
    res.json({ success: false, error });
  }
});

module.exports = router;
