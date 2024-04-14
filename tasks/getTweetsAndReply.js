const fetch = require("node-fetch");

async function getTweetsAndReply() {
  const url =
    (process.env.PROD_URL || process.env.DEV_URL) +
    "/api/twitterActions/search_tweets";

  https: try {
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
