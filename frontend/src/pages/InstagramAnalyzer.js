import React, { useState } from "react";
import DonutChart from "../components/DonutChart";

function InstagramAnalyzer() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Please enter an Instagram username.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/instagram/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      console.log("Instagram API Response:", data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Failed to connect to backend. Make sure your server is running on http://127.0.0.1:5000");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(90, 90, 90, 0.1))' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-500 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #5A5A5A, #4A4A4A)' }}>
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ 
            background: 'linear-gradient(to right, #5A5A5A, #4A4A4A, #3A3A3A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Instagram Analyzer
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#000000' }}>
            Analyze personality insights from Instagram profiles and posts 📸
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="rounded-full px-4 py-2 text-sm shadow-sm" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(90, 90, 90, 0.3)',
              color: '#3A3A3A'
            }}>
              <span className="font-semibold">AI-Powered</span>
            </div>
            <div className="rounded-full px-4 py-2 text-sm shadow-sm" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(90, 90, 90, 0.3)',
              color: '#3A3A3A'
            }}>
              <span className="font-semibold">Real-time Analysis</span>
            </div>
            <div className="rounded-full px-4 py-2 text-sm shadow-sm" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(90, 90, 90, 0.3)',
              color: '#3A3A3A'
            }}>
              <span className="font-semibold">Privacy First</span>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 animate-slideIn" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(90, 90, 90, 0.3)'
        }}>
          <div className="space-y-6">
            {/* Connect Button (Disabled) */}
            <button
              className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed opacity-70 hover:opacity-80 transition-opacity"
              disabled
              title="Instagram API connection coming soon"
              style={{
                backgroundColor: 'rgba(90, 90, 90, 0.1)',
                border: '2px solid rgba(90, 90, 90, 0.3)',
                color: '#5A5A5A'
              }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Connect Instagram (Coming Soon)</span>
            </button>

            <div className="flex items-center gap-4">
              <hr className="flex-1" style={{ borderColor: 'rgba(90, 90, 90, 0.3)' }} />
              <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ 
                color: '#000000',
                backgroundColor: 'rgba(90, 90, 90, 0.05)'
              }}>OR</span>
              <hr className="flex-1" style={{ borderColor: 'rgba(90, 90, 90, 0.3)' }} />
            </div>

            {/* Username Input */}
            <div>
              <label className="block mb-3 text-lg font-semibold flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                <svg className="w-5 h-5" style={{ color: '#5A5A5A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Instagram Username
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold" style={{ color: '#5A5A5A' }}>@</span>
                <input
                  type="text"
                  placeholder="cristiano"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                  className="w-full pl-10 pr-4 py-4 rounded-xl transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'rgba(90, 90, 90, 0.05)',
                    border: '2px solid rgba(90, 90, 90, 0.3)',
                    color: '#3A3A3A'
                  }}
                />
              </div>
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#000000' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Enter any public Instagram username
              </p>
            </div>

            {error && (
              <div className="rounded-xl p-4 flex items-center gap-3 animate-shake" style={{
                backgroundColor: 'rgba(90, 90, 90, 0.1)',
                border: '2px solid rgba(90, 90, 90, 0.5)',
                color: '#5A5A5A'
              }}>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold">{error}</div>
                  {error.includes("backend") && (
                    <div className="text-xs mt-1 opacity-80">Check if your Flask server is running on port 5000</div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || !username.trim()}
              className="w-full px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(to right, #5A5A5A, #4A4A4A)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing @{username}...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  🔍 Analyze Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-fadeIn" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(90, 90, 90, 0.3)'
          }}>
            <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3" style={{ color: '#3A3A3A' }}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Analysis Results for @{result.username}
            </h3>
            
            {/* Profile Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl p-4 text-center hover:scale-105 transition-transform" style={{
                background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.1), rgba(74, 74, 74, 0.1))',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <div className="text-sm mb-1" style={{ color: '#000000' }}>Followers</div>
                <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
                  {result.followers || result.follower_count || result.stats?.followers || "N/A"}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center hover:scale-105 transition-transform" style={{
                background: 'linear-gradient(to bottom right, rgba(74, 74, 74, 0.1), rgba(58, 58, 58, 0.1))',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <div className="text-sm mb-1" style={{ color: '#000000' }}>Following</div>
                <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
                  {result.following || result.following_count || result.stats?.following || "N/A"}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center hover:scale-105 transition-transform" style={{
                background: 'linear-gradient(to bottom right, rgba(58, 58, 58, 0.1), rgba(90, 90, 90, 0.1))',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <div className="text-sm mb-1" style={{ color: '#000000' }}>Posts</div>
                <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
                  {result.posts || result.media_count || result.sample_posts?.length || 0}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center hover:scale-105 transition-transform" style={{
                background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.1), rgba(74, 74, 74, 0.1))',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <div className="text-sm mb-1" style={{ color: '#000000' }}>Status</div>
                <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>✓</div>
              </div>
            </div>

            {/* Bio */}
            {result.bio && (
              <div className="mb-8 rounded-xl p-6 hover:bg-opacity-80 transition-all" style={{
                backgroundColor: 'rgba(90, 90, 90, 0.05)',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Bio
                </h4>
                <p className="leading-relaxed" style={{ color: '#000000' }}>{result.bio}</p>
              </div>
            )}

            {/* Sentiment Chart */}
            {result.sentiment && (
              <div className="mb-8">
                <DonutChart sentiment={result.sentiment} />
              </div>
            )}

            {/* Personality Traits */}
            {result.personality_traits && (
              <div className="mb-8 rounded-xl p-6" style={{
                backgroundColor: 'rgba(90, 90, 90, 0.05)',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Personality Traits
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.personality_traits).map(([trait, value]) => (
                    <div key={trait} className="rounded-lg p-3 hover:scale-105 transition-transform" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(90, 90, 90, 0.3)'
                    }}>
                      <div className="text-xs mb-1 capitalize" style={{ color: '#000000' }}>{trait}</div>
                      <div className="text-xl font-bold" style={{ color: '#3A3A3A' }}>
                        {typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {Array.isArray(result.sample_posts) && result.sample_posts.length > 0 && (
              <div className="rounded-xl p-6" style={{
                backgroundColor: 'rgba(90, 90, 90, 0.05)',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Recent Posts ({result.sample_posts.length})
                </h4>
                <div className="space-y-2">
                  {result.sample_posts.map((post, index) => (
                    <div key={index} className="rounded-lg p-4 text-sm hover:bg-opacity-80 transition-all" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(90, 90, 90, 0.3)',
                      color: '#000000'
                    }}>
                      <div className="flex items-start gap-3">
                        <span className="font-bold" style={{ color: '#5A5A5A' }}>#{index + 1}</span>
                        <span className="flex-1">{post}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Data Message */}
            {!result.bio && (!result.sample_posts || result.sample_posts.length === 0) && !result.sentiment && (
              <div className="rounded-xl p-6 text-center" style={{
                backgroundColor: 'rgba(90, 90, 90, 0.1)',
                border: '1px solid rgba(90, 90, 90, 0.3)'
              }}>
                <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#5A5A5A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-semibold mb-2" style={{ color: '#3A3A3A' }}>Limited Data Available</p>
                <p className="text-sm" style={{ color: '#000000' }}>
                  The profile analysis returned limited information. This might be due to privacy settings or API limitations.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        {!result && (
          <div className="mt-8 rounded-2xl p-6 animate-fadeIn" style={{
            background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.05), rgba(74, 74, 74, 0.05))',
            border: '1px solid rgba(90, 90, 90, 0.3)'
          }}>
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#5A5A5A' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#3A3A3A' }}>
                  💡 How It Works
                </h4>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#000000' }}>
                  Enter any public Instagram username to analyze their personality based on their profile bio, posts, and captions. 
                  Our AI analyzes writing patterns, sentiment, and content themes to provide insights into personality traits.
                </p>
                <div className="flex items-start gap-2 text-xs" style={{ color: '#000000' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Your searches are private and data is processed securely</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}

export default InstagramAnalyzer;