import React, { useState, useRef } from "react";
import ImageInput from "../components/ImageInput";
import ResultsChart from "../components/ImageResultsChart";
import Webcam from "react-webcam";

const ImageAnalyzer = () => {
  const [result, setResult] = useState(null);
  const [usingWebcam, setUsingWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);

  // Capture multiple frames from webcam
  const captureFrames = async (count = 8, delay = 150) => {
    const frames = [];
    for (let i = 0; i < count; i++) {
      const frame = webcamRef.current.getScreenshot();
      if (frame) frames.push(frame);
      await new Promise((r) => setTimeout(r, delay));
    }
    return frames;
  };

  // Call backend API
  const analyzeGender = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const frames = await captureFrames();
      const res = await fetch("http://127.0.0.1:5000/analyze/gender_frames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames }),
      });

      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Analysis failed.");
    } catch (e) {
      setError("Failed to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Image Analyzer
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover personality traits through facial expressions and visual analysis
          </p>

          {/* Info Cards */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-400/30 rounded-xl px-6 py-3 hover:bg-white/10 transition-all">
              <div className="text-purple-400 font-bold text-lg">AI Powered</div>
              <div className="text-gray-400 text-xs">Advanced Detection</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-pink-400/30 rounded-xl px-6 py-3 hover:bg-white/10 transition-all">
              <div className="text-pink-400 font-bold text-lg">Real-time</div>
              <div className="text-gray-400 text-xs">Instant Results</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-red-400/30 rounded-xl px-6 py-3 hover:bg-white/10 transition-all">
              <div className="text-red-400 font-bold text-lg">Secure</div>
              <div className="text-gray-400 text-xs">Privacy First</div>
            </div>
          </div>
        </div>

        {/* Webcam / Upload Section */}
        <div className="space-y-8 animate-slideIn">
          <div className="flex flex-col items-center space-y-6">
            {!usingWebcam ? (
              <>
                <ImageInput onResult={setResult} />
                <button
                  onClick={() => setUsingWebcam(true)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold text-white shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all"
                >
                  Use Live Camera
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded-3xl shadow-lg border-4 border-purple-400 mb-4"
                  width={480}
                  height={360}
                />
                <div className="flex gap-4">
                  <button
                    onClick={analyzeGender}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all"
                  >
                    {loading ? "Analyzing..." : "Analyze Gender"}
                  </button>
                  <button
                    onClick={() => setUsingWebcam(false)}
                    className="px-8 py-3 bg-white/10 border border-white/20 rounded-full font-semibold text-white hover:bg-white/20 transition-all"
                  >
                    Back to Upload
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && (
  <p className="text-red-400 mt-3 font-medium text-center">
    {error}
  </p>
)}


          {/* Results Section */}
          {result && (
            <div className="animate-fadeIn">
              <ResultsChart result={result} />
              <div className="text-center mt-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-400/20">
                <h3 className="text-2xl font-bold text-pink-400 mb-2">Gender Analysis Result</h3>
                <p className="text-lg text-gray-300">
                  Detected Gender:{" "}
                  <span className="text-white font-semibold">
                    {result.gender === "uncertain" ? "Uncertain" : result.gender.toUpperCase()}
                  </span>
                </p>
                <p className="text-gray-400">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* How it Works + Privacy sections remain unchanged */}
        {!result && (
          <div className="mt-16 bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-400/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📸</span>
                </div>
                <h4 className="text-white font-semibold mb-2">1. Upload or Capture</h4>
                <p className="text-gray-400 text-sm">Choose an image or enable your webcam for live analysis.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-400/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧠</span>
                </div>
                <h4 className="text-white font-semibold mb-2">2. AI Analysis</h4>
                <p className="text-gray-400 text-sm">AI detects gender and expressions from your live feed.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/30 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📊</span>
                </div>
                <h4 className="text-white font-semibold mb-2">3. Get Results</h4>
                <p className="text-gray-400 text-sm">See accurate gender predictions and analysis instantly.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-purple-500/10 border border-purple-400/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-white font-semibold mb-2">🔒 Privacy & Security</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your images and camera feed are processed securely and never stored. All analysis is done in real time.
              </p>
            </div>
          </div>
        </div>
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
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default ImageAnalyzer;
