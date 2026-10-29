import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../context/ThemeContext'; // Importamos o contexto do tema

const dadosProducao = [
  { dia: 'Seg', pecas: 120, refugo: 2 },
  { dia: 'Ter', pecas: 155, refugo: 1 },
  { dia: 'Qua', pecas: 180, refugo: 3 },
  { dia: 'Qui', pecas: 145, refugo: 0 },
  { dia: 'Sex', pecas: 195, refugo: 1 },
];

export default function Dashboard() {
  const { tema } = useTheme(); // Capturamos o tema atual ('light' ou 'dark')

  // Definimos variáveis de cor que mudam baseadas no tema
  const corEixo = tema === 'dark' ? '#9CA3AF' : '#4B5563'; // Cinza claro vs Cinza escuro
  const corGrade = tema === 'dark' ? '#1F2937' : '#E5E7EB'; // Linhas da grade
  const tooltipBg = tema === 'dark' ? '#111827' : '#FFFFFF'; // Fundo do balão flutuante
  const tooltipBorder = tema === 'dark' ? '#374151' : '#E5E7EB'; // Borda do balão
  const tooltipText = tema === 'dark' ? '#FFFFFF' : '#111827'; // Texto do balão

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Título com suporte a dark mode */}
      <h1 className="text-3xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4 text-gray-900 dark:text-white transition-colors duration-300">
        Desempenho Semanal
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Card 1: Volume de Usinagem */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg h-96 transition-colors duration-300">
          <h2 className="text-lg mb-6 font-semibold text-gray-700 dark:text-gray-400">
            Volume de Usinagem (Peças/Dia)
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosProducao}>
              <CartesianGrid strokeDasharray="3 3" stroke={corGrade} vertical={false} />
              <XAxis dataKey="dia" stroke={corEixo} tick={{ fill: corEixo }} />
              <YAxis stroke={corEixo} tick={{ fill: corEixo }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }} />
              <Bar dataKey="pecas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card 2: Índice de Refugo */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg h-96 transition-colors duration-300">
          <h2 className="text-lg mb-6 font-semibold text-gray-700 dark:text-gray-400">
            Índice de Refugo e Quebra de Ferramenta
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosProducao}>
              <CartesianGrid strokeDasharray="3 3" stroke={corGrade} vertical={false} />
              <XAxis dataKey="dia" stroke={corEixo} tick={{ fill: corEixo }} />
              <YAxis stroke={corEixo} tick={{ fill: corEixo }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }} />
              <Line type="monotone" dataKey="refugo" stroke="#EF4444" strokeWidth={3} dot={{ r: 6, fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}