import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalysis: 0,
    accuracyRate: 0,
    activeSessions: 0,
    textAnalysis: 0,
    imageAnalysis: 0,
    socialAnalysis: 0,
  });
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({
    totalAnalysis: 0,
    accuracyRate: 0,
    activeSessions: 0,
  });
  const userName = "User";

  // Simulate real-time data updates
  useEffect(() => {
    // Initial load
    setTimeout(() => {
      setStats({
        totalAnalysis: 156,
        accuracyRate: 98,
        activeSessions: 12,
        textAnalysis: 78,
        imageAnalysis: 45,
        socialAnalysis: 33,
      });
      setRecentAnalyses([
        { id: 1, type: "Text", result: "Extroverted", confidence: 95, time: "2 mins ago" },
        { id: 2, type: "Image", result: "Confident", confidence: 92, time: "15 mins ago" },
        { id: 3, type: "Instagram", result: "Creative", confidence: 88, time: "1 hour ago" },
        { id: 4, type: "Twitter", result: "Analytical", confidence: 91, time: "3 hours ago" },
      ]);
      setLoading(false);
    }, 500);

    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalAnalysis: prev.totalAnalysis + Math.floor(Math.random() * 3),
        activeSessions: Math.max(1, prev.activeSessions + (Math.random() > 0.5 ? 1 : -1)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate numbers counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalAnalysis: Math.floor(stats.totalAnalysis * progress),
        accuracyRate: Math.floor(stats.accuracyRate * progress),
        activeSessions: Math.floor(stats.activeSessions * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats({
          totalAnalysis: stats.totalAnalysis,
          accuracyRate: stats.accuracyRate,
          activeSessions: stats.activeSessions,
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats.totalAnalysis, stats.accuracyRate, stats.activeSessions]);

  const quickActions = [
    { 
      title: "Text Analyzer", 
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      path: "/text-analyzer" 
    },
    { 
      title: "Image Analyzer", 
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      path: "/image-analyzer" 
    },
    { 
      title: "Instagram", 
      icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
      path: "/instagram-analyzer" 
    },
    { 
      title: "Twitter/X", 
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      path: "/twitter-analyzer" 
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, <span className="text-gray-900 font-semibold">{userName}</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live data updating</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Analysis" 
            value={animatedStats.totalAnalysis} 
            icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            loading={loading}
          />
          <StatCard 
            title="Accuracy Rate" 
            value={`${animatedStats.accuracyRate}%`} 
            icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            loading={loading}
          />
          <StatCard 
            title="Active Sessions" 
            value={animatedStats.activeSessions} 
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            loading={loading}
            pulse={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                className="group relative p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg group-hover:text-gray-900 transition-colors">
                    {action.title}
                  </h3>
                  
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm text-gray-600">Click to analyze →</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Analyses */}
        <section className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Analyses
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Updated live</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
            </div>
          ) : recentAnalyses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No analyses found for {userName}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-4 font-semibold text-gray-700">Type</th>
                    <th className="p-4 font-semibold text-gray-700">Result</th>
                    <th className="p-4 font-semibold text-gray-700">Confidence</th>
                    <th className="p-4 font-semibold text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map((analysis, index) => (
                    <tr 
                      key={analysis.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="p-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-gray-700 font-medium">
                          {analysis.type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-900 font-semibold">{analysis.result}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-gray-900 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${analysis.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-medium">{analysis.confidence}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">{analysis.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

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

        .animate-slide-in {
          animation: slide-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, loading, pulse }) => {
  return (
    <div className={`group relative p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden ${pulse ? 'animate-pulse-slow' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">
            {title}
          </h3>
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
        </div>
        
        {loading ? (
          <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
        ) : (
          <p className="text-4xl font-bold text-gray-900 transition-all duration-300">
            {value}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default Dashboard;