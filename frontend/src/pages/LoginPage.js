import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", username);
      setUser(data.token);

      alert("Login successful!");
      navigate("/text-analysis");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-xl border border-gray-300 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Welcome Back
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-4 font-semibold bg-red-50 border border-red-300 rounded-xl p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full font-semibold text-white shadow-lg hover:shadow-gray-700/50 transform hover:scale-105 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gray-800 font-semibold hover:text-gray-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;