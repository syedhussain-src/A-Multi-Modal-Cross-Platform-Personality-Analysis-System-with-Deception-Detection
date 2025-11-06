import React, { useState } from "react";
import TextInput from "../components/TextInput";
import ResultsChart from "../components/ResultsChart";

const TextAnalyzer = () => {
  const [result, setResult] = useState(null);

  const features = [
    {
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your writing style and word choices to reveal personality insights."
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Instant Results",
      description: "Get comprehensive personality trait analysis in seconds with real-time processing and visualization."
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "98% Accuracy",
      description: "Our model has been trained on millions of text samples to ensure highly accurate personality predictions."
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "100% Private",
      description: "Your text is analyzed locally and never stored. We respect your privacy and data security."
    }
  ];

  const traits = [
    {
      name: "Openness",
      description: "Measures creativity, imagination, and openness to new experiences and ideas."
    },
    {
      name: "Conscientiousness",
      description: "Reflects organization, dependability, and goal-oriented behavior."
    },
    {
      name: "Extraversion",
      description: "Indicates sociability, assertiveness, and energy in social situations."
    },
    {
      name: "Agreeableness",
      description: "Shows compassion, cooperation, and tendency to get along with others."
    },
    {
      name: "Neuroticism",
      description: "Measures emotional stability and tendency to experience negative emotions."
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12" style={{ backgroundColor: '#FAFAFA' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg" style={{ backgroundColor: '#5A5A5A' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Text Analyzer
          </h1>
          
          <p className="text-xl max-w-2xl mb-6" style={{ color: '#000000' }}>
            Discover your personality traits through advanced text analysis powered by AI
          </p>

          <div className="flex items-center gap-4 text-sm" style={{ color: '#000000' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#4A4A4A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>98% Accurate</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#5A5A5A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#6A6A6A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>100% Private</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <TextInput onResult={setResult} />
          {result && (
            <ResultsChart result={result} />
          )}
        </div>

        {/* How It Works Section */}
        <div className="mt-16 animate-fade-in-delay">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#000000' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 animate-slide-in" style={{ animationDelay: '0ms' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#5A5A5A' }}>
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#000000' }}>Enter Your Text</h3>
              <p style={{ color: '#000000' }}>Write or paste any text - emails, social media posts, or journal entries work great.</p>
            </div>
            <div className="text-center p-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#5A5A5A' }}>
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>AI Analysis</h3>
              <p style={{ color: '#000000' }}>Our advanced AI analyzes linguistic patterns, word choices, and writing style.</p>
            </div>
            <div className="text-center p-6 animate-slide-in" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#5A5A5A' }}>
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>Get Insights</h3>
              <p style={{ color: '#000000' }}>Receive detailed personality trait scores based on the Big Five personality model.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 animate-fade-in-delay">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#000000' }}>
            Why Choose Our Text Analyzer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden animate-slide-in"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  border: '2px solid #D1D1D1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5A5A5A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D1D1';
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to bottom right, #F5F5F5, #FFFFFF)' }}></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#5A5A5A' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>{feature.title}</h3>
                  <p style={{ color: '#000000' }}>{feature.description}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#5A5A5A' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Traits Explanation */}
        <div className="mt-16 animate-fade-in-delay">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#000000' }}>
            Understanding the Big Five Traits
          </h2>
          <div className="space-y-4">
            {traits.map((trait, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-white transition-all duration-300 hover:shadow-lg overflow-hidden animate-slide-in"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  border: '2px solid #D1D1D1'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5A5A5A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D1D1';
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, #F5F5F5, #FFFFFF)' }}></div>
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#5A5A5A' }}>
                    <span className="text-white font-bold">{trait.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#000000' }}>{trait.name}</h3>
                    <p style={{ color: '#000000' }}>{trait.description}</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: '#5A5A5A' }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 rounded-3xl text-white text-center animate-fade-in-delay" style={{ background: 'linear-gradient(to bottom right, #5A5A5A, #3A3A3A)' }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Yourself?</h2>
          <p className="mb-6 max-w-2xl mx-auto" style={{ color: '#E0E0E0' }}>
            Join thousands of users who have gained valuable insights into their personality through our advanced text analysis.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: '#FFFFFF',
              color: '#000000'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Start Analyzing Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default TextAnalyzer;