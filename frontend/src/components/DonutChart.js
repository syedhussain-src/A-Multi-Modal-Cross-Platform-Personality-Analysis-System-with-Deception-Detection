import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DonutChart({ sentiment }) {
  // Handle different sentiment formats
  const positiveValue = (sentiment?.positive || 0) * 100;
  const negativeValue = (sentiment?.negative || 0) * 100;
  const neutralValue = (sentiment?.neutral || 0) * 100;

  const data = {
    labels: ["Positive 😀", "Negative 😡", "Neutral 😐"],
    datasets: [
      {
        data: [positiveValue, negativeValue, neutralValue],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",  // Green
          "rgba(239, 68, 68, 0.8)",   // Red
          "rgba(59, 130, 246, 0.8)",  // Blue
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        hoverBackgroundColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: { size: 14, weight: "bold" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#22d3ee",
        bodyColor: "#fff",
        borderColor: "#22d3ee",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      },
    },
    cutout: "65%",
  };

  // Determine dominant sentiment
  const sentiments = [
    { name: "Positive", value: positiveValue, emoji: "😀", color: "text-green-400" },
    { name: "Negative", value: negativeValue, emoji: "😡", color: "text-red-400" },
    { name: "Neutral", value: neutralValue, emoji: "😐", color: "text-blue-400" },
  ];
  const dominant = sentiments.reduce((max, s) => s.value > max.value ? s : max);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-pink-400/30 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-6 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
          Sentiment Distribution
        </h2>
        <p className="text-gray-400">Emotional tone analysis from your content</p>
      </div>

      {/* Chart Container */}
      <div className="relative" style={{ height: "350px" }}>
        <Doughnut data={data} options={options} />
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-5xl mb-2 animate-bounce`}>{dominant.emoji}</div>
          <div className={`text-2xl font-bold ${dominant.color}`}>
            {dominant.value.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">{dominant.name}</div>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Detailed Breakdown
        </h3>
        
        {sentiments.map((s) => (
          <div key={s.name} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-white font-semibold">{s.name}</span>
              </div>
              <span className={`text-xl font-bold ${s.color}`}>
                {s.value.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  s.name === "Positive" ? "bg-gradient-to-r from-green-400 to-green-600" :
                  s.name === "Negative" ? "bg-gradient-to-r from-red-400 to-red-600" :
                  "bg-gradient-to-r from-blue-400 to-blue-600"
                }`}
                style={{ width: `${s.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Box */}
      <div className="mt-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-pink-400 mb-1">Insight</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {dominant.value > 50 ? (
                `Your content shows a strongly ${dominant.name.toLowerCase()} sentiment, indicating ${
                  dominant.name === "Positive" ? "an optimistic and uplifting tone" :
                  dominant.name === "Negative" ? "emotional intensity or critical perspective" :
                  "a balanced and neutral approach"
                }.`
              ) : (
                "Your content shows a balanced mix of sentiments, indicating emotional versatility and nuanced expression."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonutChart;