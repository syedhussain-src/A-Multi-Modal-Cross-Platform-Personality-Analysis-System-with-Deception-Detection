// src/components/SignupForm.js
import React, { useState } from "react";
import axios from "axios";
import './loginform.css';

function SignupForm({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/signup", {
        username,
        password,
      });
      console.log(res)
      alert("Signup successful! Please login.");
      onSignupSuccess(); // Navigate to login after successful signup
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.error || "Unknown error");
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}

export default SignupForm;
