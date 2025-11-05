// ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Custom Hook for easy access
export const useTheme = () => useContext(ThemeContext);

// 3. Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Initialize state from local storage or default to 'dark'
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // Effect to apply classes to the body and update local storage
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the other theme class
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save preference to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};