import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Verifica se o utilizador já tinha escolhido um tema antes, se não, começa no escuro
  const [tema, setTema] = useState(localStorage.getItem('tema') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (tema === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Guarda a preferência
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = () => {
    setTema(tema === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);