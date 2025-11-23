import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockToken = "mock-token-" + Date.now();
    localStorage.setItem("token", mockToken);
    setUser(mockToken);
    alert("Signup successful!");
    navigate("/text-analysis");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white backdrop-blur-xl border border-gray-300 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-black mb-8">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all" 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all" 
              placeholder="your@email.com" 
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
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-gray-800 font-semibold hover:text-gray-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;