// index.js or wherever your root component is defined
import React from 'react';
import { ThemeProvider } from './ThemeContext'; // Make sure this is the correct import
import App from './App';

const RootComponent = () => {
  return (
    <ThemeProvider> {/* Ensure App is within ThemeProvider */}
      <App />
    </ThemeProvider>
  );
};

export default RootComponent;