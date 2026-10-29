import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Importamos o ícone do menu
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Maquinas from './pages/Maquinas';
import Projetos from './pages/Projetos';
import Orcamentos from './pages/Orcamentos';
import { FerramentariaProvider } from './context/FerramentariaContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <ThemeProvider>
      <FerramentariaProvider>
        <Router>
          <div className="flex h-screen font-sans transition-colors duration-300 bg-gray-50 dark:bg-gray-950">
            
            {/* Overlay escuro quando o menu mobile está aberto */}
            {menuAberto && (
              <div 
                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
                onClick={() => setMenuAberto(false)}
              ></div>
            )}

            <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              
              {/* Cabeçalho Mobile (Só aparece em ecrãs pequenos) */}
              <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 z-30">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-500 tracking-wider">
                  TECH<span className="text-gray-900 dark:text-white">USINAGEM</span>
                </div>
                <button 
                  onClick={() => setMenuAberto(true)} 
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  <Menu size={24} />
                </button>
              </header>

              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/maquinas" element={<Maquinas />} />
                  <Route path="/projetos" element={<Projetos />} />
                  <Route path="/orcamentos" element={<Orcamentos />} />
                </Routes>
              </main>
            </div>

          </div>
        </Router>
      </FerramentariaProvider>
    </ThemeProvider>
  );
}