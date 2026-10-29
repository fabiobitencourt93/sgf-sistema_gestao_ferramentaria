import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Wrench, Calculator, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ menuAberto, setMenuAberto }) {
  const location = useLocation();
  const { tema, alternarTema } = useTheme();

  const isActive = (path) => location.pathname === path 
    ? 'bg-blue-600 text-white shadow-md' 
    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800';

  const fecharMenu = () => setMenuAberto(false);

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-6 transition-all duration-300 ease-in-out transform 
      ${menuAberto ? 'translate-x-0' : '-translate-x-full'} 
      lg:relative lg:translate-x-0`}
    >
      
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-500 tracking-wider">
          TECH<span className="text-gray-900 dark:text-white">USINAGEM</span>
        </div>
        {/* Botão de fechar apenas no mobile */}
        <button onClick={fecharMenu} className="lg:hidden text-gray-500 hover:text-red-500">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex flex-col gap-3 flex-1 overflow-y-auto">
        <Link to="/" onClick={fecharMenu} className={`flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive('/')}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/orcamentos" onClick={fecharMenu} className={`flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive('/orcamentos')}`}>
          <Calculator size={20} /> Orçamentos
        </Link>
        <Link to="/projetos" onClick={fecharMenu} className={`flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive('/projetos')}`}>
          <Wrench size={20} /> Ordens & Desenhos
        </Link>
        <Link to="/maquinas" onClick={fecharMenu} className={`flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive('/maquinas')}`}>
          <Settings size={20} /> Parque Fabril
        </Link>
      </nav>

      <button 
        onClick={alternarTema} 
        className="flex items-center justify-center gap-3 p-3 mt-auto rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      >
        {tema === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-blue-600" />}
        <span className="font-medium">{tema === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
      </button>
    </aside>
  );
}