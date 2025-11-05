import React from "react";
import { Radar } from "react-chartjs-2";
import { getTraitDescription } from "../utils/traitDescriptions";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function ResultsChart({ result }) {
  if (!result) return null;

  const traits = result.personality_traits;
  const sentiment = result.sentiment || "Neutral";

  /* 🔍 Determine Personality Summary */
  const dominantTrait = Object.entries(traits).sort((a, b) => b[1] - a[1])[0];
  const mainTrait = dominantTrait ? dominantTrait[0] : "Unknown";
  
  const personalitySummary = {
    introvert: "You tend to be introspective, thoughtful, and enjoy solitary activities.",
    extrovert: "You are outgoing, social, and energized by interaction with others.",
    openness: "You are imaginative, curious, and open to new experiences.",
    conscientiousness: "You are disciplined, organized, and dependable.",
    agreeableness: "You are kind, empathetic, and value harmony in relationships.",
    neuroticism: "You are emotionally sensitive and responsive to stress or tension.",
  };

  /* 🎯 Dynamic Badge Color Based on Sentiment */
  const sentimentColor =
    sentiment === "Positive"
      ? "#10B981"
      : sentiment === "Negative"
      ? "#EF4444"
      : "#FBBF24";

  /* 📊 Radar Chart Setup */
  const data = {
    labels: Object.keys(traits).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
    datasets: [
      {
        label: "Personality Traits",
        data: Object.values(traits),
        backgroundColor: "rgba(34, 211, 238, 0.2)",
        borderColor: "#22d3ee",
        pointBackgroundColor: "#22d3ee",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#06b6d4",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: "rgba(255,255,255,0.1)" },
        grid: { color: "rgba(255,255,255,0.15)" },
        pointLabels: {
          color: "#cbd5e1",
          font: { size: 13, weight: "bold" },
        },
        ticks: {
          display: false,
          min: 0,
          max: 1,
          stepSize: 0.2,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#22d3ee",
          font: { size: 14, weight: "bold" },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#22d3ee",
        bodyColor: "#fff",
        borderColor: "#22d3ee",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-6 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Personality Profile Report
        </h2>
        <p className="text-gray-400">Your comprehensive personality analysis</p>
      </div>

      {/* Personality Overview */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="text-3xl">🧩</span>
          <span className="text-white">
            Dominant Trait: <span className="text-cyan-400">{mainTrait.toUpperCase()}</span>
          </span>
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed mb-4">
          {personalitySummary[mainTrait.toLowerCase()] ||
            "You have a balanced personality mix with no single dominant trait."}
        </p>
        <div
          className="inline-block px-6 py-2 rounded-full font-bold text-white shadow-lg"
          style={{ backgroundColor: sentimentColor }}
        >
          Sentiment: {sentiment}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10" style={{ height: "400px" }}>
        <Radar data={data} options={options} />
      </div>

      {/* Trait Breakdown */}
      <div className="space-y-4 mb-8">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
          <span className="text-3xl">📊</span>
          Detailed Trait Analysis
        </h3>
        
        <div className="grid gap-4">
          {Object.entries(traits).map(([trait, value]) => {
            const percentage = (value * 100).toFixed(1);
            
            return (
              <div
                key={trait}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <strong className="text-lg text-white font-semibold">
                    {trait.charAt(0).toUpperCase() + trait.slice(1)}
                  </strong>
                  <span className="text-2xl font-bold text-cyan-400">
                    {percentage}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {getTraitDescription(trait, value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Analysis Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-purple-400 font-semibold min-w-[120px]">Confidence:</span>
            <span className="text-gray-300">{result.confidence || "High"}</span>
          </div>
          
          {result.text && (
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-semibold min-w-[120px]">Analyzed Text:</span>
              <em className="text-gray-300 italic">
                "{result.text.substring(0, 150)}{result.text.length > 150 ? '...' : ''}"
              </em>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              This analysis is based on AI algorithms and should be used for entertainment and self-reflection purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsChart;