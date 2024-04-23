const fetch = require("node-fetch");
require("dotenv").config();
async function getTweetsAndReply() {
  const baseURL = process.env.PROD_URL || process.env.DEV_URL;
  const test = process.env.DEV_URL;
  console.log({ baseURL, test });
  const url = baseURL + "/api/twitterActions/search_tweets";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Gettin and sending tweets...");
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

module.exports = getTweetsAndReply;

if (require.main === module) {
  getTweetsAndReply();
}

// The if (require.main === module) { getTweetsAndReply(); } part ensures that
// getTweetsAndReply() is called when the file is executed directly (e.g., by
// Node.js or a Heroku job), but not when it's required by another file, which
// is useful for testing.
