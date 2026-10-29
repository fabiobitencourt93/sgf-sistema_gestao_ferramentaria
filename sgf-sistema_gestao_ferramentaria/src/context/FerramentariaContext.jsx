import React, { createContext, useState, useContext } from 'react';

const FerramentariaContext = createContext();

export function FerramentariaProvider({ children }) {
  const [maquinas, setMaquinas] = useState([
    { id: 1, nome: 'Centro de Usinagem ROMI D800', comando: 'FANUC 0i-MF', cargaTrabalho: 0, valorHora: 250.00 },
    { id: 2, nome: 'Eletroerosão a Fio Robocut α-C400iC', comando: 'FANUC Série α', cargaTrabalho: 0, valorHora: 300.00 },
    { id: 3, nome: 'Torno CNC Romi GL250M', comando: 'FANUC 0i-TF', cargaTrabalho: 0, valorHora: 220.00 },
    { id: 4, nome: 'Retífica Tangencial Plana', comando: 'Convencional', cargaTrabalho: 0, valorHora: 140.00 },
    { id: 5, nome: 'Torno Mecânico', comando: 'Convencional', cargaTrabalho: 0, valorHora: 120.00 },
    { id: 6, nome: 'Fresadora Ferramenteira', comando: 'Convencional', cargaTrabalho: 0, valorHora: 120.00 },
    { id: 7, nome: 'Bancada de Ferramentas', comando: 'Montagem/Ajustagem', cargaTrabalho: 0, valorHora: 110.00 },
  ]);

  const [materiais] = useState([
    { id: 1, nome: 'Aço SAE 1020', precoKg: 12.50, densidade: 7.85 },
    { id: 2, nome: 'Aço SAE D2', precoKg: 45.00, densidade: 7.70 },
    { id: 3, nome: 'Alumínio 6061', precoKg: 35.00, densidade: 2.70 },
    { id: 4, nome: 'Aço SAE 1045', precoKg: 15.50, densidade: 7.85 },
    { id: 5, nome: 'Aço SAE D6', precoKg: 50.00, densidade: 7.80 },
    { id: 6, nome: 'Aço SAE O1', precoKg: 35.00, densidade: 7.80 }

  ]);

  const taxaMaoDeObra = 180.00;
  const [projetos, setProjetos] = useState([]);

  const adicionarProjeto = (novoProjeto) => {
    setProjetos([...projetos, { ...novoProjeto, id: Date.now() }]);
    
    const maquinasAtualizadas = [...maquinas];
    novoProjeto.roteiro.forEach(etapa => {
      const maqIndex = maquinasAtualizadas.findIndex(m => m.id === parseInt(etapa.maquinaId));
      if (maqIndex !== -1) {
        maquinasAtualizadas[maqIndex].cargaTrabalho += parseFloat(etapa.tempo);
      }
    });
    setMaquinas(maquinasAtualizadas);
  };

  



  // Função auxiliar: Recalcula a carga de todas as máquinas sempre que um projeto muda
  const recalcularCargaMaquinas = (listaProjetos) => {
    // Começa com a carga a 0
    const maquinasZeradas = maquinas.map(m => ({ ...m, cargaTrabalho: 0 }));
    
    // Soma as horas de todos os projetos ativos
    listaProjetos.forEach(proj => {
      proj.roteiro.forEach(etapa => {
        const maq = maquinasZeradas.find(m => m.id === parseInt(etapa.maquinaId));
        if (maq) maq.cargaTrabalho += parseFloat(etapa.tempo || 0);
      });
    });
    setMaquinas(maquinasZeradas);
  };



  const editarProjeto = (id, projetoAtualizado) => {
    const novosProjetos = projetos.map(p => p.id === id ? { ...projetoAtualizado, id } : p);
    setProjetos(novosProjetos);
    recalcularCargaMaquinas(novosProjetos);
  };

  const removerProjeto = (id) => {
    if (window.confirm("Tem a certeza que deseja eliminar esta Ordem de Serviço? As horas planeadas serão removidas das máquinas.")) {
      const novosProjetos = projetos.filter(p => p.id !== id);
      setProjetos(novosProjetos);
      recalcularCargaMaquinas(novosProjetos);
    }
  };


  return (
    <FerramentariaContext.Provider value={{ 
      maquinas, materiais, taxaMaoDeObra, projetos, 
      adicionarProjeto, editarProjeto, removerProjeto 
    }}>
      {children}
    </FerramentariaContext.Provider>
  );
}

export const useFerramentaria = () => useContext(FerramentariaContext);