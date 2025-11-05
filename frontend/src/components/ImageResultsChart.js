import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ImageResultsChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const emotionDescriptions = {
  happy: "You seem cheerful, positive, and socially confident.",
  sad: "You appear thoughtful or emotionally reflective.",
  angry: "You show strong emotions — possibly driven or assertive.",
  neutral: "You maintain calmness and balance in your expression.",
  fear: "You seem anxious or alert about something uncertain.",
  disgust: "You may be expressing dissatisfaction or strong dislike.",
  surprise: "You appear spontaneous and expressive!",
};

function ImageResultsChart({ result }) {
  if (!result) return null;

  const { emotion, gender, personality_traits } = result;

  const data = {
    labels: Object.keys(personality_traits),
    datasets: [
      {
        label: "Trait Score",
        data: Object.values(personality_traits),
        backgroundColor: ["#06b6d4", "#9333ea", "#ec4899", "#22d3ee", "#8b5cf6"],
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Personality Traits (Based on Facial Expression)",
        color: "#61dafb",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="image-result-card">
      <h2 className="image-chart-title">Facial Personality Analysis</h2>

      <div className="image-result-info">
        <div className="info-box">
          <strong>Detected Emotion:</strong> 
          <span className={`emotion-tag ${emotion.toLowerCase()}`}>{emotion}</span>
        </div>
        <div className="info-box">
          <strong>Detected Gender:</strong> 
          <span className="gender-tag">{gender}</span>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>

      <div className="emotion-description">
        <p>{emotionDescriptions[emotion.toLowerCase()] || "Emotion interpretation not available."}</p>
      </div>
    </div>
  );
}

export default ImageResultsChart;
