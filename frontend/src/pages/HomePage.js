import React, { useEffect, useState, useRef } from "react";

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallaxScale = 1 + (scrollY * 0.0002);
  const parallaxOpacity = 1 - (scrollY * 0.0015);

  // For demonstration - replace with navigate('/signup') etc in your actual app
  const handleStartJourney = () => {
    console.log('Navigate to /signup');
    alert('This will navigate to /signup in your app');
  };

  const handleWatchDemo = () => {
    console.log('Navigate to /dashboard');
    alert('This will navigate to /dashboard in your app');
  };

  const handleGetStarted = () => {
    console.log('Navigate to /signup');
    alert('This will navigate to /signup in your app');
  };

  return (
    <div style={{ backgroundColor: '#F5F3EF' }}>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden" style={{ backgroundColor: '#F5F3EF' }}>
        {/* Animated Background */}
        <div 
          className="absolute inset-0 transition-all duration-100 ease-out"
          style={{
            transform: `scale(${parallaxScale})`,
            opacity: parallaxOpacity
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: '#F5F3EF' }}>
            {/* Floating Gradient Orbs */}
            <div 
              className="absolute rounded-full blur-3xl opacity-30"
              style={{
                width: '600px',
                height: '600px',
                background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
                top: '10%',
                left: '5%',
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            <div 
              className="absolute rounded-full blur-3xl opacity-20"
              style={{
                width: '500px',
                height: '500px',
                background: 'linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)',
                bottom: '15%',
                right: '10%',
                transform: `translate(-${mousePosition.x * 0.5}px, -${mousePosition.y * 0.5}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(139, 195, 74, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 195, 74, 0.03) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
              transform: `translateY(${scrollY * 0.3}px)`
            }} />
          </div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-6">
          <div className={`text-center max-w-5xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 animate-pulse">
              <span 
                className="px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(200, 230, 201, 0.4)', 
                  border: '1px solid rgba(139, 195, 74, 0.3)',
                  color: '#558B2F'
                }}
              >
                ✨ AI-Powered Personality Analysis
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span 
                className="block bg-clip-text text-transparent animate-gradient"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #558B2F 0%, #7CB342 50%, #9CCC65 100%)',
                  backgroundSize: '200% auto',
                  animation: 'gradient 3s ease infinite'
                }}
              >
                Discover The
              </span>
              <span 
                className="block mt-2"
                style={{ color: '#6D4C41' }}
              >
                Real You
              </span>
            </h1>

            <p 
              className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: '#795548' }}
            >
              Unlock deep insights into personality traits through advanced AI analysis of text, images, and social media presence
            </p>

            <div className="flex flex-wrap gap-6 justify-center items-center">
              <button 
                onClick={handleStartJourney}
                className="group relative px-10 py-5 rounded-full font-semibold text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ 
                  backgroundColor: '#8BC34A',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 40px rgba(139, 195, 74, 0.3)'
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: '#7CB342' }}
                />
              </button>

              <button 
                onClick={handleWatchDemo}
                className="px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #8BC34A',
                  color: '#558B2F'
                }}
              >
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-12 justify-center mt-16 pt-8" style={{ borderTop: '1px solid rgba(139, 195, 74, 0.2)' }}>
              {[
                { value: "98%", label: "Accuracy Rate" },
                { value: "50K+", label: "Active Users" },
                { value: "4.9★", label: "User Rating" }
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="transition-transform duration-300 hover:scale-110"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${i * 0.2}s both`
                  }}
                >
                  <div className="text-4xl font-bold" style={{ color: '#558B2F' }}>{stat.value}</div>
                  <div className="mt-1" style={{ color: '#8D6E63' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" style={{ color: '#8BC34A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: '#8BC34A' }}>Our Features</span>
            <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6" style={{ color: '#4E342E' }}>
              Multiple Analysis Methods
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#795548' }}>
              Comprehensive personality insights through various data sources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                title: "Text Analysis",
                description: "Advanced NLP algorithms analyze writing patterns, vocabulary, and communication style to reveal personality traits",
                gradient: "linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)"
              },
              {
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                title: "Image Analysis",
                description: "Computer vision technology examines facial expressions, body language, and visual preferences",
                gradient: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)"
              },
              {
                icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                title: "Social Media",
                description: "Deep analysis of online behavior, interaction patterns, and digital footprint across platforms",
                gradient: "linear-gradient(135deg, #B2DFDB 0%, #80CBC4 100%)"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative rounded-3xl p-8 transition-all duration-700 hover:-translate-y-3"
                style={{ 
                  backgroundColor: '#F5F5F5',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(139, 195, 74, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: feature.gradient }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#4E342E' }}>{feature.title}</h3>
                <p className="leading-relaxed" style={{ color: '#795548' }}>{feature.description}</p>

                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
                  style={{ background: feature.gradient, opacity: 0.05 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 overflow-hidden" style={{ backgroundColor: '#F5F3EF' }}>
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute rounded-full blur-3xl"
            style={{
              width: '400px',
              height: '400px',
              background: 'linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)',
              top: '20%',
              right: '10%'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: '#8BC34A' }}>Simple Process</span>
            <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6" style={{ color: '#4E342E' }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your account in seconds" },
              { step: "02", title: "Choose Method", desc: "Select your analysis type" },
              { step: "03", title: "AI Analysis", desc: "Our AI processes your data" },
              { step: "04", title: "Get Results", desc: "Receive detailed insights" }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative text-center"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
                }}
              >
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-500 hover:scale-110 hover:rotate-12"
                  style={{ 
                    background: 'linear-gradient(135deg, #8BC34A 0%, #7CB342 100%)',
                    boxShadow: '0 10px 30px rgba(139, 195, 74, 0.3)'
                  }}
                >
                  <span className="text-3xl font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#4E342E' }}>{item.title}</h3>
                <p style={{ color: '#795548' }}>{item.desc}</p>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5" style={{ backgroundColor: 'rgba(139, 195, 74, 0.3)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="absolute inset-0">
          <div 
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: '600px',
              height: '600px',
              background: 'linear-gradient(135deg, #8BC34A 0%, #7CB342 100%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#4E342E' }}>
            Ready to Discover Yourself?
          </h2>
          <p className="text-xl mb-12" style={{ color: '#795548' }}>
            Join thousands of users who have unlocked their personality insights
          </p>
          <button 
            onClick={handleGetStarted}
            className="inline-flex items-center gap-3 px-12 py-6 rounded-full font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            style={{ 
              backgroundColor: '#8BC34A',
              color: '#FFFFFF',
              boxShadow: '0 10px 40px rgba(139, 195, 74, 0.4)'
            }}
          >
            Get Started Now
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ backgroundColor: '#F5F3EF', borderColor: 'rgba(139, 195, 74, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center" style={{ color: '#795548' }}>
          <p>&copy; 2025 Personality Insight. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;