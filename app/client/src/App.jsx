import { useState } from "react";
import ghostImage from "./img/ghost_img.png";
import axios from "axios";
import TweetCard from "./TweetCard";
import Modal from "./Modal";

import "./App.css";

function App() {
  const [firstInitial, setFirstInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleFirstInitialChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFirstInitial(value);
    validateFirstInitial(value, lastName);
    setShowCard(false);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    const capitalizedValue =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setLastName(capitalizedValue);
    validateLastName(capitalizedValue, firstInitial);
    setShowCard(false);
  };

  const handleTwitterHandleChange = (e) => {
    const value = e.target.value;
    setTwitterHandle(value);
    validateTwitterHandle(value);
    setShowCard(false);
  };

  const validateFirstInitial = (value, lastName) => {
    let newErrors = { ...errors };
    console.log({ value, lastName });
    if (value && !value.match(/^[A-Z]$/)) {
      newErrors.firstInitial = "Must be a single uppercase letter";
    } else if (value && !lastName) {
      newErrors.lastName =
        "Last name is required if first initial is provided.";
    } else if (!value && lastName) {
      newErrors.firstInitial =
        "First initial is required if last name is provided.";
    } else {
      delete newErrors.firstInitial;
      if (lastName || !value) delete newErrors.lastName;
    }

    setErrors(newErrors);
  };

  const validateLastName = (value, firstInitial) => {
    console.log({ value, firstInitial });
    let newErrors = { ...errors };
    if (value && !firstInitial) {
      newErrors.firstInitial =
        "First initial is required if last name is provided.";
    } else if (!value && firstInitial) {
      newErrors.lastName =
        "Last name is required if first initial is provided.";
    } else {
      delete newErrors.lastName;
      if (firstInitial || !value) delete newErrors.firstInitial;
    }
    setErrors(newErrors);
  };

  const validateTwitterHandle = (value) => {
    let newErrors = { ...errors };
    if (!value) {
      newErrors.twitterHandle = "Twitter handle is required.";
    } else if (!value.startsWith("@")) {
      newErrors.twitterHandle = "Twitter handle must start with '@'.";
    } else if (value.length < 3) {
      newErrors.twitterHandle =
        "Twitter handle must be at least 2 characters long.";
    } else {
      delete newErrors.twitterHandle;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/twitterActions/ghost_mane`, {
        firstInitial,
        lastName,
        twitterHandle,
      });

      if (response.data.success) {
        setSubmissionMessage(response.data);
        setShowCard(true);
        setFirstInitial("");
        setLastName("");
        setTwitterHandle("");
      } else if (
        !response.data.success &&
        response.data.message ===
          "You can only tweet a specific company once every 24 hours"
      ) {
        messageWithTimeout(
          "You can only tweet a specific company once every 24 hours",
          5000
        );
      } else if (
        !response.data.success &&
        response.data.message ===
          "Twitter client unavailable. Please try again later."
      ) {
        messageWithTimeout(
          "Twitter client unavailable. Please try again later.",
          5000
        );
      } else {
        messageWithTimeout(
          "There was an error sending your tweet. Please try again later.",
          5000
        );
      }
      setIsSubmitting(false);
    } catch (error) {
      if (error.response) {
        const serverMessage =
          error.response.data || "There was an error processing your request.";
        messageWithTimeout(serverMessage, 5000);
      } else {
        console.error("There was a problem with your Axios operation:", error);

        messageWithTimeout(
          "There was an error sending your tweet. Please try again later.",
          5000
        );
      }
      setIsSubmitting(false);
    }
  };

  const messageWithTimeout = (message, timeout) => {
    setMessage(message);
    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage("");
      message;
    }, timeout);
    setFirstInitial("");
    setLastName("");
    setTwitterHandle("");
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="App">
      <img src={ghostImage} alt="Ghost" className="ghost-image" />
      <div className="app-description">
        <p>
          {/* This tool is designed for job applicants who were promised a follow-up
          from recruiters or company representatives within a specified time
          frame but did not receive any communication. Our app will send an
          anonymous tweet to the relevant company or recruiter on your behalf,
          holding them accountable, publicly. */}
          Help us hold companies accountable for ghosting applicants by sending
          an anonymous tweet.
          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <div>
              <h2>How it works</h2>
              <p>
                This tool is designed for job applicants who were promised a
                follow-up from recruiters or company representatives within a
                specified time frame but did not receive any communication. Our
                app will send an anonymous tweet to the relevant company or
                recruiter on your behalf, holding them accountable, publicly.
              </p>
              <h2>How to use</h2>
              <p>
                Enter the recruiter's first initial, last name, and the
                company's Twitter handle. We will generate a tweet for you to
                send to the company.
              </p>
              <h2>Important</h2>
              <p>
                Please note: Tweets to the same company from the same user can
                only be sent once per day to maintain professionalism and
                effectiveness.
              </p>
            </div>
          </Modal>
          <br />
          <br />{" "}
          <em>
            <b>
              {/* Please note: Tweets to the same company from the same user can only
            be sent once per day to maintain professionalism and effectiveness. */}
              Please note: 1 tweet per company per day from the same user.
            </b>
          </em>
        </p>
        <button onClick={toggleModal}>More Info</button>
      </div>
      {isMessageVisible && <div className="error-response">{message}</div>}
      <form className="input-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Recruiter's First Initial"
            value={firstInitial}
            maxLength="1"
            onChange={handleFirstInitialChange}
          />
          {errors.firstInitial && (
            <div className="error">{errors.firstInitial}</div>
          )}
          <input
            type="text"
            placeholder="Recruiter's Last Name"
            value={lastName}
            maxLength="50"
            onChange={handleLastNameChange}
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
          <input
            type="text"
            placeholder="Company Twitter Handle"
            value={twitterHandle}
            onChange={handleTwitterHandleChange}
          />
          {errors.twitterHandle && (
            <div className="error">{errors.twitterHandle}</div>
          )}
          <button
            style={{ height: "40px", padding: "10px 20px" }}
            type="submit"
            disabled={Object.keys(errors).length > 0 || !twitterHandle}
          >
            {console.log(Object.keys(errors).length > 0)}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>{" "}
      </form>

      {!submissionMessage?.success && submissionMessage?.tweetResponse && (
        <div className="error-response">{message}</div>
      )}
      {console.log({ submissionMessage })}
      {showCard && (
        <>
          <TweetCard
            username="ghost_mane___"
            content={submissionMessage?.tweetResponse?.text}
            url={submissionMessage?.url}
            ghostImage={ghostImage}
          ></TweetCard>
          <a
            href={submissionMessage?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="view-tweet-link"
          >
            Click here to view your tweet
          </a>
          <br />
          <br />
        </>
      )}
    </div>
  );
}

{
  /* <script
  data-name="BMC-Widget"
  data-cfasync="false"
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-id="ghostMane"
  data-description="Support me on Buy me a coffee!"
  data-message=""
  data-color="#5F7FFF"
  data-position="Right"
  data-x_margin="18"
  data-y_margin="18"
></script>; */
}

export default App;
