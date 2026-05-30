import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const theme = {
    darkMode,
    toggleDarkMode,
    colors: darkMode ? {
      bg: '#1a1a2e',
      card: '#16213e',
      header: '#0f3460',
      text: '#e0e0e0',
      subtext: '#a0a0a0',
      border: '#2a2a4a',
      input: '#1a1a2e',
      inputBorder: '#2a2a4a',
      hover: '#0f3460',
    } : {
      bg: '#f7f7f5',
      card: '#ffffff',
      header: '#4f46e5',
      text: '#37352f',
      subtext: '#888888',
      border: '#eeeeee',
      input: '#ffffff',
      inputBorder: '#dddddd',
      hover: '#f5f5f5',
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)