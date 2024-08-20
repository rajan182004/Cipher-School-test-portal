import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const params = useParams();
  const [result, setResult] = useState("Verifying...");
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `https://online-test-platform-0h5r.onrender.com/api/auth/verify-email`,
          { token: params.token }
        );
        setResult(res.data.message);
      } catch (err) {
        setResult(err.response.data.message);
      }
    };
    verifyEmail();
  }, []);
  return (
    <div style={{textAlign: 'center'}}>
      <p style={{fontSize: '1.25rem', color: 'black'}}>{result}</p>
      <Link to={"/"}>Go to Login</Link>
    </div>
  );
}

export default VerifyEmail;
