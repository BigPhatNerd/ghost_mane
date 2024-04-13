const getTweetURL = (tweetId) => {
  const baseUrl = "https://twitter.com/ghost_mane__/status";
  return `${baseUrl}/${tweetId}`;
};

module.exports = getTweetURL;
