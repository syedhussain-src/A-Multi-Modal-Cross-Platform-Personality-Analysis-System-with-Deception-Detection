import React, { useState } from "react";
import axios from "axios";
import DonutChart from "../components/DonutChart";

function TwitterAnalyzer() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeTwitter = async () => {
    if (!username.trim()) {
      setError("Please enter a Twitter/X username");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/analyze/twitter", {
        username: username.trim(),
      });
      console.log("Twitter API Response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Twitter Analysis Error:", err);
      setError(err.response?.data?.error || "Twitter analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-500 shadow-lg shadow-cyan-500/50">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Twitter/X Analyzer
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Analyze personality insights from Twitter/X profiles and tweets 
          </p>

          {/* Info Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-full px-4 py-2 text-cyan-300 text-sm">
              <span className="font-semibold">AI-Powered</span>
            </div>
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 text-blue-300 text-sm">
              <span className="font-semibold">Real-time Analysis</span>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-full px-4 py-2 text-indigo-300 text-sm">
              <span className="font-semibold">Tweet Sentiment</span>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 animate-slideIn">
          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-gray-300 mb-3 text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Twitter/X Username
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xl font-bold">@</span>
                <input
                  type="text"
                  placeholder="elonmusk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && analyzeTwitter()}
                  className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all group-hover:border-cyan-400/40"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Enter any public Twitter/X username
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-semibold">{error}</div>
                  {error.includes("failed") && (
                    <div className="text-xs mt-1 opacity-80">Check if your Flask server is running on port 5000</div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={analyzeTwitter}
              disabled={loading || !username.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
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
          <div className="mt-8 bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-8 shadow-2xl animate-fadeIn">
            <h3 className="text-3xl font-bold text-cyan-400 mb-6 text-center flex items-center justify-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Analysis Results for @{result.username || username}
            </h3>
            
            {/* Profile Stats */}
            {(result.followers || result.following || result.tweets_count) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30 text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-400 mb-1">Followers</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {result.followers || result.stats?.followers || "N/A"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/30 text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-400 mb-1">Following</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {result.following || result.stats?.following || "N/A"}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-400/30 text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-400 mb-1">Tweets</div>
                  <div className="text-2xl font-bold text-indigo-400">
                    {result.tweets_count || result.sample_tweets?.length || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/30 text-center hover:scale-105 transition-transform">
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <div className="text-2xl font-bold text-purple-400">✓</div>
                </div>
              </div>
            )}

            {/* Bio */}
            {result.bio && (
              <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Bio
                </h4>
                <p className="text-gray-300 leading-relaxed">{result.bio}</p>
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
              <div className="mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Personality Traits
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.personality_traits).map(([trait, value]) => (
                    <div key={trait} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-400/30 hover:scale-105 transition-transform">
                      <div className="text-xs text-gray-400 mb-1 capitalize">{trait}</div>
                      <div className="text-xl font-bold text-cyan-400">
                        {typeof value === 'number' ? `${(value * 100).toFixed(0)}%` : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Tweets */}
            {result.sample_tweets && Array.isArray(result.sample_tweets) && result.sample_tweets.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Recent Tweets ({result.sample_tweets.length})
                </h4>
                <div className="space-y-2">
                  {result.sample_tweets.map((tweet, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-cyan-400 font-bold">#{index + 1}</span>
                        <span className="flex-1">{tweet}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON Display (if no structured data) */}
            {!result.personality_traits && !result.sentiment && !result.sample_tweets && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Analysis Data
                </h4>
                <pre className="text-gray-300 text-xs overflow-x-auto whitespace-pre-wrap bg-slate-900/50 rounded-lg p-4">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {/* No Data Message */}
            {!result.bio && (!result.sample_tweets || result.sample_tweets.length === 0) && !result.sentiment && (
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-yellow-300 font-semibold mb-2">Limited Data Available</p>
                <p className="text-gray-400 text-sm">
                  The profile analysis returned limited information. This might be due to privacy settings or API limitations.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        {!result && (
          <div className="mt-8 bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  💡 How It Works
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  Enter any public Twitter/X username to analyze their personality based on their profile bio and recent tweets. 
                  Our AI analyzes writing patterns, sentiment, and content themes to provide insights into personality traits.
                </p>
                <div className="flex items-start gap-2 text-xs text-gray-500">
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default TwitterAnalyzer;