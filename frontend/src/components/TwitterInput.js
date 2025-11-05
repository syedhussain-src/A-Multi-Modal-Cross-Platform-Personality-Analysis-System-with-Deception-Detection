import React, { useState } from "react";
import axios from "axios";

function TwitterInput({ onResult }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!username) {
      alert("Please enter a Twitter username.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/analyze/twitter", {
        username,
      });
      onResult(res.data);
    } catch (err) {
      alert("Failed to analyze Twitter data.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Twitter Personality Analyzer</h2>
      <input
        type="text"
        placeholder="Enter Twitter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}

export default TwitterInput;
