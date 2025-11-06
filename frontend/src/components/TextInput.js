import React, { useState } from "react";
import axios from "axios";

function TextInput({ onResult }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/analyze/text", {
        text: text,
      });
      onResult(response.data);
      setError("");
    } catch (error) {
      setError("Error analyzing text. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-3xl p-8 shadow-2xl hover:shadow-xl transition-all duration-300" style={{ borderColor: '#D1D1D1' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5A5A5A' }}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>Text Analysis Input</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-3 text-sm font-semibold" style={{ color: '#000000' }}>
            Enter your text for personality analysis
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts, feelings, or any text you'd like to analyze... The more you write, the better the analysis!"
            rows="8"
            className="w-full p-4 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 transition-all"
            style={{ 
              border: '2px solid #D1D1D1',
              color: '#000000'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5A5A5A';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#D1D1D1';
            }}
          />
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs" style={{ color: '#6A6A6A' }}>
              {text.length} characters
            </span>
            {text.length > 0 && text.length < 50 && (
              <span className="text-xs" style={{ color: '#4A4A4A' }}>
                💡 Try writing more for better results
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="border rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: '#FFE5E5', borderColor: '#FF6B6B', color: '#C92A2A' }}>
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="w-full px-8 py-4 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          style={{ backgroundColor: '#5A5A5A' }}
          onMouseEnter={(e) => {
            if (!loading && text.trim()) {
              e.currentTarget.style.backgroundColor = '#4A4A4A';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#5A5A5A';
          }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing your text...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              🧠 Analyze Personality
            </>
          )}
        </button>
      </div>

      {/* Tips Section */}
      <div className="mt-6 border rounded-xl p-4" style={{ backgroundColor: '#F5F5F5', borderColor: '#D1D1D1' }}>
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#000000' }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tips for better results
        </h4>
        <ul className="text-xs space-y-1" style={{ color: '#4A4A4A' }}>
          <li>• Write naturally and authentically</li>
          <li>• Include your thoughts, feelings, or opinions</li>
          <li>• Longer text provides more accurate analysis</li>
        </ul>
      </div>
    </div>
  );
}

export default TextInput;