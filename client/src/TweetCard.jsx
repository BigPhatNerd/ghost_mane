import "./TweetCard.css"; // Make sure to import the CSS for styling

const TweetCard = ({ username, content, url, ghostImage }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parseContent = (content) => {
    const regex = /(@[a-zA-Z0-9_]+)/g; // Regex to find @mentions
    return content.split(regex).map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="twitter-handle">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="tweet-card-link"
    >
      <div className="tweet-card">
        <div className="tweet-profile-pic">
          <img src={ghostImage} alt="Profile" />
        </div>
        <div className="tweet-body">
          <div className="tweet-header">
            <span className="tweet-author">@{username}</span>
            <span className="tweet-date">{currentDate}</span>
          </div>
          <p className="tweet-content">{parseContent(content)}</p>
        </div>
      </div>
    </a>
  );
};

export default TweetCard;
