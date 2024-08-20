import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./test.css";

function AllTests() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/"); // redirect to login page
    }
  });

  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState({});

  // fetch tests
  useEffect(() => {
    setIsLoading(true);
    try {
      fetch("https://online-test-platform-0h5r.onrender.com/api/test/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTests(data.tests);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // fetch user
  useEffect(() => {
    try {
      fetch("https://online-test-platform-0h5r.onrender.com/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <div className="content">
        <div className="head">
          <h1>All Tests</h1>
          <p>Welcome, {user.username}</p>
          <p>Current Time: {currentTime.toLocaleTimeString()}</p>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {tests.map((test) => (
              <li key={test._id} className="test-card">
                <p>{test.title}</p>
                <Link to={`/test/${test._id}`} className="btn">
                  Start Test
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllTests;
