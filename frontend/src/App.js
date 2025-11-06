import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

/* ==========================
   Import All Pages
========================== */
import HomePage from "./pages/HomePage";
import TextAnalyzer from "./pages/TextAnalyzer";
import ImageAnalyzer from "./pages/ImageAnalyzer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import TwitterAnalyzer from "./pages/TwitterAnalyzer";
import InstagramAnalyzer from "./pages/InstagramAnalyzer";
import ProtectedRoute from "./components/ProtectedRoute";

/* ==========================
   Navigation Component
========================== */
function Navigation({ user, handleLogout }) {
  const location = useLocation();
  const [scrollY, setScrollY] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? "shadow-md" : "backdrop-blur-md"
      }`}
      style={{
        backgroundColor: scrollY > 50 ? "#E1E2E1" : "rgba(225, 226, 225, 0.95)",
        border: "none",
      }}
    >
      <div className="flex items-center justify-between px-6 lg:px-10" style={{ height: "70px" }}>
        {/* Logo Section - Aligned to Left */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            style={{ backgroundColor: "#3d2b28" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#3d2b28" }}>
            Personality Insight
          </span>
        </Link>

        {/* Navigation Links - Aligned to Right */}
        <nav className="hidden md:flex items-center gap-1">
          {!user ? (
            <>
              <a
                href="#features"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                How It Works
              </a>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 px-6 py-2.5 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#3d2b28",
                }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{
                  color: "#3d2b28",
                  backgroundColor:
                    location.pathname === "/dashboard" ? "rgba(0,0,0,0.05)" : "transparent",
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/text-analyzer"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Text
              </Link>
              <Link
                to="/image-analyzer"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Image
              </Link>
              <Link
                to="/instagram-analyzer"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Instagram
              </Link>
              <Link
                to="/twitter-analyzer"
                className="px-4 py-2 rounded-lg transition-all font-medium"
                style={{ color: "#3d2b28" }}
              >
                Twitter
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-md transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#3d2b28" }}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#3d2b28" }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ==========================
   Main App
========================== */
function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App min-h-screen" style={{ backgroundColor: "#E1E2E1" }}>
        {/* Navigation Bar */}
        <Navigation user={user} handleLogout={handleLogout} />

        {/* Routes - Added padding-top to prevent overlap */}
        <main style={{ paddingTop: "70px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage setUser={setUser} />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/text-analyzer"
              element={
                <ProtectedRoute user={user}>
                  <TextAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/image-analyzer"
              element={
                <ProtectedRoute user={user}>
                  <ImageAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instagram-analyzer"
              element={
                <ProtectedRoute user={user}>
                  <InstagramAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/twitter-analyzer"
              element={
                <ProtectedRoute user={user}>
                  <TwitterAnalyzer />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;