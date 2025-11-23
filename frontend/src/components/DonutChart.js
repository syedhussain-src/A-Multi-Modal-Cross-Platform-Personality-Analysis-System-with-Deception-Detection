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
          "rgba(140, 140, 140, 0.8)",  // Light Gray
          "rgba(50, 50, 50, 0.8)",     // Very Dark Gray
          "rgba(90, 90, 90, 0.8)",     // Medium Gray
        ],
        borderColor: [
          "rgba(140, 140, 140, 1)",
          "rgba(50, 50, 50, 1)",
          "rgba(90, 90, 90, 1)",
        ],
        hoverBackgroundColor: [
          "rgba(160, 160, 160, 1)",
          "rgba(70, 70, 70, 1)",
          "rgba(110, 110, 110, 1)",
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
          color: "#000000",
          font: { size: 14, weight: "bold" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#5A5A5A",
        bodyColor: "#FFFFFF",
        borderColor: "#5A5A5A",
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
    { name: "Positive", value: positiveValue, emoji: "😀", color: "text-gray-500" },
    { name: "Negative", value: negativeValue, emoji: "😡", color: "text-gray-900" },
    { name: "Neutral", value: neutralValue, emoji: "😐", color: "text-gray-600" },
  ];
  const dominant = sentiments.reduce((max, s) => s.value > max.value ? s : max);

  return (
    <div className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-6 animate-pulse" style={{ background: 'linear-gradient(to bottom right, #5A5A5A, #4A4A4A)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #5A5A5A, #4A4A4A, #3A3A3A)' }}>
          Sentiment Distribution
        </h2>
        <p style={{ color: '#666666' }}>Emotional tone analysis from your content</p>
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
          <div className="text-sm" style={{ color: '#666666' }}>{dominant.name}</div>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div className="mt-8 space-y-3">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#000000' }}>
          <svg className="w-5 h-5" style={{ color: '#5A5A5A' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Detailed Breakdown
        </h3>
        
        {sentiments.map((s) => (
          <div key={s.name} className="rounded-xl p-4 transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(90, 90, 90, 0.1)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <span className="font-semibold" style={{ color: '#000000' }}>{s.name}</span>
              </div>
              <span className={`text-xl font-bold ${s.color}`}>
                {s.value.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#D0D0D0' }}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${s.value}%`,
                  background: s.name === "Positive" ? 'linear-gradient(to right, #8C8C8C, #A0A0A0)' :
                            s.name === "Negative" ? 'linear-gradient(to right, #323232, #464646)' :
                            'linear-gradient(to right, #5A5A5A, #6E6E6E)'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight Box */}
      <div className="mt-6 rounded-xl p-5" style={{ background: 'linear-gradient(to bottom right, rgba(90, 90, 90, 0.1), rgba(74, 74, 74, 0.1))', border: '1px solid rgba(90, 90, 90, 0.3)' }}>
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#5A5A5A' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold mb-1" style={{ color: '#3A3A3A' }}>Insight</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#000000' }}>
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