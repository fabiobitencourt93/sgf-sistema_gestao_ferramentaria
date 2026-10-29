import React from 'react';
import { useFerramentaria } from '../context/FerramentariaContext';

export default function Maquinas() {
  const { maquinas } = useFerramentaria();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h1 className="text-3xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4 text-gray-900 dark:text-white transition-colors duration-300">
        Parque Fabril / Carga Máquina
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {maquinas.map((maq) => (
          <div key={maq.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col p-6 transition-colors duration-300">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{maq.nome}</h2>
                <p className="text-blue-600 dark:text-blue-400 font-mono text-sm mt-1 transition-colors duration-300">{maq.comando}</p>
              </div>
              {/* Luz de Status */}
              <span className={`w-3 h-3 rounded-full shadow-lg ${maq.cargaTrabalho > 0 ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Fila de Usinagem Planejada:</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {maq.cargaTrabalho} <span className="text-base font-normal text-gray-500 dark:text-gray-500">horas</span>
                </span>
              </div>
              
              {/* Barra de progresso */}
              <div className="w-full bg-gray-100 dark:bg-gray-950 rounded-full h-2 mt-3 overflow-hidden transition-colors duration-300 border border-gray-200 dark:border-transparent">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${maq.cargaTrabalho > 40 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.min((maq.cargaTrabalho / 60) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}