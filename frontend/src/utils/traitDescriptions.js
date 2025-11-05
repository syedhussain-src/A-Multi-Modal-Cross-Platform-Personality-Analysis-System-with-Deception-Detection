export function getTraitDescription(trait, value) {
  const level = value >= 0.7 ? "high" : value <= 0.3 ? "low" : "moderate";

  const descriptions = {
    openness: {
      high: "Creative, curious, and open to new experiences.",
      moderate: "Balanced between tradition and novelty.",
      low: "Prefers routine, practical and conventional."
    },
    conscientiousness: {
      high: "Highly organized, responsible, and detail-oriented.",
      moderate: "Somewhat dependable and goal-directed.",
      low: "Flexible, spontaneous, and less structured."
    },
    extraversion: {
      high: "Outgoing, energetic, and sociable.",
      moderate: "Socially balanced, both introverted and extroverted.",
      low: "Reserved, quiet, and introspective."
    },
    agreeableness: {
      high: "Kind, empathetic, and cooperative.",
      moderate: "Generally friendly but occasionally assertive.",
      low: "Direct, competitive, or critical."
    },
    neuroticism: {
      high: "Emotionally sensitive and prone to stress.",
      moderate: "Moderate emotional reactivity.",
      low: "Calm, emotionally stable, and resilient."
    }
  };

  return descriptions[trait][level];
}
