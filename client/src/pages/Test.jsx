import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "./test.css";
import Score from "../components/Score";

function Test() {
  const params = useParams();
  const testId = params.id;

  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [testLoading, setTestLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraAllowed) {
      setTestLoading(true);
      fetch(`http://localhost:3001/api/test/${testId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTest(data.test);
          setQuestions(data.questions);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTestLoading(false);
        });
    }
  }, [testId, cameraAllowed]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraAllowed(true);
      } catch (err) {
        setCameraError("Error accessing camera. Please allow camera access.");
        console.error("Error accessing camera: ", err);
      }
    };

    startCamera();

    return () => {
      stopCameraStream();
    };
  }, [cameraAllowed]);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null; // Clear the srcObject
    }
  };

  const handleSubmit = () => {
    var confirmation = confirm("Are you sure you want to submit the test?");
    if (!confirmation) {
      return;
    }
    stopCameraStream();
    const answers = [];

    questions.forEach((question) => {
      const selectedOption = document.querySelector(
        `input[name="${question._id}"]:checked`
      );
      if (selectedOption) {
        answers.push({
          questionId: question._id,
          selectedOption: selectedOption.value,
        });
      } else {
        answers.push({
          questionId: question._id,
          selectedOption: null,
        });
      }
    });

    let newScore = 0;
    let newTotal = 0;

    answers.forEach((answer) => {
      const question = questions.find((q) => q._id === answer.questionId);
      if (question) {
        if (question.correctOption === answer.selectedOption) {
          newScore += question.point;
        }
        newTotal += question.point;
      }
    });

    setScore(newScore);
    setTotal(newTotal);
    setShowScore(true);
  };

  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopCameraStream();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stopCameraStream();
    };
  }, []);

  return (
    <div className="container">
        <div className="content test-container">
      {!cameraAllowed && cameraError && (
        <p className="error-message">{cameraError}</p>
      )}

      {cameraAllowed ? (
        <>
          <div className="camera-feed">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="video-stream"
              width={150}
            />
          </div>
          {showScore && <Score score={score} total={total} />}
          {testLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="head">
                <h1>{test.title}</h1>
                <p>User: {user.username}</p>
                <p>Current Time: {currentTime.toLocaleTimeString()}</p>
              </div>
              <ul className="question-container">
                {questions.map((question) => (
                  <li key={question._id}>
                    <p>
                      {question.title}
                      <span>{question.point}</span>
                    </p>
                    <ul>
                      {question.options.map((option) => (
                        <li key={option}>
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                          />
                          <label>{option}</label>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <button onClick={handleSubmit}>Submit</button>
            </>
          )}
        </>
      ) : (
        <p> Allow Camera Permission to start the test</p>
      )}
      </div>
    </div>
  );
}

export default Test;
