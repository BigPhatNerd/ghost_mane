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
  const [type, setType] = useState("");

  const handleFirstInitialChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFirstInitial(value);
    validateFirstInitial(value, lastName);
    setShowCard(false);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/twitterActions/ghost_mane`, {
        firstInitial,
        lastName,
        twitterHandle,
      });
      console.log({ responseData: response.data });
      if (response.data.success) {
        setSubmissionMessage(response.data);
        setShowCard(true);
        setFirstInitial("");
        setLastName("");
        setTwitterHandle("");
      } else {
        messageWithTimeout(response.data.message, 5000);
      }

      setIsSubmitting(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected server error occurred";
      messageWithTimeout(errorMessage, 5000);
    } finally {
      setIsSubmitting(false);
      setType("");
    }
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
          Help us hold companies accountable for ghosting by sending an
          anonymous tweet.
          <Modal isOpen={isModalOpen} onClose={toggleModal}>
            <div>
              <h2>How it works</h2>
              <p>
                This tool is designed for customes or job applicants who were
                promised a follow-up from recruiters or company representatives
                within a specified time frame but did not receive any
                communication. Our app will send an anonymous tweet to the
                relevant company or recruiter on your behalf, holding them
                accountable, publicly.
              </p>
              <h2>How to use</h2>
              <p>
                Enter specified information. We will generate a tweet for you to
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
        <div className="hide-on-mobile">
          <button onClick={toggleModal}>More Info</button>
        </div>
      </div>
      {console.log({ message })}
      {isMessageVisible && <div className="error-response">{message}</div>}
      <div className="role-selection">
        <label>
          <input
            type="radio"
            name="type"
            value="applicant"
            checked={type === "applicant"}
            onChange={() => setType("applicant")}
          />
          Job Applicant
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="customer"
            checked={type === "customer"}
            onChange={() => setType("customer")}
          />
          Customer
        </label>
        <br />
        <br />
      </div>
      {type && (
        <form className="input-container" onSubmit={handleSubmit}>
          <div className="input-container">
            {type === "applicant" && (
              <>
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
              </>
            )}
            {errors.lastName && <div className="error">{errors.lastName}</div>}

            {type && (
              <input
                type="text"
                placeholder="Company Twitter Handle"
                value={twitterHandle}
                onChange={handleTwitterHandleChange}
              />
            )}
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
      )}

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

export default App;
