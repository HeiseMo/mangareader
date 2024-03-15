// index.js or App.js (depending on your project structure)
import React from 'react';
import Main from './Main'; // Your existing App component
import { ThemeProvider } from './ThemeContext'; // Adjust the import path according to your project structure

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
