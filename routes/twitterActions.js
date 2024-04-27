const express = require("express");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const router = express.Router();
const {
  saveOAuthToken,
  isTokenExpired,
  getTweetURL,
} = require("../controller");
const { Client, auth } = require("twitter-api-sdk");
const { OAuthToken, Tweet, RepliedTweet } = require("../models");
const { determineTweetTemplate } = require("../tweetArrays");
const { checkTweetTiming, companyReport } = require("../middleware");
const { initializeClient } = require("../utils/twitterClient");
const twilioClient = require("../utils/twilioClient");
const urlPrefix = process.env.PROD_URL || process.env.DEV_URL;
const url = urlPrefix + "/api/twitterActions/oauth/callback";
const authClient = new auth.OAuth2User({
  client_id: process.env.OAUTH2_CLIENT_ID,
  client_secret: process.env.OAUTH2_CLIENT_SECRET,
  callback: url,
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});
const client = new Client(authClient);

const STATE = process.env.STATE;

router.route("/login").get(async (req, res) => {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "plain",
    code_challenge: "test",
  });
  res.redirect(authUrl);
});

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

router
  .route("/ghost_mane")
  .post(checkTweetTiming, companyReport, async (req, res) => {
    try {
      const user = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const client = await initializeClient();

      if (!client) {
        return res.status(503).json({
          success: false,
          message: "Twitter client unavailable. Please try again later.",
        });
      }

      const { firstInitial, lastName, twitterHandle } = req.body;
      const tweetResponse = await client.tweets.createTweet({
        text: determineTweetTemplate(
          { lastName, firstInitial, twitterHandle } + " " + "#GhostMane"
        ),
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
  const thisClient = await initializeClient();

  if (!thisClient) {
    return res.status(503).json({
      success: false,
      message: "Twitter client unavailable. Please try again later.",
    });
  }

  const query =
    "(recruiter OR company)  ghosted -is:retweet -has:media  -is:reply";
  const maxResults = 50;

  let now = dayjs().utc();
  let endTime = now.subtract(11, "second").toISOString();
  let startTime = now.subtract(60, "minute").toISOString();

  try {
    const lastReply = await RepliedTweet.findOne().sort({ createdAt: -1 });
    if (lastReply) {
      let lastReplyTime = dayjs(lastReply.repliedAt).utc();
      if (lastReplyTime.isAfter(dayjs(startTime))) {
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
      "tweet.fields": "created_at,author_id,edit_history_tweet_ids",
      start_time: startTime,
      end_time: endTime,
    });

    console.log({ tweets, startTime, endTime });
    if (!tweets) {
      return res.json({ success: true, message: "No tweets were found 🥹" });
    }

    for (let tweet of tweets) {
      console.log({ tweet, startTime, endTime });
      const replyText = determineTweetTemplate({
        url: "https://www.ghost-mane.org/",
      });

      const existingTweet = await RepliedTweet.findOne({
        tweetId: tweet.id,
      });
      if (!existingTweet && tweet.edit_history_tweet_ids.length <= 1) {
        const repliedTweet = await thisClient.tweets.createTweet({
          text: replyText,
          reply: {
            in_reply_to_tweet_id: tweet.id,
          },
        });
        console.log({ repliedTweet });
        await new RepliedTweet({
          tweetId: tweet.id,
          replyText,
          inResponseToAuthor: tweet.author_id,
          inResponseToTweet: tweet.text,
          inResponseToTweetId: tweet.id,
          replyId: repliedTweet.data.id,
          repliedAt: new Date(),
          type: "recruiter",
        }).save();
      } else {
        console.log("Tweet already replied to", tweet.id);
      }
    }

    res.json({ success: true, tweets });
  } catch (error) {
    console.error("Failed to search tweets:", error);
    console.log(
      require("util").inspect(
        { errorObj: error?.error?.errors },
        false,
        null,
        true
      )
    );
    res.json({ success: false, error });
  }
});

module.exports = router;
