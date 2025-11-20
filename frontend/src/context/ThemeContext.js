import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext({
  currentTheme: 'light',
  primaryColor: '#4A90E2', // Warm, empathetic blue
  secondaryColor: '#8B5FBF', // Gentle purple
  toggleTheme: () => {},
  changePrimaryColor: () => {},
  changeSecondaryColor: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#4A90E2'); // Warm, empathetic blue
  const [secondaryColor, setSecondaryColor] = useState('#8B5FBF'); // Gentle purple

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const changeSecondaryColor = (color) => {
    setSecondaryColor(color);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: currentTheme,
          primary: {
            main: primaryColor,
          },
          secondary: {
            main: secondaryColor,
          },
          background: {
            default: currentTheme === 'light' ? '#f5f5f5' : '#121212',
            paper: currentTheme === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      }),
    [currentTheme, primaryColor, secondaryColor]
  );

  const value = {
    currentTheme,
    primaryColor,
    secondaryColor,
    toggleTheme,
    changePrimaryColor,
    changeSecondaryColor,
    theme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};