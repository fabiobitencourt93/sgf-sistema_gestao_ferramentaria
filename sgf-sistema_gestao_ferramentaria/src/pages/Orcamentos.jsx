import React, { useState, useEffect } from 'react';
import { useFerramentaria } from '../context/FerramentariaContext';
import { Calculator, Plus, ArrowRight, DollarSign } from 'lucide-react';

export default function Orcamentos() {
  const { maquinas, materiais, taxaMaoDeObra, adicionarProjeto } = useFerramentaria();

  const [nome, setNome] = useState('');
  const [materialId, setMaterialId] = useState(1);
  const [dimensoes, setDimensoes] = useState({ comp: 0, larg: 0, esp: 0 });
  const [horasProgramacao, setHorasProgramacao] = useState(0);
  const [margemLucro, setMargemLucro] = useState(30);
  const [roteiro, setRoteiro] = useState([]);

  const [custos, setCustos] = useState({ peso: 0, material: 0, usinagem: 0, maoDeObra: 0, total: 0, precoVenda: 0 });

  const addEtapa = () => setRoteiro([...roteiro, { id: Date.now(), maquinaId: '', operacao: '', tempo: 0 }]);
  
  const updateEtapa = (id, campo, valor) => {
    setRoteiro(roteiro.map(etapa => etapa.id === id ? { ...etapa, [campo]: valor } : etapa));
  };

  useEffect(() => {
    const matSelecionado = materiais.find(m => m.id === parseInt(materialId));
    const volumeCm3 = (dimensoes.comp * dimensoes.larg * dimensoes.esp) / 1000;
    const pesoKg = matSelecionado ? (volumeCm3 * matSelecionado.densidade) / 1000 : 0;
    const custoMaterial = pesoKg * (matSelecionado ? matSelecionado.precoKg : 0);

    const custoMO = horasProgramacao * taxaMaoDeObra;

    const custoUsinagem = roteiro.reduce((total, etapa) => {
      const maq = maquinas.find(m => m.id === parseInt(etapa.maquinaId));
      return total + (parseFloat(etapa.tempo || 0) * (maq ? maq.valorHora : 0));
    }, 0);

    const custoTotal = custoMaterial + custoMO + custoUsinagem;
    const precoVenda = custoTotal * (1 + (margemLucro / 100));

    setCustos({ peso: pesoKg, material: custoMaterial, usinagem: custoUsinagem, maoDeObra: custoMO, total: custoTotal, precoVenda });
  }, [dimensoes, materialId, horasProgramacao, roteiro, margemLucro, materiais, maquinas, taxaMaoDeObra]);

  const aprovarOrcamento = (e) => {
    e.preventDefault();
    if (!nome || roteiro.length === 0) return alert('Insira o nome da peça e adicione o roteiro.');
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    
    adicionarProjeto({
      nome, 
      deadline: deadline.toISOString().split('T')[0],
      desenho: null,
      roteiro, 
      status: 'Aprovado' 
    });
    
    alert(`Orçamento de ${nome} aprovado! Ordem de fabricação gerada.`);
    setNome(''); setRoteiro([]);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <h1 className="text-3xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4 flex items-center gap-3 text-gray-900 dark:text-white transition-colors duration-300">
        <Calculator className="text-blue-600 dark:text-blue-500" /> Orçamentos e Custos
      </h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <form className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-lg space-y-6 transition-colors duration-300">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Descrição do Componente</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white transition-colors duration-300" placeholder="Ex: Matriz Inferior..." />
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
              <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-4">Blank / Matéria-Prima</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Liga Metálica</label>
                  <select value={materialId} onChange={e => setMaterialId(e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm transition-colors duration-300">
                    {materiais.map(m => <option key={m.id} value={m.id}>{m.nome} (R$ {m.precoKg.toFixed(2)}/kg)</option>)}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">C (mm)</label>
                    <input type="number" onChange={e => setDimensoes({...dimensoes, comp: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm transition-colors duration-300" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">L (mm)</label>
                    <input type="number" onChange={e => setDimensoes({...dimensoes, larg: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm transition-colors duration-300" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">E (mm)</label>
                    <input type="number" onChange={e => setDimensoes({...dimensoes, esp: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
              <h3 className="text-blue-600 dark:text-blue-400 font-semibold mb-4">Engenharia / Setup</h3>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Horas de Programação CAM e Preparação (R$ {taxaMaoDeObra.toFixed(2)}/h)</label>
                <input type="number" value={horasProgramacao} onChange={e => setHorasProgramacao(e.target.value)} className="w-1/3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white text-sm transition-colors duration-300" placeholder="Horas..." />
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 p-4 rounded-lg bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-blue-600 dark:text-blue-400 font-semibold">Roteiro de Máquina</h3>
                <button type="button" onClick={addEtapa} className="flex items-center gap-1 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded transition-colors"><Plus size={14}/> Add Etapa</button>
              </div>
              
              <div className="space-y-2">
                {roteiro.map((etapa) => (
                  <div key={etapa.id} className="flex gap-2">
                    <select value={etapa.maquinaId} onChange={(e) => updateEtapa(etapa.id, 'maquinaId', e.target.value)} className="w-1/2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      <option value="">Selecione a Máquina...</option>
                      {maquinas.map(m => <option key={m.id} value={m.id}>{m.nome} (R$ {m.valorHora}/h)</option>)}
                    </select>
                    <input type="text" placeholder="Operação (Ex: Desbaste)" value={etapa.operacao} onChange={(e) => updateEtapa(etapa.id, 'operacao', e.target.value)} className="w-1/3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-900 dark:text-white transition-colors duration-300" />
                    <input type="number" placeholder="Horas" value={etapa.tempo} onChange={(e) => updateEtapa(etapa.id, 'tempo', e.target.value)} className="w-1/6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-200 dark:border-gray-800 pt-4 transition-colors duration-300">
              <label className="text-sm text-gray-600 dark:text-gray-400">Margem de Lucro Bruto (%)</label>
              <input type="number" value={margemLucro} onChange={e => setMargemLucro(e.target.value)} className="w-24 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white font-bold text-center transition-colors duration-300" />
            </div>
          </form>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-6 rounded-xl shadow-lg relative overflow-hidden transition-colors duration-300">
            <DollarSign className="absolute -right-4 -top-4 text-blue-500/10 dark:text-blue-500/10" size={120} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Resumo de Custos</h2>
            
            <div className="space-y-4 text-sm relative z-10">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Peso Calculado</span>
                <span className="text-gray-900 dark:text-white font-mono">{custos.peso.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Custo Matéria-Prima</span>
                <span className="text-red-600 dark:text-red-400 font-mono">R$ {custos.material.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Custo Engenharia (MO)</span>
                <span className="text-red-600 dark:text-red-400 font-mono">R$ {custos.maoDeObra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-gray-600 dark:text-gray-400">Custo Usinagem</span>
                <span className="text-red-600 dark:text-red-400 font-mono">R$ {custos.usinagem.toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-white dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-transparent transition-colors duration-300">
                <span className="text-gray-800 dark:text-gray-300 font-semibold">CUSTO TOTAL</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">R$ {custos.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-200 dark:border-blue-800/50 transition-colors duration-300">
              <span className="block text-xs text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider mb-1">Preço Sugerido de Venda</span>
              <span className="block text-4xl font-black text-emerald-600 dark:text-emerald-400">R$ {custos.precoVenda.toFixed(2)}</span>
            </div>

            <button onClick={aprovarOrcamento} className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors">
              Aprovar e Gerar Ordem <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}